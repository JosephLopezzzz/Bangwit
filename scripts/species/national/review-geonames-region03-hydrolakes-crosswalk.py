#!/usr/bin/env python3
"""Build a local-only name/proximity screen for Central Luzon lake candidates."""

from __future__ import annotations

import hashlib
import json
import math
import os
import subprocess
import sys
import unicodedata
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
RUN_DATE = "2026-11-27"
RUN_DATE_COMPACT = RUN_DATE.replace("-", "")
REGION_ID = "0300000000"
GEO_NAMES_RELATIVE = Path(
    "data/research/philippines/raw/national/geonames-ph-20261107/central-luzon-hydrographic-candidates.jsonl"
)
HYDROLAKES_RELATIVE = Path("data/research/philippines/raw/national/hydrolakes-philippines-v1-waterbody-candidates.jsonl")
GEO_NAMES_REVIEW_RELATIVE = Path(
    "data/research/philippines/national/reviews/geonames-region03-central-luzon-hydrographic-candidates-20261127.json"
)
HYDROLAKES_REVIEW_RELATIVE = Path(
    "data/research/philippines/national/reviews/hydrolakes-philippines-candidate-extract-20261107.json"
)
REPORT_RELATIVE = Path(
    f"data/research/philippines/national/reviews/geonames-region03-hydrolakes-proximity-crosswalk-{RUN_DATE_COMPACT}.json"
)
QUEUE_RELATIVE = Path(
    "data/research/philippines/raw/national/geonames-ph-20261107/central-luzon-hydrolakes-nearest-review.jsonl"
)
EXPECTED_HASHES = {
    GEO_NAMES_RELATIVE.as_posix(): "865964a931f9c7c52ffdad84b5bf5d045ddc1d677b002ad934a6137f545afbeb",
    HYDROLAKES_RELATIVE.as_posix(): "357a30e95c8580a64a295a2bb329026aff15612b7b9c0b084d72552249134030",
}
EARTH_RADIUS_KM = 6371.0088
GENERIC_WATER_TERMS = {"lake", "lakes"}


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def read_pinned(relative: Path) -> tuple[bytes, Any]:
    raw = (ROOT / relative).read_bytes()
    expected = EXPECTED_HASHES.get(relative.as_posix())
    actual = sha256_bytes(raw)
    if expected is None or actual != expected:
        raise ValueError(f"Pinned input changed: {relative} (expected {expected}, got {actual})")
    if relative.suffix == ".jsonl":
        value = [json.loads(line) for line in raw.decode("utf-8").splitlines() if line.strip()]
    else:
        value = json.loads(raw.decode("utf-8"))
    return raw, value


