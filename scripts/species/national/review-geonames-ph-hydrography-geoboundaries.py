#!/usr/bin/env python3
"""Coarsely screen GeoNames hydrographic points against pinned Philippine ADM2 land polygons."""

from __future__ import annotations

import hashlib
import json
import math
import os
import subprocess
import sys
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
SNAPSHOT_COMPACT = "20261107"
RAW_DIRECTORY = Path(f"data/research/philippines/raw/national/geonames-ph-{SNAPSHOT_COMPACT}")
CANDIDATE_RELATIVE = RAW_DIRECTORY / "hydrographic-candidates.jsonl"
QUEUE_RELATIVE = RAW_DIRECTORY / "point-admin-overlay-review.jsonl"
EXTRACT_REPORT_RELATIVE = Path(
    f"data/research/philippines/national/reviews/geonames-ph-hydrography-extract-{SNAPSHOT_COMPACT}.json"
)
REPORT_RELATIVE = Path(
    f"data/research/philippines/national/reviews/geonames-ph-hydrography-geoboundaries-overlay-{SNAPSHOT_COMPACT}.json"
)
GEOMETRY_RELATIVE = Path(
    "data/research/philippines/raw/national/geoboundaries-phl-adm2-2020/geoBoundaries-PHL-ADM2_simplified-41af8f1.geojson"
)
BOUNDARY_REPORT_RELATIVE = Path(
    "data/research/philippines/national/reviews/obis-cas-ich-calabarzon-geoboundaries-20261107.json"
)
EXPECTED_CANDIDATE_SHA256 = "ee3de278b4443ba7b7e441ce75275d2d8c8aebf757a77dea2be1c7fb8d7c33f4"
EXPECTED_GEOMETRY_SHA256 = "fa77b9f17db2e419acaae714a935f7812be4409e2983675d34020e8426a3e189"
BOUNDARY_ID = "PHL-ADM2-2640588"
BOUNDARY_COMMIT = "41af8f1"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def ring_bounds(ring: list[list[float]]) -> tuple[float, float, float, float]:
    longitudes = [point[0] for point in ring]
    latitudes = [point[1] for point in ring]
    return min(longitudes), min(latitudes), max(longitudes), max(latitudes)


def point_on_segment(point: list[float], first: list[float], second: list[float]) -> bool:
    cross = (point[0] - first[0]) * (second[1] - first[1]) - (point[1] - first[1]) * (second[0] - first[0])
    if abs(cross) > 1e-10:
        return False
    return (
        min(first[0], second[0]) - 1e-10 <= point[0] <= max(first[0], second[0]) + 1e-10
        and min(first[1], second[1]) - 1e-10 <= point[1] <= max(first[1], second[1]) + 1e-10
    )


def point_in_ring(point: list[float], ring: list[list[float]]) -> bool:
    inside = False
    previous = len(ring) - 1
    for index, second in enumerate(ring):
        first = ring[previous]
        if point_on_segment(point, first, second):
            return True
        crosses = (first[1] > point[1]) != (second[1] > point[1])
        if crosses:
            intersection_x = (second[0] - first[0]) * (point[1] - first[1]) / (second[1] - first[1]) + first[0]
            if point[0] < intersection_x:
                inside = not inside
        previous = index
    return inside


def point_in_polygon(point: list[float], rings: list[list[list[float]]]) -> bool:
    if not rings or not point_in_ring(point, rings[0]):
        return False
    return not any(point_in_ring(point, hole) for hole in rings[1:])


def geometry_parts(geometry: dict) -> list[list[list[list[float]]]]:
    if geometry.get("type") == "Polygon":
        return [geometry["coordinates"]]
    if geometry.get("type") == "MultiPolygon":
        return geometry["coordinates"]
    raise ValueError(f"Unsupported GeoJSON geometry type: {geometry.get('type')}")


def geometry_bounds(polygons: list[list[list[list[float]]]]) -> tuple[float, float, float, float]:
    bounds = [ring_bounds(rings[0]) for rings in polygons]
    return (
        min(value[0] for value in bounds),
        min(value[1] for value in bounds),
        max(value[2] for value in bounds),
        max(value[3] for value in bounds),
    )


def point_in_geometry(point: list[float], feature: dict) -> bool:
    min_x, min_y, max_x, max_y = feature["bounds"]
    if not (min_x <= point[0] <= max_x and min_y <= point[1] <= max_y):
        return False
    return any(point_in_polygon(point, rings) for rings in feature["polygons"])


