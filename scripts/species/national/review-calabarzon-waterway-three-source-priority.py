#!/usr/bin/env python3
"""Combine GeoNames, HydroRIVERS and OSM waterway screens for manual review."""

from __future__ import annotations

import hashlib
import json
import os
import subprocess
import sys
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
RUN_DATE = "2026-11-09"
RUN_DATE_COMPACT = "20261109"
SCOPE_QUEUE_RELATIVE = Path(
    "data/research/philippines/raw/national/geonames-ph-20261107/calabarzon-stream-scope-review.jsonl"
)
HYDRORIVERS_QUEUE_RELATIVE = Path(
    "data/research/philippines/raw/national/fao-hydrorivers-calabarzon-wfs-20261108/stream-scope-nearest-line-review.jsonl"
)
OSM_QUEUE_RELATIVE = Path(
    "data/research/philippines/raw/national/osm-calabarzon-waterway-name-crosscheck-20261108/candidate-crosscheck.jsonl"
)
HYDRORIVERS_REPORT_RELATIVE = Path(
    "data/research/philippines/national/reviews/fao-hydrorivers-calabarzon-stream-scope-priority-20261108.json"
)
OSM_REPORT_RELATIVE = Path(
    "data/research/philippines/national/reviews/osm-calabarzon-waterway-name-crosscheck-20261108.json"
)
RAW_QUEUE_RELATIVE = Path(
    f"data/research/philippines/raw/national/osm-calabarzon-waterway-name-crosscheck-20261108/three-source-priority-{RUN_DATE_COMPACT}.jsonl"
)
REPORT_RELATIVE = Path(
    f"data/research/philippines/national/reviews/calabarzon-waterway-three-source-priority-{RUN_DATE_COMPACT}.json"
)
EXPECTED_HASHES = {
    SCOPE_QUEUE_RELATIVE.as_posix(): "5b535f6d65872f224b72c2d1f300b3d9b08ee8d076b041af00a2c8acaa76c454",
    HYDRORIVERS_QUEUE_RELATIVE.as_posix(): "095bd645f09efe081350099d030d242003a041d1f79fdca0f04f9208875ab211",
    OSM_QUEUE_RELATIVE.as_posix(): "530c93fa4b226861c75c8e04791ac553b765abdd1a49c304531dfbecebbc169d",
    HYDRORIVERS_REPORT_RELATIVE.as_posix(): "f42d041901c94d9d042a89ead7ca5c15b4287b0aeb8cddea660c417425e683a9",
    OSM_REPORT_RELATIVE.as_posix(): "d9047db7d694bd8584629c8733a5cd7f256b4addbdbaeded8c772b94a11a35a3",
}
DISTANCE_THRESHOLDS_KM = (1, 5, 10, 25, 50)


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def read_pinned(relative: Path) -> tuple[bytes, Any]:
    raw = (ROOT / relative).read_bytes()
    actual = sha256_bytes(raw)
    expected = EXPECTED_HASHES[relative.as_posix()]
    if actual != expected:
        raise ValueError(f"Pinned input changed: {relative} (expected {expected}, got {actual})")
    if relative.suffix == ".jsonl":
        parsed = [json.loads(line) for line in raw.decode("utf-8").splitlines() if line.strip()]
    else:
        parsed = json.loads(raw.decode("utf-8"))
    return raw, parsed


def write_immutable(path: Path, content: bytes, *, refresh: bool) -> None:
    if path.exists() and path.read_bytes() != content and not refresh:
        raise FileExistsError(f"Refusing to overwrite changed review output: {path}; rerun with --refresh")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    with temporary.open("wb") as output:
        output.write(content)
        output.flush()
        os.fsync(output.fileno())
    temporary.replace(path)


def is_git_ignored(relative: Path) -> bool:
    return subprocess.run(
        ["git", "check-ignore", "--quiet", relative.as_posix()], cwd=ROOT, check=False
    ).returncode == 0


def threshold_counts(
    rows: list[dict[str, Any]], distance_key: str, *, context_key: str | None = None
) -> Counter[str]:
    counts: Counter[str] = Counter()
    for row in rows:
        distance = row.get(distance_key)
        if distance is None:
            continue
        context = str(row.get(context_key, "all")) if context_key else "all"
        for threshold in DISTANCE_THRESHOLDS_KM:
            if float(distance) <= threshold:
                counts[f"{context}:{threshold}Km"] += 1
    return counts


