#!/usr/bin/env python3
"""Fetch a bounded FAO HydroRIVERS screen and cross-screen local GeoNames points."""

from __future__ import annotations

import hashlib
import json
import math
import os
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
RUN_DATE = "2026-11-08"
RUN_DATE_COMPACT = "20261108"
SERVICE_ENDPOINT = "https://data.apps.fao.org/map/gsrv/gsrv1/aquamaps/wms"
CAPABILITIES_URL = "https://data.apps.fao.org/map/gsrv/gsrv1/aquamaps/wms?service=WFS&version=2.0.0&request=GetCapabilities"
LAYER = "aquamaps:river_network"
BOUNDARY_RELATIVE = Path(
    "data/research/philippines/raw/national/geoboundaries-phl-adm2-2020/geoBoundaries-PHL-ADM2_simplified-41af8f1.geojson"
)
GEONAMES_RELATIVE = Path(
    "data/research/philippines/raw/national/geonames-ph-20261107/calabarzon-hydrographic-candidates.jsonl"
)
RAW_DIR_RELATIVE = Path(f"data/research/philippines/raw/national/fao-hydrorivers-calabarzon-wfs-{RUN_DATE_COMPACT}")
NEAREST_QUEUE_RELATIVE = RAW_DIR_RELATIVE / "calabarzon-geonames-stream-nearest-hydrorivers.jsonl"
REPORT_RELATIVE = Path(
    f"data/research/philippines/national/reviews/fao-hydrorivers-calabarzon-wfs-screen-{RUN_DATE_COMPACT}.json"
)
BOUNDING_BOX = (120.45, 13.13, 122.82, 15.25)  # WGS84/CRS:84: west, south, east, north
CALABARZON_PROVINCES = {"Batangas", "Cavite", "Laguna", "Quezon", "Rizal"}
EXPECTED_HASHES = {
    BOUNDARY_RELATIVE.as_posix(): "fa77b9f17db2e419acaae714a935f7812be4409e2983675d34020e8426a3e189",
    GEONAMES_RELATIVE.as_posix(): "3b104459534ab8eb1f0fdb3b45d66c67f44954be863073dddee8ecd5cab8969a",
}
EXPECTED_MATCHED_FEATURES = 4719
PAGE_SIZE = 500
GRID_CELL_KM = 10.0
MAX_NEAREST_SCREEN_KM = 50.0
EARTH_RADIUS_KM = 6371.0088


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def write_immutable(path: Path, content: bytes, *, refresh: bool) -> None:
    if path.exists() and path.read_bytes() != content and not refresh:
        raise FileExistsError(f"Refusing to overwrite changed source output: {path}; rerun with --refresh")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    with temporary.open("wb") as output:
        output.write(content)
        output.flush()
        os.fsync(output.fileno())
    temporary.replace(path)


def read_pinned(relative: Path) -> tuple[bytes, Any]:
    raw = (ROOT / relative).read_bytes()
    expected = EXPECTED_HASHES[relative.as_posix()]
    actual = sha256_bytes(raw)
    if actual != expected:
        raise ValueError(f"Pinned input changed: {relative} (expected {expected}, got {actual})")
    if relative.suffix == ".jsonl":
        value = [json.loads(line) for line in raw.decode("utf-8").splitlines() if line.strip()]
    else:
        value = json.loads(raw.decode("utf-8"))
    return raw, value


def request_bytes(url: str, *, attempts: int = 3) -> bytes:
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            request = urllib.request.Request(
                url,
                headers={"User-Agent": "Bangwit research source verification/1.0", "Accept": "application/json, application/xml"},
            )
            with urllib.request.urlopen(request, timeout=90) as response:
                if response.status != 200:
                    raise RuntimeError(f"FAO WFS returned HTTP {response.status}")
                return response.read()
        except (urllib.error.URLError, TimeoutError, OSError, RuntimeError) as error:
            last_error = error
            if attempt + 1 < attempts:
                time.sleep(2**attempt)
    raise RuntimeError(f"FAO WFS request failed after {attempts} attempts: {last_error}")


