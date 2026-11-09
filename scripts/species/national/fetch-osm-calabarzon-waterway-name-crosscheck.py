#!/usr/bin/env python3
"""Fetch a bounded OSM waterway-name cross-check for CALABARZON stream leads."""

from __future__ import annotations

import hashlib
import json
import math
import os
import re
import subprocess
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
RUN_DATE = "2026-11-08"
RUN_DATE_COMPACT = "20261108"
OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter"
SCOPE_QUEUE_RELATIVE = Path(
    "data/research/philippines/raw/national/geonames-ph-20261107/calabarzon-stream-scope-review.jsonl"
)
RAW_DIR_RELATIVE = Path(
    f"data/research/philippines/raw/national/osm-calabarzon-waterway-name-crosscheck-{RUN_DATE_COMPACT}"
)
RAW_RESPONSE_RELATIVE = RAW_DIR_RELATIVE / "overpass-response.json"
LOCAL_QUEUE_RELATIVE = RAW_DIR_RELATIVE / "candidate-crosscheck.jsonl"
REPORT_RELATIVE = Path(
    f"data/research/philippines/national/reviews/osm-calabarzon-waterway-name-crosscheck-{RUN_DATE_COMPACT}.json"
)
EXPECTED_SCOPE_QUEUE_SHA256 = "5b535f6d65872f224b72c2d1f300b3d9b08ee8d076b041af00a2c8acaa76c454"
BOUNDING_BOX_WGS84 = (120.45, 13.13, 122.82, 15.25)  # west, south, east, north; includes margin and adjacent areas
GENERIC_WATER_TERMS = {
    "river", "rivers", "stream", "streams", "creek", "creeks", "brook", "brooks",
    "watercourse", "watercourses", "channel", "channels", "canal", "canals",
    "tributary", "tributaries", "branch", "branches", "fork", "forks", "falls",
    "waterfall", "waterfalls",
}
DISTANCE_THRESHOLDS_KM = (1, 5, 10, 25, 50)
EARTH_RADIUS_KM = 6371.0088


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def normalize(value: str | None) -> str:
    if not value:
        return ""
    decomposed = unicodedata.normalize("NFKD", value.casefold())
    ascii_name = "".join(char for char in decomposed if not unicodedata.combining(char))
    tokens = re.findall(r"[a-z0-9]+", ascii_name)
    return " ".join(token for token in tokens if token not in GENERIC_WATER_TERMS)


def escape_posix_ere(value: str) -> str:
    special = set("\\.^$|()[]*+?{}")
    return "".join("\\" + char if char in special else char for char in value)


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


def assert_ignored(relative: Path) -> None:
    if subprocess.run(["git", "check-ignore", "--quiet", relative.as_posix()], cwd=ROOT, check=False).returncode != 0:
        raise RuntimeError(f"Research data path is not Git-ignored; refusing to write row-level data: {relative}")


def read_scope_candidates() -> tuple[bytes, list[dict[str, Any]]]:
    raw = (ROOT / SCOPE_QUEUE_RELATIVE).read_bytes()
    digest = sha256_bytes(raw)
    if digest != EXPECTED_SCOPE_QUEUE_SHA256:
        raise ValueError(f"Pinned candidate queue changed: expected {EXPECTED_SCOPE_QUEUE_SHA256}, got {digest}")
    rows = [json.loads(line) for line in raw.decode("utf-8").splitlines() if line.strip()]
    if len(rows) != 45:
        raise ValueError(f"Expected 45 pinned scope-name candidates, got {len(rows)}")
    if any(row.get("sourceFeatureGroup") != "stream_channel_or_waterfall" for row in rows):
        raise ValueError("The pinned candidate queue includes a non-stream source feature group")
    return raw, rows


def build_query(candidates: list[dict[str, Any]]) -> str:
    names = sorted({row["name"].strip() for row in candidates if row.get("name", "").strip()})
    if not names:
        raise ValueError("No candidate names are available for the bounded OSM lookup")
    regex = "^(" + "|".join(escape_posix_ere(name) for name in names) + ")$"
    ql_regex = json.dumps(regex, ensure_ascii=False)
    west, south, east, north = BOUNDING_BOX_WGS84
    bbox = f"{south},{west},{north},{east}"
    return (
        "[out:json][timeout:90];\n"
        "(\n"
        f"  nwr[\"waterway\"][\"name\"~{ql_regex},i]({bbox});\n"
        ");\n"
        "out geom;\n"
    )