def main() -> int:
    refresh = "--refresh" in sys.argv[1:]
    scope_bytes, scope_rows = read_pinned(SCOPE_QUEUE_RELATIVE)
    hydro_bytes, hydro_rows = read_pinned(HYDRORIVERS_QUEUE_RELATIVE)
    osm_bytes, osm_rows = read_pinned(OSM_QUEUE_RELATIVE)
    _, hydro_report = read_pinned(HYDRORIVERS_REPORT_RELATIVE)
    _, osm_report = read_pinned(OSM_REPORT_RELATIVE)
    if len(scope_rows) != 45 or len(hydro_rows) != 46 or len(osm_rows) != 45:
        raise ValueError("Pinned review row counts changed; inspect the upstream source crosswalks")
    if not hydro_report.get("localQueue", {}).get("gitIgnored"):
        raise ValueError("HydroRIVERS source queue is not marked local-only")
    if not osm_report.get("localResearchStorage", {}).get("candidateCrosswalkGitIgnored"):
        raise ValueError("OSM source queue is not marked local-only")

    hydro_by_pair = {(int(row["geonameId"]), str(row["scopeLeadId"])): row for row in hydro_rows}
    if len(hydro_by_pair) != len(hydro_rows):
        raise ValueError("Duplicate GeoNames-to-scope pairs found in HydroRIVERS priority queue")
    osm_by_geo_id = {int(row["geonameId"]): row for row in osm_rows}
    if len(osm_by_geo_id) != len(osm_rows):
        raise ValueError("Duplicate GeoNames IDs found in OSM candidate crosswalk")

    local_rows = []
    context_counts: Counter[str] = Counter()
    concurrence: Counter[str] = Counter()
    pair_rows = 0
    points_with_osm_name = 0
    points_with_osm_near_1km = 0
    points_with_osm_near_5km = 0
    points_with_hydrorivers_near_1km = 0
    points_with_both_near_1km = 0
    unique_geo_ids_with_osm: set[int] = set()
    unique_geo_ids_with_both: set[int] = set()

    for scope_candidate in scope_rows:
        geo_id = int(scope_candidate["geonameId"])
        osm_candidate = osm_by_geo_id[geo_id]
        osm_features = osm_candidate.get("sameNormalizedNameOsmWaterwayFeatures", [])
        osm_distance = osm_candidate.get("nearestSameNameOsmWaterwayDistanceKm")
        has_osm = bool(osm_features)
        if has_osm:
            unique_geo_ids_with_osm.add(geo_id)
            if osm_distance is not None and float(osm_distance) <= 1:
                points_with_osm_near_1km += 1
            if osm_distance is not None and float(osm_distance) <= 5:
                points_with_osm_near_5km += 1

        for scope_match in scope_candidate.get("matches", []):
            scope_id = str(scope_match.get("waterbodyId", ""))
            pair = hydro_by_pair.get((geo_id, scope_id))
            if pair is None:
                raise ValueError(f"No HydroRIVERS priority pair found for candidate {geo_id}")
            pair_rows += 1
            context = str(scope_match.get("provinceContextComparison", "unresolved"))
            context_counts[context] += 1
            hydro_distance = pair.get("nearestModeledReach", {}).get("distanceKm")
            hydro_near_1 = hydro_distance is not None and float(hydro_distance) <= 1
            osm_near_1 = osm_distance is not None and float(osm_distance) <= 1
            if hydro_near_1:
                points_with_hydrorivers_near_1km += 1
            if hydro_near_1 and osm_near_1:
                points_with_both_near_1km += 1
                unique_geo_ids_with_both.add(geo_id)
            label = "both-within-1km" if hydro_near_1 and osm_near_1 else (
                "hydrorivers-only-within-1km" if hydro_near_1 else (
                    "osm-only-within-1km" if osm_near_1 else "neither-within-1km"
                )
            )
            concurrence[f"{context}:{label}"] += 1
            local_rows.append(
                {
                    "geonameId": geo_id,
                    "scopeLeadId": scope_id,
                    "provinceContextComparison": context,
                    "hydroRiversNearestReachId": pair.get("nearestModeledReach", {}).get("hydroRiversId"),
                    "hydroRiversNearestDistanceKm": hydro_distance,
                    "osmNearestSameNameElementId": osm_features[0].get("osmElementId") if osm_features else None,
                    "osmNearestSameNameDistanceKm": osm_distance,
                    "osmSameNameFeatureCount": len(osm_features),
                    "priorityCategoryAt1Km": label,
                    "reviewStatus": "three-source-spatial-priority-only;no-watercourse-identity-validation",
                }
            )

    if pair_rows != 46 or context_counts != Counter({"province-context-overlap": 35, "province-context-conflict": 11}):
        raise ValueError("The source-pair context totals changed; review the upstream name-scope crosswalk")
    local_rows.sort(key=lambda row: (row["geonameId"], str(row["scopeLeadId"])))
    raw_queue_bytes = "".join(
        json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in local_rows
    ).encode("utf-8")
    if not is_git_ignored(RAW_QUEUE_RELATIVE):
        raise RuntimeError("The exact three-source queue is not Git-ignored; refusing to write row-level IDs")
    write_immutable(ROOT / RAW_QUEUE_RELATIVE, raw_queue_bytes, refresh=refresh)
    if not is_git_ignored(RAW_QUEUE_RELATIVE):
        (ROOT / RAW_QUEUE_RELATIVE).unlink(missing_ok=True)
        raise RuntimeError("The three-source queue is not Git-ignored; removed it")

    report = {
        "schemaVersion": 1,
        "reviewId": f"calabarzon-waterway-three-source-priority-{RUN_DATE_COMPACT}",
        "generatedOn": RUN_DATE,
        "status": "geoNames-hydrorivers-osm-screens-joined;manual-evidence-review-required;no-identities-validated",
        "inputs": {
            SCOPE_QUEUE_RELATIVE.as_posix(): {"sha256": sha256_bytes(scope_bytes), "rows": len(scope_rows)},
            HYDRORIVERS_QUEUE_RELATIVE.as_posix(): {"sha256": sha256_bytes(hydro_bytes), "rows": len(hydro_rows)},
            OSM_QUEUE_RELATIVE.as_posix(): {"sha256": sha256_bytes(osm_bytes), "rows": len(osm_rows)},
        },
        "results": {
            "geoNamesCandidatePoints": len(scope_rows),
            "geoNamesToScopeLeadPairs": pair_rows,
            "pairCountsByProvinceContext": dict(sorted(context_counts.items())),
            "candidatePointsWithSameNormalizedNameOsmWaterway": len(unique_geo_ids_with_osm),
            "candidatePointsWithSameNameOsmFeatureWithin1Km": points_with_osm_near_1km,
            "candidatePointsWithSameNameOsmFeatureWithin5Km": points_with_osm_near_5km,
            "pairRowsWithHydroRiversLineWithin1Km": points_with_hydrorivers_near_1km,
            "pairRowsWithBothSameNameOsmFeatureAndHydroRiversLineWithin1Km": points_with_both_near_1km,
            "distinctCandidatePointsWithBothSourcesWithin1Km": len(unique_geo_ids_with_both),
            "pairConcurrenceAt1Km": dict(sorted(concurrence.items())),
            "watercourseIdentitiesValidated": 0,
            "regionalAssignmentsAdded": 0,
            "speciesAssertionsAdded": 0,
            "appDataOrGeometryAdded": False,
            "publicationApproval": False,
        },
        "localReviewQueue": {
            "path": RAW_QUEUE_RELATIVE.as_posix(),
            "rows": len(local_rows),
            "sha256": sha256_bytes(raw_queue_bytes),
            "gitIgnored": True,
            "containsExactProviderIds": True,
            "namesAndCoordinatesCopied": False,
        },
        "limitations": [
            "The join is a prioritization tool: GeoNames, OSM and HydroRIVERS may contain matching names while referring to different features.",
            "OSM is community-maintained; HydroRIVERS is a modeled network; neither source is a field survey.",
            "Distance uses the earlier regional equirectangular screens and is not a geodetic identity test.",
            "Province-context overlap/conflict is inherited from a separate name-to-scope comparison and simplified land context; it does not validate or invalidate source identities.",
            "No occurrence, current habitat, water quality, access, safety, legal boundary, or species presence claim is produced.",
            "Exact source IDs stay in ignored local storage; no geometry or candidate is admitted to the application.",
        ],
        "nextAction": "Review the local pairs marked both-within-1km or province-context-conflict against independent study locality descriptions and source-backed maps; record identities only when independent primary evidence supports them, and keep the ODbL/HydroSHEDS public-use gates unresolved until reviewed.",
    }
    report_bytes = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    write_immutable(ROOT / REPORT_RELATIVE, report_bytes, refresh=refresh)
    print(f"Joined {pair_rows} name-to-scope pairs; {len(unique_geo_ids_with_osm)} candidate points have an OSM same-name feature.")
    print(f"Pairs with OSM and HydroRIVERS both within 1 km: {points_with_both_near_1km}; identities validated: 0.")
    print(f"Git-ignored review queue: {RAW_QUEUE_RELATIVE}")
    print(f"Aggregate report: {REPORT_RELATIVE}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