def get_json(url: str) -> dict[str, Any]:
    try:
        value = json.loads(request_bytes(url).decode("utf-8"))
    except json.JSONDecodeError as error:
        raise RuntimeError(f"Expected WFS GeoJSON but response was not JSON: {error}") from error
    if value.get("type") != "FeatureCollection" or not isinstance(value.get("features"), list):
        raise RuntimeError("FAO WFS did not return a GeoJSON FeatureCollection")
    return value


def bbox_for_provinces(boundary: dict[str, Any]) -> dict[str, tuple[float, float, float, float]]:
    def walk_coordinates(node: Any, found: list[tuple[float, float]]) -> None:
        if isinstance(node, list):
            if len(node) >= 2 and isinstance(node[0], (int, float)) and isinstance(node[1], (int, float)):
                found.append((float(node[0]), float(node[1])))
            else:
                for child in node:
                    walk_coordinates(child, found)

    bounds = {}
    for feature in boundary.get("features", []):
        name = feature.get("properties", {}).get("shapeName")
        if name not in CALABARZON_PROVINCES:
            continue
        points: list[tuple[float, float]] = []
        walk_coordinates(feature.get("geometry", {}).get("coordinates", []), points)
        if not points:
            raise ValueError(f"Pinned boundary has no vertices for {name}")
        bounds[name] = (
            min(point[0] for point in points),
            min(point[1] for point in points),
            max(point[0] for point in points),
            max(point[1] for point in points),
        )
    if set(bounds) != CALABARZON_PROVINCES:
        raise ValueError("Pinned boundary does not contain exactly the five CALABARZON province polygons")
    union = (
        min(row[0] for row in bounds.values()),
        min(row[1] for row in bounds.values()),
        max(row[2] for row in bounds.values()),
        max(row[3] for row in bounds.values()),
    )
    west, south, east, north = BOUNDING_BOX
    if not (west <= union[0] and south <= union[1] and east >= union[2] and north >= union[3]):
        raise ValueError("Pinned WFS bounding box no longer covers every selected CALABARZON polygon")
    return {"provinceBounds": bounds, "unionBounds": union}


def line_parts(feature: dict[str, Any]) -> list[list[list[float]]]:
    geometry = feature.get("geometry") or {}
    coords = geometry.get("coordinates") or []
    if geometry.get("type") == "LineString":
        return [coords]
    if geometry.get("type") == "MultiLineString":
        return coords
    return []


def projected_point(lon: float, lat: float, center_lon: float, center_lat: float) -> tuple[float, float]:
    scale = EARTH_RADIUS_KM * math.pi / 180.0
    return ((lon - center_lon) * scale * math.cos(math.radians(center_lat)), (lat - center_lat) * scale)


def point_segment_distance_km(px: float, py: float, segment: tuple[float, float, float, float]) -> float:
    x1, y1, x2, y2 = segment
    dx, dy = x2 - x1, y2 - y1
    denominator = dx * dx + dy * dy
    if denominator == 0:
        return math.hypot(px - x1, py - y1)
    fraction = max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / denominator))
    return math.hypot(px - (x1 + fraction * dx), py - (y1 + fraction * dy))