def fetch_overpass(query: str, attempts: int = 3) -> bytes:
    body = urllib.parse.urlencode({"data": query}).encode("utf-8")
    last_error: Exception | None = None
    for attempt in range(attempts):
        request = urllib.request.Request(
            OVERPASS_ENDPOINT,
            data=body,
            headers={
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                "Accept": "application/json",
                "User-Agent": "Bangwit research source verification/1.0",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                if response.status != 200:
                    raise RuntimeError(f"Overpass returned HTTP {response.status}")
                return response.read()
        except urllib.error.HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace").strip().replace("\r", " ").replace("\n", " ")
            if error.code < 500 and error.code != 429:
                raise RuntimeError(f"Overpass rejected query with HTTP {error.code}: {detail[:600]}") from error
            last_error = RuntimeError(f"HTTP {error.code}: {detail[:600]}")
            if attempt + 1 < attempts:
                time.sleep(3 * (2**attempt))
        except (urllib.error.URLError, TimeoutError, OSError, RuntimeError) as error:
            last_error = error
            if attempt + 1 < attempts:
                time.sleep(3 * (2**attempt))
    raise RuntimeError(f"Overpass request failed after {attempts} attempts: {last_error}")


def projected(lon: float, lat: float, center_lon: float, center_lat: float) -> tuple[float, float]:
    scale = EARTH_RADIUS_KM * math.pi / 180.0
    return ((lon - center_lon) * scale * math.cos(math.radians(center_lat)), (lat - center_lat) * scale)


def point_segment_distance(px: float, py: float, segment: tuple[float, float, float, float]) -> float:
    x1, y1, x2, y2 = segment
    dx, dy = x2 - x1, y2 - y1
    denominator = dx * dx + dy * dy
    if denominator == 0:
        return math.hypot(px - x1, py - y1)
    fraction = max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / denominator))
    return math.hypot(px - (x1 + fraction * dx), py - (y1 + fraction * dy))


def element_coordinate_sequences(element: dict[str, Any]) -> list[list[tuple[float, float]]]:
    if element.get("type") == "node" and isinstance(element.get("lon"), (int, float)):
        return [[(float(element["lon"]), float(element["lat"]))]]
    sequences = []
    geometry = element.get("geometry")
    if isinstance(geometry, list):
        sequence = [(float(row["lon"]), float(row["lat"])) for row in geometry if "lon" in row and "lat" in row]
        if sequence:
            sequences.append(sequence)
    for member in element.get("members", []):
        member_geometry = member.get("geometry")
        if isinstance(member_geometry, list):
            sequence = [
                (float(row["lon"]), float(row["lat"]))
                for row in member_geometry
                if "lon" in row and "lat" in row
            ]
            if sequence:
                sequences.append(sequence)
    return sequences


def distance_to_element_km(
    lon: float, lat: float, element: dict[str, Any], center_lon: float, center_lat: float
) -> float | None:
    px, py = projected(lon, lat, center_lon, center_lat)
    distances = []
    for sequence in element_coordinate_sequences(element):
        projected_points = [projected(point_lon, point_lat, center_lon, center_lat) for point_lon, point_lat in sequence]
        if len(projected_points) == 1:
            distances.append(math.hypot(px - projected_points[0][0], py - projected_points[0][1]))
        else:
            distances.extend(
                point_segment_distance(px, py, (start[0], start[1], end[0], end[1]))
                for start, end in zip(projected_points, projected_points[1:])
            )
    return min(distances) if distances else None