def write_immutable(path: Path, content: bytes) -> None:
    if path.exists():
        if path.read_bytes() == content:
            return
        raise FileExistsError(f"Refusing to overwrite a different snapshot output: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    with temporary.open("wb") as output:
        output.write(content)
        output.flush()
        os.fsync(output.fileno())
    temporary.replace(path)


def require_ignored(relative_path: Path) -> None:
    result = subprocess.run(
        ["git", "check-ignore", "--quiet", relative_path.as_posix()],
        cwd=ROOT,
        check=False,
    )
    if result.returncode != 0:
        (ROOT / relative_path).unlink(missing_ok=True)
        raise RuntimeError(f"Local candidate output is not Git-ignored: {relative_path}")


def main() -> int:
    candidate_path = ROOT / CANDIDATE_RELATIVE
    extract_report_path = ROOT / EXTRACT_REPORT_RELATIVE
    geometry_path = ROOT / GEOMETRY_RELATIVE
    boundary_report_path = ROOT / BOUNDARY_REPORT_RELATIVE
    for required in (candidate_path, extract_report_path, geometry_path, boundary_report_path):
        if not required.is_file():
            raise FileNotFoundError(f"Required hash-pinned input is missing: {required.relative_to(ROOT)}")

    candidate_bytes = candidate_path.read_bytes()
    geometry_bytes = geometry_path.read_bytes()
    extract_report = json.loads(extract_report_path.read_text(encoding="utf-8"))
    boundary_report = json.loads(boundary_report_path.read_text(encoding="utf-8"))
    if sha256_bytes(candidate_bytes) != EXPECTED_CANDIDATE_SHA256:
        raise ValueError("GeoNames candidate queue differs from the reviewed 2026-11-07 extract")
    if sha256_bytes(geometry_bytes) != EXPECTED_GEOMETRY_SHA256:
        raise ValueError("geoBoundaries ADM2 geometry differs from the reviewed pinned boundary")
    if extract_report["localCandidateFile"]["sha256"] != EXPECTED_CANDIDATE_SHA256:
        raise ValueError("GeoNames extraction report does not attest the pinned candidate queue")
    boundary_source = boundary_report["boundarySource"]
    if boundary_source["boundaryID"] != BOUNDARY_ID or boundary_source["geometryUrlPinnedCommit"] != BOUNDARY_COMMIT:
        raise ValueError("geoBoundaries review receipt does not attest the pinned ADM2 source")
    if boundary_source["geometrySha256"] != EXPECTED_GEOMETRY_SHA256:
        raise ValueError("geoBoundaries review receipt geometry hash does not match the pinned source")

    geometry_collection = json.loads(geometry_bytes.decode("utf-8"))
    if geometry_collection.get("type") != "FeatureCollection" or not isinstance(geometry_collection.get("features"), list):
        raise ValueError("Pinned administrative geometry is not a GeoJSON FeatureCollection")
    features = []
    for feature in geometry_collection["features"]:
        name = (feature.get("properties") or {}).get("shapeName")
        if not isinstance(name, str) or not name.strip():
            raise ValueError("A pinned boundary feature lacks shapeName")
        polygons = geometry_parts(feature["geometry"])
        features.append({"name": name.strip(), "polygons": polygons, "bounds": geometry_bounds(polygons)})
    if len(features) != boundary_source["featureCount"]:
        raise ValueError("Pinned GeoJSON feature count differs from the reviewed source receipt")

    status_counts: Counter[str] = Counter()
    status_by_feature_code: dict[str, Counter[str]] = {}
    single_polygon_hits: Counter[str] = Counter()
    local_rows = []
    input_rows = 0
    for line_number, line in enumerate(candidate_bytes.decode("utf-8").splitlines(), start=1):
        row = json.loads(line)
        longitude = float(row["longitudeWgs84"])
        latitude = float(row["latitudeWgs84"])
        if not (math.isfinite(longitude) and math.isfinite(latitude) and -180 <= longitude <= 180 and -90 <= latitude <= 90):
            raise ValueError(f"Invalid GeoNames coordinate at candidate line {line_number}")
        point = [longitude, latitude]
        matches = [feature["name"] for feature in features if point_in_geometry(point, feature)]
        if len(matches) == 0:
            status = "outside-all-land-admin2-polygons"
        elif len(matches) == 1:
            status = "inside-one-land-admin2-polygon"
            single_polygon_hits[matches[0]] += 1
        else:
            status = "overlaps-multiple-land-admin2-polygons"
        feature_code = row["featureCode"]
        status_counts[status] += 1
        status_by_feature_code.setdefault(feature_code, Counter())[status] += 1
        local_rows.append(
            {
                "geonameId": row["geonameId"],
                "name": row["name"],
                "asciiName": row["asciiName"],
                "featureCode": feature_code,
                "sourceAdmin1Code": row["admin1Code"],
                "sourceAdmin2Code": row["admin2Code"],
                "longitudeWgs84": longitude,
                "latitudeWgs84": latitude,
                "coarseOverlayStatus": status,
                "singlePolygonNameCandidate": matches[0] if len(matches) == 1 else None,
                "regionAssignment": None,
                "waterbodyIdentityReviewed": False,
                "speciesEvidence": False,
            }
        )
        input_rows += 1
        if input_rows % 5000 == 0:
            print(f"Screened {input_rows}/{extract_report['localCandidateFile']['rows']} candidates...", flush=True)

    if input_rows != extract_report["localCandidateFile"]["rows"]:
        raise ValueError("GeoNames candidate row count does not match its extraction receipt")
    local_bytes = "".join(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in local_rows).encode("utf-8")
    write_immutable(ROOT / QUEUE_RELATIVE, local_bytes)
    require_ignored(QUEUE_RELATIVE)

    report = {
        "schemaVersion": 1,
        "reviewId": f"geonames-ph-hydrography-geoboundaries-overlay-{SNAPSHOT_COMPACT}",
        "generatedOn": "2026-11-07",
        "status": "coarse-land-polygon-screen-complete;waterbody-and-region-review-pending;no-species-assertions",
        "source": {
            "provider": "GeoNames Gazetteer Philippines country extract",
            "extractReview": str(EXTRACT_REPORT_RELATIVE).replace("\\", "/"),
            "candidateRows": input_rows,
            "candidateSha256": EXPECTED_CANDIDATE_SHA256,
            "license": "CC BY 4.0",
        },
        "boundarySource": {
            "provider": "geoBoundaries gbOpen",
            "boundaryId": BOUNDARY_ID,
            "administrativeLevel": "ADM2 provinces",
            "representedYear": boundary_source["representedYear"],
            "sourceDataUpdateDate": boundary_source["sourceDataUpdateDate"],
            "geometryUrl": boundary_source["geometryUrl"],
            "geometryPinnedCommit": BOUNDARY_COMMIT,
            "geometrySha256": EXPECTED_GEOMETRY_SHA256,
            "featureCount": len(features),
            "license": boundary_source["boundaryLicense"],
            "attribution": boundary_source["attribution"],
        },
        "method": {
            "algorithm": "WGS84 point-in-polygon against simplified ADM2 land polygons; polygon edges count as inside",
            "purpose": "coarse location context for manual waterbody and regional research only",
            "sourceAdminCodesUsedForAssignment": False,
            "regionAssignmentsAdded": 0,
            "singlePolygonNameCandidateMeans": "point fell inside one named land-admin2 polygon; this is not a verified waterbody, province, or region assignment",
            "outsideAllLandPolygonInterpretation": "may be a valid bay, gulf, reef, offshore or coastal gazetteer point; not by itself a coordinate error",
        },
        "results": {
            "inputRows": input_rows,
            "screenStatusCounts": dict(sorted(status_counts.items())),
            "singlePolygonPointHitsByPolygonName": dict(sorted(single_polygon_hits.items())),
            "screenStatusCountsByGeoNamesFeatureCode": {
                code: dict(sorted(counts.items())) for code, counts in sorted(status_by_feature_code.items())
            },
            "waterbodyIdentitiesValidated": 0,
            "speciesAssertionsAdded": 0,
            "publicGeometryAdded": False,
        },
        "localReviewQueue": {
            "path": str(QUEUE_RELATIVE).replace("\\", "/"),
            "rows": len(local_rows),
            "bytes": len(local_bytes),
            "sha256": sha256_bytes(local_bytes),
            "gitIgnored": True,
            "containsExactCoordinates": True,
            "containsNamesAndSourceAdminCodes": True,
            "appBundleIncluded": False,
        },
        "privacy": {
            "exactCoordinatesInTrackedReport": False,
            "candidateNamesInTrackedReport": False,
            "perRecordIdsInTrackedReport": False,
        },
        "limitations": [
            "GeoNames feature-class-H points include freshwater and marine/coastal feature types; they are not complete river lines, lake shorelines or wetland polygons.",
            "An inland or coastal point inside a land-admin2 polygon does not prove that a waterbody lies within that province; many gazetteer points are representative locations.",
            "This uses simplified 2020 land-administration polygons integrated from source data updated in 2023, not current boundaries or municipal-water limits.",
            "Points outside land polygons may be valid marine/coastal features. The screen is not an automatic exclusion, geography assignment, species record, salinity finding or fishing-access claim.",
            "GeoNames aggregates many sources, so matching names and spatial overlap do not establish independent confirmation or waterbody identity.",
            "The local row-level queue is Git-ignored and contains exact coordinates and names; only aggregate counts are tracked.",
        ],
    }
    write_immutable(ROOT / REPORT_RELATIVE, (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
    print(f"GeoNames candidates screened: {input_rows}")
    print("Point overlay statuses: " + json.dumps(dict(sorted(status_counts.items())), sort_keys=True))
    print(f"Province-screen hits (single polygon only): {sum(single_polygon_hits.values())}; region assignments: 0")
    print(f"Species assertions: 0; local-only review queue: {QUEUE_RELATIVE}")
    print(f"Wrote aggregate overlay receipt: {REPORT_RELATIVE}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