def nearest_reach_rows(
    geo_candidates: list[dict[str, Any]], features: list[dict[str, Any]], center_lon: float, center_lat: float
) -> tuple[list[dict[str, Any]], Counter[str]]:
    prepared = []
    grid: dict[tuple[int, int], set[int]] = defaultdict(set)
    for index, feature in enumerate(features):
        segments = []
        all_points: list[tuple[float, float]] = []
        for part in line_parts(feature):
            projected = []
            for coordinate in part:
                if len(coordinate) < 2:
                    continue
                point = projected_point(float(coordinate[0]), float(coordinate[1]), center_lon, center_lat)
                projected.append(point)
                all_points.append(point)
            for start, end in zip(projected, projected[1:]):
                segments.append((start[0], start[1], end[0], end[1]))
        if not segments or not all_points:
            continue
        min_x, max_x = min(p[0] for p in all_points), max(p[0] for p in all_points)
        min_y, max_y = min(p[1] for p in all_points), max(p[1] for p in all_points)
        prepared.append(
            {
                "feature": feature,
                "segments": segments,
                "bbox": (min_x, min_y, max_x, max_y),
                "properties": feature.get("properties") or {},
            }
        )
        prepared_index = len(prepared) - 1
        min_cell_x, max_cell_x = math.floor(min_x / GRID_CELL_KM), math.floor(max_x / GRID_CELL_KM)
        min_cell_y, max_cell_y = math.floor(min_y / GRID_CELL_KM), math.floor(max_y / GRID_CELL_KM)
        if (max_cell_x - min_cell_x + 1) * (max_cell_y - min_cell_y + 1) > 5000:
            raise ValueError("A returned river geometry spans too many grid cells for the local nearest-point screen")
        for cell_x in range(min_cell_x, max_cell_x + 1):
            for cell_y in range(min_cell_y, max_cell_y + 1):
                grid[(cell_x, cell_y)].add(prepared_index)

    results = []
    thresholds = Counter()
    radius_cells = math.ceil(MAX_NEAREST_SCREEN_KM / GRID_CELL_KM) + 1
    for candidate in geo_candidates:
        lon = float(candidate["longitudeWgs84"])
        lat = float(candidate["latitudeWgs84"])
        px, py = projected_point(lon, lat, center_lon, center_lat)
        cx, cy = math.floor(px / GRID_CELL_KM), math.floor(py / GRID_CELL_KM)
        candidate_indices = set()
        for offset_x in range(-radius_cells, radius_cells + 1):
            for offset_y in range(-radius_cells, radius_cells + 1):
                candidate_indices.update(grid.get((cx + offset_x, cy + offset_y), ()))
        nearest_distance = math.inf
        nearest: dict[str, Any] | None = None
        for index in candidate_indices:
            record = prepared[index]
            min_x, min_y, max_x, max_y = record["bbox"]
            lower_bound = math.hypot(max(min_x - px, 0.0, px - max_x), max(min_y - py, 0.0, py - max_y))
            if lower_bound >= nearest_distance or lower_bound > MAX_NEAREST_SCREEN_KM:
                continue
            feature_distance = min(point_segment_distance_km(px, py, segment) for segment in record["segments"])
            if feature_distance < nearest_distance:
                nearest_distance = feature_distance
                nearest = record
        if nearest is not None and nearest_distance <= MAX_NEAREST_SCREEN_KM:
            properties = nearest["properties"]
            hydrorivers_id = properties.get("hyriv_id", properties.get("HYRIV_ID"))
            nearest_info = {
                "hyrivId": hydrorivers_id,
                "mainRiverIdentifier": properties.get("main_riv", properties.get("MAIN_RIV")),
                "streamOrder": properties.get("ord_flow", properties.get("ORD_FLOW")),
                "catchmentAreaKm2": properties.get("catch_skm", properties.get("CATCH_SKM")),
                "geometryType": (nearest["feature"].get("geometry") or {}).get("type"),
                "distanceKm": round(nearest_distance, 3),
            }
            for threshold in (1, 5, 10, 25, 50):
                if nearest_distance <= threshold:
                    thresholds[f"within{threshold}Km"] += 1
        else:
            nearest_info = None
            nearest_distance = None
        results.append(
            {
                "geonameId": int(candidate["geonameId"]),
                "name": candidate["name"],
                "featureCode": candidate["featureCode"],
                "provincePolygonPointContext": candidate["singlePolygonPointContext"],
                "geonamesPointWgs84": {"longitude": lon, "latitude": lat},
                "nearestHydroRiversCandidate": nearest_info,
                "hasReachWithin50KmScreen": nearest_info is not None,
                "identityAndAdministrativeAssignmentValidated": False,
                "reviewStatus": "nearest-modeled-line-proximity-lead-only;no-river-name-or-reach-identity-asserted",
            }
        )
    return results, thresholds