def main() -> int:
    refresh = "--refresh" in sys.argv[1:]
    assert_ignored(RAW_RESPONSE_RELATIVE)
    assert_ignored(LOCAL_QUEUE_RELATIVE)
    scope_bytes, candidates = read_scope_candidates()
    query = build_query(candidates)
    response_bytes = fetch_overpass(query)
    try:
        response = json.loads(response_bytes.decode("utf-8"))
    except json.JSONDecodeError as error:
        raise RuntimeError(f"Overpass response was not valid JSON: {error}") from error
    elements = response.get("elements")
    if not isinstance(elements, list):
        raise RuntimeError("Overpass response has no elements array")
    write_immutable(ROOT / RAW_RESPONSE_RELATIVE, response_bytes, refresh=refresh)

    elements_by_name: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for element in elements:
        tags = element.get("tags") or {}
        if not tags.get("waterway") or not tags.get("name"):
            continue
        key = normalize(str(tags["name"]))
        if key:
            elements_by_name[key].append(element)

    west, south, east, north = BOUNDING_BOX_WGS84
    center_lon, center_lat = (west + east) / 2, (south + north) / 2
    local_rows = []
    matched_geo_ids: set[int] = set()
    matched_osm_ids: set[str] = set()
    candidate_distance_counts: Counter[str] = Counter()
    scope_pair_counts: Counter[str] = Counter()
    matched_scope_ids: set[str] = set()

    for candidate in candidates:
        key = str(candidate.get("normalizedComparisonKey") or normalize(candidate.get("name")))
        matching = elements_by_name.get(key, [])
        distance_rows = []
        lon = float(candidate["pointWgs84"]["longitude"])
        lat = float(candidate["pointWgs84"]["latitude"])
        for element in matching:
            distance = distance_to_element_km(lon, lat, element, center_lon, center_lat)
            if distance is None:
                continue
            tags = element.get("tags") or {}
            osm_id = f"{element.get('type')}/{element.get('id')}"
            distance_rows.append(
                {
                    "osmElementId": osm_id,
                    "elementType": element.get("type"),
                    "name": tags.get("name"),
                    "waterway": tags.get("waterway"),
                    "distanceKm": round(distance, 3),
                    "version": element.get("version"),
                    "timestamp": element.get("timestamp"),
                }
            )
            matched_osm_ids.add(osm_id)
        distance_rows.sort(key=lambda row: (row["distanceKm"], row["osmElementId"]))
        nearest_distance = distance_rows[0]["distanceKm"] if distance_rows else None
        scope_matches = candidate.get("matches", [])
        if distance_rows:
            matched_geo_ids.add(int(candidate["geonameId"]))
            for scope_match in scope_matches:
                matched_scope_ids.add(str(scope_match.get("waterbodyId", "")))
                comparison = str(scope_match.get("provinceContextComparison", "unresolved"))
                for threshold in DISTANCE_THRESHOLDS_KM:
                    if nearest_distance is not None and nearest_distance <= threshold:
                        scope_pair_counts[f"{comparison}:{threshold}Km"] += 1
            for threshold in DISTANCE_THRESHOLDS_KM:
                if nearest_distance is not None and nearest_distance <= threshold:
                    candidate_distance_counts[str(threshold)] += 1
        local_rows.append(
            {
                "geonameId": int(candidate["geonameId"]),
                "candidateName": candidate.get("name"),
                "candidateProvincePolygonPointContext": candidate.get("candidateProvincePolygonPointContext"),
                "candidatePointWgs84": candidate.get("pointWgs84"),
                "scopeLeadPairs": [
                    {
                        "scopeLeadId": match.get("waterbodyId"),
                        "provinceContextComparison": match.get("provinceContextComparison"),
                    }
                    for match in scope_matches
                ],
                "sameNormalizedNameOsmWaterwayFeatures": distance_rows,
                "nearestSameNameOsmWaterwayDistanceKm": nearest_distance,
                "reviewStatus": "community-map-name-and-geometry-cross-check-lead-only;identity-not-validated",
            }
        )

    local_rows.sort(key=lambda row: int(row["geonameId"]))
    local_queue_bytes = "".join(
        json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in local_rows
    ).encode("utf-8")
    write_immutable(ROOT / LOCAL_QUEUE_RELATIVE, local_queue_bytes, refresh=refresh)
    assert_ignored(RAW_RESPONSE_RELATIVE)
    assert_ignored(LOCAL_QUEUE_RELATIVE)

    osm3s = response.get("osm3s") or {}
    returned_element_types = Counter(str(element.get("type")) for element in elements)
    returned_waterway_values = Counter(
        str((element.get("tags") or {}).get("waterway")) for element in elements
    )
    report = {
        "schemaVersion": 1,
        "reviewId": f"osm-calabarzon-waterway-name-crosscheck-{RUN_DATE_COMPACT}",
        "generatedOn": RUN_DATE,
        "status": "bounded-overpass-query-complete;community-map-cross-check-only;manual-identity-and-rights-review-pending",
        "source": {
            "provider": "OpenStreetMap contributors via Overpass API",
            "endpoint": OVERPASS_ENDPOINT,
            "queryType": "one bounded Overpass QL query for named waterway-tagged nodes, ways and relations matching the 45 pinned GeoNames stream-scope candidates",
            "queryBoundingBoxWgs84": list(BOUNDING_BOX_WGS84),
            "queryBoundsIncludeMarginAndAdjacentAreas": True,
            "osmDataTimestamp": osm3s.get("timestamp_osm_base"),
            "copyrightUrl": "https://www.openstreetmap.org/copyright",
            "license": "Open Database License 1.0 (ODbL)",
        },
        "provenance": {
            SCOPE_QUEUE_RELATIVE.as_posix(): {"sha256": sha256_bytes(scope_bytes), "rows": len(candidates)},
            "overpassQuerySha256": sha256_bytes(query.encode("utf-8")),
            "overpassResponse": {
                "path": RAW_RESPONSE_RELATIVE.as_posix(),
                "bytes": len(response_bytes),
                "sha256": sha256_bytes(response_bytes),
                "elementRows": len(elements),
            },
        },
        "results": {
            "returnedOsmElementRows": len(elements),
            "returnedWaterwayNameElementRows": sum(
                1 for element in elements if (element.get("tags") or {}).get("waterway") and (element.get("tags") or {}).get("name")
            ),
            "returnedElementsByType": dict(sorted(returned_element_types.items())),
            "returnedElementsByWaterwayValue": dict(sorted(returned_waterway_values.items())),
            "distinctMatchedOsmElementIds": len(matched_osm_ids),
            "candidateRowsWithSameNormalizedNameOsmWaterway": len(matched_geo_ids),
            "distinctScopeLeadIdsWithSameNameOsmFeature": len(matched_scope_ids),
            "candidateRowsWithinDistanceKmOfSameNameOsmFeature": dict(
                sorted(candidate_distance_counts.items(), key=lambda item: int(item[0]))
            ),
            "scopeLeadPairsWithinDistanceKmOfSameNameOsmFeature": dict(sorted(scope_pair_counts.items())),
            "waterwayIdentitiesValidated": 0,
            "speciesAssertionsAdded": 0,
            "regionAssignmentsAdded": 0,
            "appGeometryAdded": False,
            "publicationApproval": False,
        },
        "localResearchStorage": {
            "rawDirectory": RAW_DIR_RELATIVE.as_posix(),
            "rawDirectoryGitIgnored": True,
            "candidateCrosswalkQueue": LOCAL_QUEUE_RELATIVE.as_posix(),
            "candidateCrosswalkRows": len(local_rows),
            "candidateCrosswalkSha256": sha256_bytes(local_queue_bytes),
            "candidateCrosswalkGitIgnored": True,
        },
        "limitations": [
            "OpenStreetMap is a community-maintained map, not an official hydrographic survey or primary species-occurrence source.",
            "The query retrieves only named waterway-tagged elements whose names match the candidate strings inside a large bounding box; it is not a complete regional waterway search.",
            "Name normalization and point-to-line proximity do not establish that an OSM feature, GeoNames candidate and CALABARZON scope lead are the same watercourse.",
            "Mapped geometry and completeness vary; a missing OSM feature is not evidence that a river or stream is absent.",
            "OSM data are ODbL; raw geometry and exact row-level crosswalks remain Git-ignored pending rights and product-distribution review.",
            "No species occurrence, habitat, water quality, fishing access, safety or legal-boundary claims are generated by this screen.",
        ],
        "nextAction": "Use any same-name, nearby OSM feature only to prioritize manual comparison with source-linked studies and independent records; do not treat OSM/HydroRIVERS name or geometry agreement as occurrence proof or add it to the app before a qualified ODbL and HydroSHEDS distribution review.",
    }
    report_bytes = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    write_immutable(ROOT / REPORT_RELATIVE, report_bytes, refresh=refresh)
    print(f"Overpass returned {len(elements)} elements for {len(candidates)} named stream-scope candidates.")
    print(f"Same-normalized-name OSM waterway features for {len(matched_geo_ids)} candidate points.")
    print("Identity validation: 0; species assertions: 0; app geometry: none; publication approval: false.")
    print(f"Git-ignored OSM snapshot: {RAW_RESPONSE_RELATIVE}")
    print(f"Aggregate report: {REPORT_RELATIVE}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
