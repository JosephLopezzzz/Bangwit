#!/usr/bin/env python3
"""Build a local-only name/proximity crosswalk for CALABARZON lake candidates."""

from __future__ import annotations

import hashlib
import json
import math
import os
import re
import subprocess
import sys
import unicodedata
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
RUN_DATE = "2026-11-08"
RUN_DATE_COMPACT = "20261108"
REGION_ID = "0400000000"
REGION_QUEUE_RELATIVE = Path(
    "data/research/philippines/raw/national/geonames-ph-20261107/calabarzon-hydrographic-candidates.jsonl"
)
HYDROLAKES_QUEUE_RELATIVE = Path(
    "data/research/philippines/raw/national/hydrolakes-philippines-v1-waterbody-candidates.jsonl"
)
SEVEN_LAKES_RELATIVE = Path("data/research/philippines/calabarzon-seven-lakes-osm-hydrolakes-crosswalk-20261030.json")
SAMPALOC_RELATIVE = Path("data/research/philippines/calabarzon-sampaloc-osm-hydrolakes-crosswalk-20261030.json")
REPORT_RELATIVE = Path(
    f"data/research/philippines/national/reviews/geonames-calabarzon-hydrolakes-proximity-crosswalk-{RUN_DATE_COMPACT}.json"
)
QUEUE_RELATIVE = Path(
    "data/research/philippines/raw/national/geonames-ph-20261107/calabarzon-hydrolakes-nearest-review.jsonl"
)

EXPECTED_HASHES = {
    REGION_QUEUE_RELATIVE.as_posix(): "3b104459534ab8eb1f0fdb3b45d66c67f44954be863073dddee8ecd5cab8969a",
    HYDROLAKES_QUEUE_RELATIVE.as_posix(): "357a30e95c8580a64a295a2bb329026aff15612b7b9c0b084d72552249134030",
    SEVEN_LAKES_RELATIVE.as_posix(): "998b2d28f7e18e4e252daa705b0c5dec9ad9e26f195048f139ca2065f58a5ac3",
    SAMPALOC_RELATIVE.as_posix(): "42fba383027fc2a3d06c5be218cc1e04e361ec1e6bd784f16a59a7844ba129f7",
}
GENERIC_WATER_TERMS = {"lake", "lakes"}
EARTH_RADIUS_KM = 6371.0088


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def write_immutable(path: Path, content: bytes, *, refresh: bool = False) -> None:
    if path.exists():
        if path.read_bytes() == content:
            return
        if not refresh:
            raise FileExistsError(f"Refusing to overwrite a different review output: {path}; rerun with --refresh to regenerate this script's outputs")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    with temporary.open("wb") as output:
        output.write(content)
        output.flush()
        os.fsync(output.fileno())
    temporary.replace(path)


def read_pinned(relative: Path) -> tuple[bytes, Any]:
    path = ROOT / relative
    raw = path.read_bytes()
    expected = EXPECTED_HASHES[relative.as_posix()]
    actual = sha256_bytes(raw)
    if actual != expected:
        raise ValueError(f"Pinned input changed: {relative} (expected {expected}, got {actual})")
    if relative.suffix == ".jsonl":
        value = [json.loads(line) for line in raw.decode("utf-8").splitlines() if line.strip()]
    else:
        value = json.loads(raw.decode("utf-8"))
    return raw, value


def normalized_name(value: str | None, *, remove_water_terms: bool = False) -> str:
    if not value:
        return ""
    decomposed = unicodedata.normalize("NFKD", value.casefold())
    ascii_name = "".join(char for char in decomposed if not unicodedata.combining(char))
    tokens = re.findall(r"[a-z0-9]+", ascii_name)
    if remove_water_terms:
        tokens = [token for token in tokens if token not in GENERIC_WATER_TERMS]
    return " ".join(tokens)