def main() -> int:
    refresh = "--refresh" in sys.argv[1:]
    raw_dir = ROOT / RAW_DIR_RELATIVE
    raw_dir.mkdir(parents=True, exist_ok=True)
    ignored_raw = subprocess.run(
        ["git", "check-ignore", "--quiet", (RAW_DIR_RELATIVE / "placeholder").as_posix()], cwd=ROOT, check=False
    )
    if ignored_raw.returncode != 0:
        raise RuntimeError("FAO raw data directory is not Git-ignored; refusing to retrieve river geometry")

    boundary_bytes, boundary = read_pinned(BOUNDARY_RELATIVE)
    geonames_bytes, geonames = read_pinned(GEONAMES_RELATIVE)
    bounds = bbox_for_provinces(boundary)
    stream_candidates = [row for row in geonames if row.get("sourceFeatureGroup") == "stream_channel_or_waterfall"]
    if len(stream_candidates) != 783:
        raise ValueError("Pinned CALABARZON stream candidate count changed")

    capability_bytes = request_bytes(CAPABILITIES_URL)
    if b"aquamaps:river_network" not in capability_bytes:
        raise RuntimeError("Current FAO WFS capabilities no longer advertise aquamaps:river_network")
    write_immutable(raw_dir / "get-capabilities.xml", capability_bytes, refresh=refresh)

    query = {
        "service": "WFS",
        "version": "2.0.0",
        "request": "GetFeature",
        "typeNames": LAYER,
        "bbox": f"{BOUNDING_BOX[0]},{BOUNDING_BOX[1]},{BOUNDING_BOX[2]},{BOUNDING_BOX[3]},CRS:84",
        "resultType": "hits",
    }
    hits_url = SERVICE_ENDPOINT + "?" + urllib.parse.urlencode(query)
    hits_response = request_bytes(hits_url)
    hits_root = ET.fromstring(hits_response)
    number_matched = int(hits_root.attrib.get("numberMatched", "-1"))
    if number_matched != EXPECTED_MATCHED_FEATURES:
        raise ValueError(
            f"FAO WFS bbox count changed: expected {EXPECTED_MATCHED_FEATURES}, got {number_matched}; inspect a new source snapshot before accepting it"
        )
    service_timestamp = hits_root.attrib.get("timeStamp")
    write_immutable(raw_dir / "get-hits.xml", hits_response, refresh=refresh)

    all_features = []
    page_receipts = []
    for start_index in range(0, number_matched, PAGE_SIZE):
        page_query = {key: value for key, value in query.items() if key != "resultType"}
        page_query.update(
            {
                "count": str(PAGE_SIZE),
                "startIndex": str(start_index),
                "outputFormat": "application/json",
                "sortBy": "hyriv_id",
            }
        )
        url = SERVICE_ENDPOINT + "?" + urllib.parse.urlencode(page_query)
        page_bytes = request_bytes(url)
        page = json.loads(page_bytes.decode("utf-8"))
        if page.get("type") != "FeatureCollection" or not isinstance(page.get("features"), list):
            raise RuntimeError(f"WFS page at offset {start_index} was not a GeoJSON FeatureCollection")
        page_features = page["features"]
        expected_returned = min(PAGE_SIZE, number_matched - start_index)
        if len(page_features) != expected_returned or int(page.get("numberMatched", -1)) != number_matched:
            raise RuntimeError(
                f"Unexpected WFS page size at offset {start_index}: {len(page_features)}; expected {expected_returned}"
            )
        page_path_relative = RAW_DIR_RELATIVE / f"page-{start_index:05d}.geojson"
        write_immutable(ROOT / page_path_relative, page_bytes, refresh=refresh)
        page_receipts.append(
            {
                "startIndex": start_index,
                "numberReturned": len(page_features),
                "path": page_path_relative.as_posix(),
                "bytes": len(page_bytes),
                "sha256": sha256_bytes(page_bytes),
                "serviceTimestamp": page.get("timeStamp"),
            }
        )
        all_features.extend(page_features)
        print(f"Retrieved {len(all_features)} / {number_matched} HydroRIVERS bbox features")
        time.sleep(0.25)

    ids = [str((feature.get("properties") or {}).get("hyriv_id", (feature.get("properties") or {}).get("HYRIV_ID", ""))) for feature in all_features]
    if len(set(ids)) != len(ids) or any(not value for value in ids):
        raise ValueError("HydroRIVERS page results contain duplicate or missing HYRIV_ID values")
    geometry_types = Counter((feature.get("geometry") or {}).get("type", "MISSING") for feature in all_features)

    center_lon = (BOUNDING_BOX[0] + BOUNDING_BOX[2]) / 2
    center_lat = (BOUNDING_BOX[1] + BOUNDING_BOX[3]) / 2
    nearest_rows, proximity_counts = nearest_reach_rows(stream_candidates, all_features, center_lon, center_lat)
    nearest_bytes = "".join(
        json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in nearest_rows
    ).encode("utf-8")
    write_immutable(ROOT / NEAREST_QUEUE_RELATIVE, nearest_bytes, refresh=refresh)
    if subprocess.run(
        ["git", "check-ignore", "--quiet", NEAREST_QUEUE_RELATIVE.as_posix()], cwd=ROOT, check=False
    ).returncode != 0:
        (ROOT / NEAREST_QUEUE_RELATIVE).unlink(missing_ok=True)
        raise RuntimeError("Nearest-line review queue is not Git-ignored; removed it to prevent accidental publication")

    report = {
        "schemaVersion": 1,
        "reviewId": f"fao-hydrorivers-calabarzon-wfs-screen-{RUN_DATE_COMPACT}",
        "generatedOn": RUN_DATE,
        "status": "fao-wfs-bbox-retrieved-to-ignored-research-storage;nearest-line-proximity-screen-built;license-and-identity-review-pending",
        "source": {
            "provider": "FAO AQUASTAT",
            "dataset": "Rivers (Global - edition 2026)",
            "catalogUrl": "https://data.fao.org/catalog/dataset/e22667af-3977-4e9f-b58b-67fb91b0fa87",
            "serviceEndpoint": SERVICE_ENDPOINT,
            "serviceVersion": "WFS 2.0.0",
            "queryLayer": LAYER,
            "hydroriversProductUrl": "https://www.hydrosheds.org/products/hydrorivers",
            "technicalDocumentationUrl": "https://data.hydrosheds.org/file/technical-documentation/HydroRIVERS_TechDoc_v10.pdf",
            "catalogLicense": "CC BY 4.0 per the FAO catalog; underlying HydroSHEDS v1 terms require separate reconciliation before app distribution",
            "sourceNetworkThreshold": "catchment area >=10 km2 or long-term average flow >=0.1 m3/s or both, per HydroRIVERS product description",
            "sourceResolution": "15 arc-second source DEM, per HydroRIVERS product description",
        },
        "scope": {
            "reviewScope": "CALABARZON discovery query window, not an administrative subset",
            "inputAdminPolygons": BOUNDARY_RELATIVE.as_posix(),
            "provincePolygonBoundsWgs84": {
                name: [round(value, 6) for value in province_bounds]
                for name, province_bounds in sorted(bounds["provinceBounds"].items())
            },
            "unionProvinceBoundsWgs84": [round(value, 6) for value in bounds["unionBounds"]],
            "queryBoundingBoxCrs84": [BOUNDING_BOX[0], BOUNDING_BOX[1], BOUNDING_BOX[2], BOUNDING_BOX[3]],
            "boundingBoxIncludesMarginAndAdjacentAreas": True,
            "wfsHitTimestamp": service_timestamp,
            "serviceHitCount": number_matched,
        },
        "provenance": {
            BOUNDARY_RELATIVE.as_posix(): {"sha256": sha256_bytes(boundary_bytes), "bytes": len(boundary_bytes)},
            GEONAMES_RELATIVE.as_posix(): {"sha256": sha256_bytes(geonames_bytes), "bytes": len(geonames_bytes)},
            "capabilities": {
                "path": (RAW_DIR_RELATIVE / "get-capabilities.xml").as_posix(),
                "bytes": len(capability_bytes),
                "sha256": sha256_bytes(capability_bytes),
            },
            "hitCountResponse": {
                "path": (RAW_DIR_RELATIVE / "get-hits.xml").as_posix(),
                "bytes": len(hits_response),
                "sha256": sha256_bytes(hits_response),
            },
            "pages": page_receipts,
        },
        "results": {
            "retrievedFeatureRows": len(all_features),
            "uniqueHydroRiversIds": len(set(ids)),
            "geometryTypes": dict(sorted(geometry_types.items())),
            "geonamesStreamGroupRowsScreened": len(stream_candidates),
            "geonamesPointsWithNearestModeledLineWithin50Km": proximity_counts["within50Km"],
            "nearestLineDistanceScreenCounts": {
                str(threshold): proximity_counts[f"within{threshold}Km"]
                for threshold in (1, 5, 10, 25, 50)
            },
            "riverReachIdentitiesValidated": 0,
            "regionAssignmentsAdded": 0,
            "speciesAssertionsAdded": 0,
            "publicGeometryAdded": False,
            "publicationApproval": False,
        },
        "localResearchStorage": {
            "rawDirectory": RAW_DIR_RELATIVE.as_posix(),
            "rawDataGitIgnored": True,
            "nearestLineQueue": NEAREST_QUEUE_RELATIVE.as_posix(),
            "nearestLineQueueRows": len(nearest_rows),
            "nearestLineQueueBytes": len(nearest_bytes),
            "nearestLineQueueSha256": sha256_bytes(nearest_bytes),
            "nearestLineQueueGitIgnored": True,
            "appBundleIncluded": False,
        },
        "rightsAndLimitations": [
            "The FAO catalog labels the 2026 dataset CC BY 4.0. The underlying HydroSHEDS v1 product documentation separately states conditions for integration, distribution, end-user licensing, attribution and liability; no legal interpretation or app publication approval is made here.",
            "The WFS query selects every modeled reach intersecting a rectangular bounding box that covers the five CALABARZON province polygons plus surrounding areas; returned features are not an exact CALABARZON subset.",
            "The source network threshold excludes many small streams and watercourses; missing reach features do not prove that a named river or stream does not exist.",
            "The local nearest-line calculation uses a regional equirectangular projection for candidate prioritization. Proximity does not establish that the GeoNames point and modeled reach describe the same named watercourse.",
            "HydroRIVERS is modeled river-network geometry, not field-verified current channels, lake/wetland inventory, fish observations, water-quality evidence, fishing access, legal boundaries or safety data.",
            "All geometry and row-level nearest-line pairs remain in Git-ignored research storage and are excluded from app data and public assets.",
        ],
        "nextAction": "Resolve the HydroSHEDS/FAO use terms with a qualified reviewer before any external display. Meanwhile compare the ignored nearest-line queue against primary regional river maps and studies, prioritizing the 45 GeoNames names already linked to scope leads and all province-context conflicts.",
    }
    report_bytes = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    write_immutable(ROOT / REPORT_RELATIVE, report_bytes, refresh=refresh)
    print(f"HydroRIVERS line features in CALABARZON bbox: {len(all_features)}; unique IDs: {len(set(ids))}")
    print(
        "GeoNames stream points within 1/5/10/25/50 km of a modeled line: "
        + "/".join(str(proximity_counts[f"within{threshold}Km"]) for threshold in (1, 5, 10, 25, 50))
    )
    print("River identity validations: 0; region assignments: 0; species assertions: 0; public geometry: none")
    print(f"Git-ignored WFS snapshot: {RAW_DIR_RELATIVE}")
    print(f"Aggregate review: {REPORT_RELATIVE}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