def write_immutable(path: Path, content: bytes) -> None:
    if path.exists():
        if path.read_bytes() == content:
            return
        raise FileExistsError(f"Refusing to overwrite a different research output: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    with temporary.open("wb") as output:
        output.write(content)
        output.flush()
        os.fsync(output.fileno())
    temporary.replace(path)


def normalized_name(value: str | None) -> str:
    if not value:
        return ""
    decomposed = unicodedata.normalize("NFKD", value.casefold())
    ascii_name = "".join(char for char in decomposed if not unicodedata.combining(char))
    tokens = [token for token in "".join(c if c.isalnum() else " " for c in ascii_name).split() if token not in GENERIC_WATER_TERMS]
    return " ".join(tokens)


def haversine_km(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    lon1, lat1, lon2, lat2 = map(math.radians, (lon1, lat1, lon2, lat2))
    delta_lon = lon2 - lon1
    delta_lat = lat2 - lat1
    value = math.sin(delta_lat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(delta_lon / 2) ** 2
    return 2 * EARTH_RADIUS_KM * math.asin(math.sqrt(min(1.0, value)))


def main() -> int:
    geo_bytes, geonames = read_pinned(GEO_NAMES_RELATIVE)
    hydrolakes_bytes, hydrolakes = read_pinned(HYDROLAKES_RELATIVE)
    geo_review = json.loads((ROOT / GEO_NAMES_REVIEW_RELATIVE).read_text(encoding="utf-8"))
    hydro_review = json.loads((ROOT / HYDROLAKES_REVIEW_RELATIVE).read_text(encoding="utf-8"))
    if geo_review["localReviewQueue"]["sha256"] != sha256_bytes(geo_bytes):
        raise ValueError("Central Luzon review does not attest the pinned candidate queue")
    if hydro_review["localOutput"]["sha256"] != sha256_bytes(hydrolakes_bytes):
        raise ValueError("HydroLAKES review does not attest its pinned candidate queue")

    ignored = subprocess.run(["git", "check-ignore", "--quiet", QUEUE_RELATIVE.as_posix()], cwd=ROOT, check=False)
    if ignored.returncode != 0:
        raise RuntimeError("Crosswalk queue path is not Git-ignored")

    lake_candidates = [row for row in geonames if row.get("sourceFeatureGroup") == "lake_or_reservoir"]
    if len(geonames) != 1106 or len(hydrolakes) != 1298 or len(lake_candidates) != 9:
        raise ValueError("Pinned Central Luzon or HydroLAKES row counts changed; review the scope first")

    hydrolakes_by_name: dict[str, list[dict[str, Any]]] = {}
    for row in hydrolakes:
        key = normalized_name(row.get("lakeName"))
        if key:
            hydrolakes_by_name.setdefault(key, []).append(row)

    output_rows = []
    code_counts = Counter(row["featureCode"] for row in lake_candidates)
    exact_name_match_rows = 0
    name_match_nearest_agreement = 0
    distance_counts = Counter()
    for candidate in sorted(lake_candidates, key=lambda row: int(row["geonameId"])):
        lon = float(candidate["longitudeWgs84"])
        lat = float(candidate["latitudeWgs84"])
        if not (math.isfinite(lon) and math.isfinite(lat)):
            raise ValueError(f"Invalid GeoNames coordinates for id {candidate['geonameId']}")
        distances = [
            haversine_km(lon, lat, float(row["pourPointWgs84"]["longitude"]), float(row["pourPointWgs84"]["latitude"]))
            for row in hydrolakes
        ]
        nearest_index = min(range(len(distances)), key=distances.__getitem__)
        nearest = hydrolakes[nearest_index]
        nearest_id = int(nearest["hylakId"])
        nearest_distance = distances[nearest_index]
        name_key = normalized_name(candidate.get("name"))
        matches = hydrolakes_by_name.get(name_key, []) if name_key else []
        if matches:
            exact_name_match_rows += 1
            if any(int(row["hylakId"]) == nearest_id for row in matches):
                name_match_nearest_agreement += 1
        for threshold in (1, 5, 10, 25):
            if nearest_distance <= threshold:
                distance_counts[f"within{threshold}Km"] += 1
        match_ids = sorted({int(row["hylakId"]) for row in matches})
        output_rows.append(
            {
                "geonameId": int(candidate["geonameId"]),
                "geonamesName": candidate["name"],
                "geonamesFeatureCode": candidate["featureCode"],
                "provincePolygonPointContext": candidate["singlePolygonPointContext"],
                "geonamesPointWgs84": {"longitude": lon, "latitude": lat},
                "normalizedNameKey": name_key,
                "exactNormalizedNameHydrolakesMatches": [
                    {"hylakId": int(row["hylakId"]), "sourceName": row["lakeName"]} for row in matches
                ],
                "exactNameMatchedHydrolakesIds": match_ids,
                "nearestHydrolakesCandidate": {
                    "hylakId": nearest_id,
                    "sourceName": nearest.get("lakeName"),
                    "pourPointWgs84": nearest["pourPointWgs84"],
                    "distanceKm": round(nearest_distance, 3),
                    "namedSourceRow": bool(nearest.get("lakeName")),
                },
                "exactNameMatchAgreesWithNearestPourPoint": nearest_id in match_ids if match_ids else None,
                "distanceThresholdScreen": {str(t): nearest_distance <= t for t in (1, 5, 10, 25)},
                "reviewStatus": "source-name-and-pour-point-proximity-lead-only;identity-not-validated",
            }
        )

    queue_bytes = "".join(
        json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in output_rows
    ).encode("utf-8")
    write_immutable(ROOT / QUEUE_RELATIVE, queue_bytes)

    report = {
        "schemaVersion": 1,
        "reviewId": f"geonames-region03-hydrolakes-proximity-crosswalk-{RUN_DATE_COMPACT}",
        "generatedOn": RUN_DATE,
        "status": "local-name-and-pour-point-proximity-screen-built;identity-and-region-review-pending",
        "scope": {
            "regionReviewScope": "Region III (Central Luzon) candidate screen only",
            "regionId": REGION_ID,
            "geonamesCandidateFeatureGroup": "lake_or_reservoir",
            "geonamesRowsCompared": len(lake_candidates),
            "waterbodyIdentityValidated": False,
            "regionAssignmentsAdded": 0,
        },
        "inputs": {
            str(GEO_NAMES_RELATIVE).replace("\\", "/"): {"sha256": sha256_bytes(geo_bytes), "bytes": len(geo_bytes)},
            str(HYDROLAKES_RELATIVE).replace("\\", "/"): {"sha256": sha256_bytes(hydrolakes_bytes), "bytes": len(hydrolakes_bytes)},
        },
        "sources": {
            "GeoNames": {
                "review": str(GEO_NAMES_REVIEW_RELATIVE).replace("\\", "/"),
                "license": "CC BY 4.0",
                "attribution": "GeoNames Gazetteer (https://www.geonames.org/), Philippines extract downloaded 2026-11-07; CC BY 4.0.",
            },
            "HydroLAKES": {
                "review": str(HYDROLAKES_REVIEW_RELATIVE).replace("\\", "/"),
                "license": "CC BY 4.0",
                "attribution": "HydroLAKES v1 by Lehner and Messager; Asia subset by Daniel Schönberger (2025), Zenodo DOI 10.5281/zenodo.17503891; CC BY 4.0.",
            },
        },
        "method": {
            "nameMatching": "exact normalized string after Unicode normalization, case-folding, punctuation collapse and removal of generic English lake/lakes tokens; no fuzzy or translated-name matching",
            "spatialMatching": "Haversine distance between GeoNames gazetteer points and HydroLAKES outlet pour points; nearest distance is a manual review lead, not geometry overlap or identity confirmation",
            "distanceThresholdsKm": [1, 5, 10, 25],
        },
        "results": {
            "geonamesLakeReservoirCandidatesCompared": len(lake_candidates),
            "hydrolakesPhilippinesCandidatesSearched": len(hydrolakes),
            "geonamesRowsWithExactNormalizedNameMatch": exact_name_match_rows,
            "exactNameMatchedRowsWhoseHydrolakesIdIsAlsoNearest": name_match_nearest_agreement,
            "nearestHydrolakesRowsWithinDistanceKm": dict(sorted(distance_counts.items())),
            "geonamesRowsByFeatureCode": dict(sorted(code_counts.items())),
            "waterbodyIdentitiesValidated": 0,
            "regionAssignmentsAdded": 0,
            "speciesAssertionsAdded": 0,
            "publicGeometryAdded": False,
        },
        "localReviewQueue": {
            "path": str(QUEUE_RELATIVE).replace("\\", "/"),
            "rows": len(output_rows),
            "bytes": len(queue_bytes),
            "sha256": sha256_bytes(queue_bytes),
            "gitIgnored": True,
            "appBundleIncluded": False,
            "containsExactCoordinates": True,
            "containsNamesAndIdentifiers": True,
        },
        "privacy": {
            "exactCoordinatesInTrackedReport": False,
            "candidateNamesInTrackedReport": False,
            "perRecordIdsInTrackedReport": False,
        },
        "limitations": [
            "The Central Luzon GeoNames candidates were selected by point-in-simplified-polygon context; this does not assign a lake to an official province or region.",
            "HydroLAKES v1 targets lakes of at least 10 ha, includes reservoirs and some saline lakes, and omits rivers, wetlands and smaller waterbodies; an unmatched candidate is not evidence of absence.",
            "HydroLAKES pour points are outlets, not shoreline polygons or lake centers; distance may compare different places along one water system.",
            "Name matching does not resolve local-language aliases, spelling variants, shared names, or changes in waterbody naming.",
            "GeoNames aggregates many sources; GeoNames and HydroLAKES matches are not independent confirmations of identity.",
            "This is a research-only screen. No species presence, habitat, access, legal boundary, safety, public geometry, or app claim was added.",
            "Exact names, identifiers, and coordinates remain only in Git-ignored local storage.",
        ],
        "nextAction": "Review each exact-name and nearest-point pair against locality-specific independent maps or publications; leave every pair unverified until evidence establishes the same waterbody, and review fish records separately.",
    }
    report_bytes = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    report_path = ROOT / REPORT_RELATIVE
    report_path.parent.mkdir(parents=True, exist_ok=True)
    write_immutable(report_path, report_bytes)
    print(
        f"GeoNames lake/reservoir candidates: {len(lake_candidates)}; exact normalized name matches: {exact_name_match_rows}; "
        f"name matches agreeing with nearest outlet: {name_match_nearest_agreement}"
    )
    print("Nearest point thresholds (km): " + json.dumps(dict(sorted(distance_counts.items())), sort_keys=True))
    print("Confirmed identities: 0; region assignments: 0; species assertions: 0")
    print(f"Local-only crosswalk: {QUEUE_RELATIVE}")
    print(f"Aggregate review: {REPORT_RELATIVE}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