def haversine_km(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    lon1, lat1, lon2, lat2 = map(math.radians, (lon1, lat1, lon2, lat2))
    delta_lon = lon2 - lon1
    delta_lat = lat2 - lat1
    value = math.sin(delta_lat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(delta_lon / 2) ** 2
    return 2 * EARTH_RADIUS_KM * math.asin(math.sqrt(min(1.0, value)))


def hylak_id(row: dict[str, Any]) -> int | None:
    candidate = row.get("hydrolakesCandidate") or {}
    return candidate.get("hylakId")


def build_existing_name_references(
    seven_lakes: dict[str, Any], sampaloc: dict[str, Any], hydrolakes: list[dict[str, Any]]
) -> tuple[list[dict[str, Any]], dict[int, list[dict[str, Any]]]]:
    references: list[dict[str, Any]] = []
    known_hydrolakes_ids: dict[int, list[dict[str, Any]]] = {}

    for feature in seven_lakes.get("features", []):
        candidate_id = hylak_id(feature)
        reference = {
            "sourceKind": "existing-osm-lake-crosswalk",
            "sourceArtifact": SEVEN_LAKES_RELATIVE.as_posix(),
            "name": feature.get("name"),
            "osmObject": feature.get("osmObject"),
            "hydrolakesId": candidate_id,
            "identityStatus": feature.get("identityStatus"),
        }
        references.append(reference)
        if candidate_id is not None:
            known_hydrolakes_ids.setdefault(int(candidate_id), []).append(reference)

    sampaloc_hydrolakes_ids = [
        int(source["featureId"]) for source in sampaloc.get("sources", []) if source.get("featureId") is not None
    ]
    for source in sampaloc.get("sources", []):
        tags = source.get("tags") or {}
        name = tags.get("name") or tags.get("name:en")
        if name:
            reference = {
                "sourceKind": "existing-osm-lake-crosswalk",
                "sourceArtifact": SAMPALOC_RELATIVE.as_posix(),
                "name": name,
                "osmObject": f"relation/{source['relationId']}" if source.get("relationId") else None,
                "hydrolakesId": sampaloc_hydrolakes_ids[0] if len(sampaloc_hydrolakes_ids) == 1 else None,
                "identityStatus": sampaloc.get("status"),
            }
            references.append(reference)
        feature_id = source.get("featureId")
        if feature_id is not None:
            reference = {
                "sourceKind": "existing-osm-lake-crosswalk",
                "sourceArtifact": SAMPALOC_RELATIVE.as_posix(),
                "name": None,
                "osmObject": None,
                "hydrolakesId": int(feature_id),
                "identityStatus": sampaloc.get("status"),
            }
            known_hydrolakes_ids.setdefault(int(feature_id), []).append(reference)

    # Include source-name candidates from HydroLAKES itself, but keep them separate from OSM names.
    for row in hydrolakes:
        if row.get("lakeName"):
            references.append(
                {
                    "sourceKind": "hydrolakes-source-name",
                    "sourceArtifact": HYDROLAKES_QUEUE_RELATIVE.as_posix(),
                    "name": row["lakeName"],
                    "osmObject": None,
                    "hydrolakesId": int(row["hylakId"]),
                    "identityStatus": "source name; candidate only",
                }
            )
    return references, known_hydrolakes_ids


def main() -> int:
    input_bytes: dict[str, bytes] = {}
    loaded: dict[str, Any] = {}
    for relative in (REGION_QUEUE_RELATIVE, HYDROLAKES_QUEUE_RELATIVE, SEVEN_LAKES_RELATIVE, SAMPALOC_RELATIVE):
        input_bytes[relative.as_posix()], loaded[relative.as_posix()] = read_pinned(relative)

    geonames = loaded[REGION_QUEUE_RELATIVE.as_posix()]
    hydrolakes = loaded[HYDROLAKES_QUEUE_RELATIVE.as_posix()]
    seven_lakes = loaded[SEVEN_LAKES_RELATIVE.as_posix()]
    sampaloc = loaded[SAMPALOC_RELATIVE.as_posix()]
    lake_candidates = [row for row in geonames if row.get("sourceFeatureGroup") == "lake_reservoir_or_pool"]
    if len(geonames) != 811 or len(hydrolakes) != 1298 or len(lake_candidates) != 17:
        raise ValueError("Pinned CALABARZON/ HydroLAKES queue counts changed; review the new scope before proceeding")

    references, known_hydrolakes_ids = build_existing_name_references(seven_lakes, sampaloc, hydrolakes)
    names_by_key: dict[str, list[dict[str, Any]]] = {}
    for reference in references:
        key = normalized_name(reference.get("name"), remove_water_terms=True)
        if key:
            names_by_key.setdefault(key, []).append(reference)

    output_rows = []
    distance_counts = Counter()
    feature_code_counts = Counter(row["featureCode"] for row in lake_candidates)
    canonical_name_matched_candidates = set()
    canonical_name_matches_by_kind = Counter()
    known_crosswalk_nearest_rows = 0
    known_crosswalk_nearest_ids: set[int] = set()
    nearest_named_hydrolakes_rows = 0
    canonical_match_nearest_id_agrees = 0
    canonical_match_nearest_id_disagrees = 0
    for geo in sorted(lake_candidates, key=lambda row: row["geonameId"]):
        lon = float(geo["longitudeWgs84"])
        lat = float(geo["latitudeWgs84"])
        distances = [
            haversine_km(lon, lat, float(row["pourPointWgs84"]["longitude"]), float(row["pourPointWgs84"]["latitude"]))
            for row in hydrolakes
        ]
        nearest_index = min(range(len(distances)), key=distances.__getitem__)
        nearest = hydrolakes[nearest_index]
        nearest_distance = distances[nearest_index]
        nearest_id = int(nearest["hylakId"])
        if nearest.get("lakeName"):
            nearest_named_hydrolakes_rows += 1
        if nearest_id in known_hydrolakes_ids:
            known_crosswalk_nearest_rows += 1
            known_crosswalk_nearest_ids.add(nearest_id)

        match_key = normalized_name(geo.get("name"), remove_water_terms=True)
        name_matches = names_by_key.get(match_key, [])
        matched_hydrolakes_ids = sorted(
            {int(match["hydrolakesId"]) for match in name_matches if match.get("hydrolakesId") is not None}
        )
        if matched_hydrolakes_ids:
            if nearest_id in matched_hydrolakes_ids:
                canonical_match_nearest_id_agrees += 1
            else:
                canonical_match_nearest_id_disagrees += 1
        if name_matches:
            canonical_name_matched_candidates.add(int(geo["geonameId"]))
            for match in name_matches:
                canonical_name_matches_by_kind[match["sourceKind"]] += 1

        thresholds = {str(threshold): nearest_distance <= threshold for threshold in (1, 5, 10, 25)}
        for threshold, within in thresholds.items():
            if within:
                distance_counts[f"within{threshold}Km"] += 1

        crosswalk_refs = known_hydrolakes_ids.get(nearest_id, [])
        review_flags = []
        if not name_matches:
            review_flags.append("no-exact-canonical-name-match-in-pinned-inputs")
        if crosswalk_refs and not name_matches:
            review_flags.append("nearest-outlet-id-is-in-existing-osm-crosswalk-without-name-match")
        if matched_hydrolakes_ids and nearest_id not in matched_hydrolakes_ids:
            review_flags.append("canonical-name-hydrolakes-id-differs-from-nearest-outlet-id")
        output_rows.append(
            {
                "geonameId": int(geo["geonameId"]),
                "geonamesName": geo["name"],
                "featureCode": geo["featureCode"],
                "provincePolygonPointContext": geo["singlePolygonPointContext"],
                "geonamesPointWgs84": {"longitude": lon, "latitude": lat},
                "canonicalNameKey": match_key,
                "exactCanonicalNameMatches": name_matches,
                "canonicalNameMatchedHydrolakesIds": matched_hydrolakes_ids,
                "canonicalNameMatchedHydrolakesIdAgreesWithNearest": (
                    nearest_id in matched_hydrolakes_ids if matched_hydrolakes_ids else None
                ),
                "nearestHydrolakesCandidate": {
                    "hylakId": nearest_id,
                    "sourceName": nearest.get("lakeName"),
                    "pourPointWgs84": nearest["pourPointWgs84"],
                    "distanceKm": round(nearest_distance, 3),
                    "namedSourceRow": bool(nearest.get("lakeName")),
                },
                "nearestHydrolakesIsInExistingOsmCrosswalk": bool(crosswalk_refs),
                "nearestHydrolakesExistingCrosswalkReferences": crosswalk_refs,
                "distanceThresholdScreen": thresholds,
                "reviewFlags": review_flags,
                "reviewStatus": "name-and-point-proximity-lead-only;identity-not-validated",
            }
        )

    queue_bytes = "".join(
        json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in output_rows
    ).encode("utf-8")
    refresh = "--refresh" in sys.argv[1:]
    write_immutable(ROOT / QUEUE_RELATIVE, queue_bytes, refresh=refresh)
    ignored = subprocess.run(["git", "check-ignore", "--quiet", QUEUE_RELATIVE.as_posix()], cwd=ROOT, check=False)
    if ignored.returncode != 0:
        (ROOT / QUEUE_RELATIVE).unlink(missing_ok=True)
        raise RuntimeError("Nearest-candidate queue is not Git-ignored; removed it to prevent accidental publication")

    report = {
        "schemaVersion": 1,
        "reviewId": f"geonames-calabarzon-hydrolakes-proximity-crosswalk-{RUN_DATE_COMPACT}",
        "generatedOn": RUN_DATE,
        "status": "local-name-and-pour-point-proximity-crosswalk-built;all-pairs-candidate-only;manual-identity-review-pending",
        "scope": {
            "regionId": REGION_ID,
            "candidateFeatureGroup": "lake_reservoir_or_pool",
            "candidateSelection": "17 GeoNames CALABARZON records classified by the GeoNames source feature-code grouping in the pinned region queue",
            "comparisonInputs": [
                REGION_QUEUE_RELATIVE.as_posix(),
                HYDROLAKES_QUEUE_RELATIVE.as_posix(),
                SEVEN_LAKES_RELATIVE.as_posix(),
                SAMPALOC_RELATIVE.as_posix(),
            ],
            "nameMatching": "case-folded Unicode normalization; punctuation collapsed; generic English lake/lakes tokens removed; no fuzzy spelling match",
            "spatialMatching": "Haversine distance between GeoNames gazetteer points and HydroLAKES pour points; nearest point is a review lead, not polygon overlap or identity evidence",
        },
        "provenance": {
            relative: {"sha256": sha256_bytes(raw), "bytes": len(raw)} for relative, raw in input_bytes.items()
        },
        "existingReviewContext": {
            "sevenLakesCrosswalk": {
                "path": SEVEN_LAKES_RELATIVE.as_posix(),
                "status": seven_lakes.get("status"),
                "namedOsmFeatures": len(seven_lakes.get("features", [])),
                "featuresWithHydrolakesSpatialCandidate": sum(
                    feature.get("hydrolakesCandidate") is not None for feature in seven_lakes.get("features", [])
                ),
            },
            "sampalocCrosswalk": {"path": SAMPALOC_RELATIVE.as_posix(), "status": sampaloc.get("status")},
            "knownHydrolakesIdsInExistingOsmSpatialCrosswalks": sorted(known_hydrolakes_ids),
        },
        "results": {
            "geonamesCalabarzonCandidatesCompared": len(lake_candidates),
            "hydrolakesPhilippinesCandidatesSearched": len(hydrolakes),
            "geonamesRowsWithExactCanonicalNameMatch": len(canonical_name_matched_candidates),
            "canonicalNameMatchEvidenceRowsBySourceKind": dict(sorted(canonical_name_matches_by_kind.items())),
            "canonicalNameMatchedHydrolakesIdAgreesWithNearest": canonical_match_nearest_id_agrees,
            "canonicalNameMatchedHydrolakesIdDiffersFromNearest": canonical_match_nearest_id_disagrees,
            "geonamesRowsWithNearestHydrolakesWithinDistanceKm": {
                "1": distance_counts["within1Km"],
                "5": distance_counts["within5Km"],
                "10": distance_counts["within10Km"],
                "25": distance_counts["within25Km"],
            },
            "geonamesRowsWhoseNearestHydrolakesIdAppearsInExistingOsmSpatialCrosswalk": known_crosswalk_nearest_rows,
            "distinctNearestCrosswalkHydrolakesIds": sorted(known_crosswalk_nearest_ids),
            "nearestHydrolakesRowsWithSourceName": nearest_named_hydrolakes_rows,
            "geonamesRowsByFeatureCode": dict(sorted(feature_code_counts.items())),
            "waterbodyIdentitiesValidated": 0,
            "regionAssignmentsAdded": 0,
            "speciesAssertionsAdded": 0,
            "publicGeometryAdded": False,
            "publicationApproval": False,
        },
        "localReviewQueue": {
            "path": QUEUE_RELATIVE.as_posix(),
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
            "GeoNames point locations and HydroLAKES pour points can refer to different places on the same water system; distance alone does not establish identity.",
            "HydroLAKES pour points are outlets, not lake centers or shorelines; this run did not compare polygons.",
            "Canonical name matches remove only generic English lake/lakes tokens. No fuzzy matching, translated-name equivalence, or alias resolution was attempted.",
            "The existing Seven Lakes and Sampaloc spatial crosswalks rely on community-mapped OSM geometries and explicitly are not official or survey-validated boundaries; ODbL terms apply to OSM-derived data.",
            "HydroLAKES v1 targets lakes of at least 10 ha and omits river and wetland polygons; unmatched names and absent candidates do not establish waterbody absence.",
            "This is local research only. No species, habitat, fishing-access, legal-boundary, water-quality, or safety claim was added to the app.",
        ],
        "nextAction": "Manually compare the local queue against named independent maps, literature and reusable non-OSM sources; keep every pair unverified until a source explicitly supports the same waterbody, then review locality-specific fish evidence separately.",
    }
    report_bytes = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    write_immutable(ROOT / REPORT_RELATIVE, report_bytes, refresh=refresh)
    print(f"CALABARZON GeoNames lake/reservoir/pool candidates: {len(lake_candidates)}")
    print(f"Canonical exact name candidate rows: {len(canonical_name_matched_candidates)}")
    print(f"Canonical name's HydroLAKES ID agrees/differs from nearest outlet: {canonical_match_nearest_id_agrees}/{canonical_match_nearest_id_disagrees}")
    print(f"Nearest HydroLAKES outlet within 1/5/10/25 km: {distance_counts['within1Km']}/{distance_counts['within5Km']}/{distance_counts['within10Km']}/{distance_counts['within25Km']}")
    print(f"Nearest outlet ID already in OSM spatial crosswalk: {known_crosswalk_nearest_rows}; identity validations: 0")
    print(f"Local-only review queue: {QUEUE_RELATIVE}")
    print(f"Aggregate report: {REPORT_RELATIVE}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
