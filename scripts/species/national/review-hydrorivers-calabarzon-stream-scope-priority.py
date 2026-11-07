#!/usr/bin/env python3
"""Join local CALABARZON name-scope leads to HydroRIVERS proximity screens."""

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
RUN_DATE = "2026-11-08"
RUN_DATE_COMPACT = "20261108"
SCOPE_QUEUE_RELATIVE = Path(
    "data/research/philippines/raw/national/geonames-ph-20261107/calabarzon-stream-scope-review.jsonl"
)
NEAREST_QUEUE_RELATIVE = Path(
    "data/research/philippines/raw/national/fao-hydrorivers-calabarzon-wfs-20261108/calabarzon-geonames-stream-nearest-hydrorivers.jsonl"
)
NEAREST_REPORT_RELATIVE = Path(
    "data/research/philippines/national/reviews/fao-hydrorivers-calabarzon-wfs-screen-20261108.json"
)
RAW_QUEUE_RELATIVE = Path(
    f"data/research/philippines/raw/national/fao-hydrorivers-calabarzon-wfs-{RUN_DATE_COMPACT}/stream-scope-nearest-line-review.jsonl"
)
REPORT_RELATIVE = Path(
    f"data/research/philippines/national/reviews/fao-hydrorivers-calabarzon-stream-scope-priority-{RUN_DATE_COMPACT}.json"
)
EXPECTED_HASHES = {
    SCOPE_QUEUE_RELATIVE.as_posix(): "5b535f6d65872f224b72c2d1f300b3d9b08ee8d076b041af00a2c8acaa76c454",
    NEAREST_QUEUE_RELATIVE.as_posix(): "711f20be9d195a258eb770354d94ba123934922fbe3be337bfdfd6ceadd5fbee",
    NEAREST_REPORT_RELATIVE.as_posix(): "adfbb8610c0311155b6fed4ae1d7eb320bdb20222ecce6cc3675c94c9fb27138",
}
DISTANCE_THRESHOLDS_KM = (1, 5, 10, 25, 50)


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def read_pinned(relative: Path) -> tuple[bytes, Any]:
    raw = (ROOT / relative).read_bytes()
    expected = EXPECTED_HASHES[relative.as_posix()]
    actual = sha256_bytes(raw)
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


def git_ignored(relative: Path) -> bool:
    return subprocess.run(
        ["git", "check-ignore", "--quiet", relative.as_posix()], cwd=ROOT, check=False
    ).returncode == 0


def main() -> int:
    refresh = "--refresh" in sys.argv[1:]
    scope_bytes, scope_rows = read_pinned(SCOPE_QUEUE_RELATIVE)
    nearest_bytes, nearest_rows = read_pinned(NEAREST_QUEUE_RELATIVE)
    _, nearest_report = read_pinned(NEAREST_REPORT_RELATIVE)

    if len(scope_rows) != 45 or len(nearest_rows) != 783:
        raise ValueError("Pinned source row counts changed; inspect both candidate screens before continuing")
    nearest_by_id = {int(row["geonameId"]): row for row in nearest_rows}
    if len(nearest_by_id) != len(nearest_rows):
        raise ValueError("The HydroRIVERS proximity screen contains duplicate GeoNames IDs")
    scope_ids = [int(row["geonameId"]) for row in scope_rows]
    if len(set(scope_ids)) != len(scope_ids) or not set(scope_ids).issubset(nearest_by_id):
        raise ValueError("The scope crosswalk rows do not map one-to-one into the pinned nearest-line queue")

    pair_rows = []
    context_counts: Counter[str] = Counter()
    pair_distance_counts: Counter[str] = Counter()
    candidate_distance_counts: Counter[str] = Counter()
    reach_ids: set[str] = set()
    matched_scope_ids: set[str] = set()
    matched_geo_ids: set[int] = set()
    multi_match_candidates = 0
    candidates_without_nearest = 0

    for candidate in scope_rows:
        geoname_id = int(candidate["geonameId"])
        nearest_row = nearest_by_id[geoname_id]
        nearest = nearest_row.get("nearestHydroRiversCandidate")
        matches = candidate.get("matches", [])
        if not matches:
            continue
        matched_geo_ids.add(geoname_id)
        if len(matches) > 1:
            multi_match_candidates += 1
        if nearest is None:
            candidates_without_nearest += 1
        else:
            reach_ids.add(str(nearest.get("hyrivId")))
            distance = float(nearest["distanceKm"])
            for threshold in DISTANCE_THRESHOLDS_KM:
                if distance <= threshold:
                    candidate_distance_counts[str(threshold)] += 1

        for match in matches:
            comparison = str(match.get("provinceContextComparison", "unresolved"))
            context_counts[comparison] += 1
            matched_scope_ids.add(str(match.get("waterbodyId", "")))
            distance = float(nearest["distanceKm"]) if nearest is not None else None
            for threshold in DISTANCE_THRESHOLDS_KM:
                if distance is not None and distance <= threshold:
                    pair_distance_counts[f"{comparison}:{threshold}Km"] += 1
            pair_rows.append(
                {
                    "geonameId": geoname_id,
                    "candidateProvincePolygonPointContext": candidate.get("candidateProvincePolygonPointContext"),
                    "featureCode": candidate.get("featureCode"),
                    "scopeLeadId": match.get("waterbodyId"),
                    "scopeLeadProvinceIds": sorted(match.get("administrativeProvinceIds", [])),
                    "scopeLeadBoundaryStatus": match.get("boundaryStatus"),
                    "provinceContextComparison": comparison,
                    "nearestModeledReach": {
                        "hydroRiversId": nearest.get("hyrivId") if nearest else None,
                        "mainRiverIdentifier": nearest.get("mainRiverIdentifier") if nearest else None,
                        "streamOrder": nearest.get("streamOrder") if nearest else None,
                        "catchmentAreaKm2": nearest.get("catchmentAreaKm2") if nearest else None,
                        "distanceKm": nearest.get("distanceKm") if nearest else None,
                    },
                    "reviewStatus": "cross-source-priority-lead-only;name-and-proximity-do-not-validate-reach-identity",
                }
            )

    pair_rows.sort(key=lambda row: (row["geonameId"], str(row["scopeLeadId"])))
    if len(pair_rows) != 46 or len(matched_scope_ids) != 38 or len(matched_geo_ids) != 45:
        raise ValueError("The pinned name-crosswalk pair counts changed; review the upstream candidate scope")

    raw_queue_bytes = "".join(
        json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in pair_rows
    ).encode("utf-8")
    if not git_ignored(RAW_QUEUE_RELATIVE):
        raise RuntimeError("The exact joined review queue is not Git-ignored; refusing to write row-level details")
    write_immutable(ROOT / RAW_QUEUE_RELATIVE, raw_queue_bytes, refresh=refresh)
    if not git_ignored(RAW_QUEUE_RELATIVE):
        (ROOT / RAW_QUEUE_RELATIVE).unlink(missing_ok=True)
        raise RuntimeError("The joined review queue is not Git-ignored; removed it")

    report = {
        "schemaVersion": 1,
        "reviewId": f"fao-hydrorivers-calabarzon-stream-scope-priority-{RUN_DATE_COMPACT}",
        "generatedOn": RUN_DATE,
        "status": "scope-name-leads-joined-to-modeled-line-proximity;manual-source-review-required;no-identity-validation",
        "inputs": {
            SCOPE_QUEUE_RELATIVE.as_posix(): {"sha256": sha256_bytes(scope_bytes), "rows": len(scope_rows)},
            NEAREST_QUEUE_RELATIVE.as_posix(): {"sha256": sha256_bytes(nearest_bytes), "rows": len(nearest_rows)},
            NEAREST_REPORT_RELATIVE.as_posix(): {"sha256": EXPECTED_HASHES[NEAREST_REPORT_RELATIVE.as_posix()]},
        },
        "results": {
            "geoNamesScopeMatchRows": len(matched_geo_ids),
            "nameToScopeLeadPairs": len(pair_rows),
            "distinctScopeLeadIds": len(matched_scope_ids),
            "provinceContextPairCounts": dict(sorted(context_counts.items())),
            "candidatePointRowsWithMultipleScopeLeads": multi_match_candidates,
            "matchedCandidatePointsWithoutNearestModeledLine": candidates_without_nearest,
            "distinctNearestHydroRiversIdsForMatchedPoints": len(reach_ids),
            "candidatePointRowsWithinDistanceKm": dict(sorted(candidate_distance_counts.items(), key=lambda item: int(item[0]))),
            "nameToScopeLeadPairsWithinDistanceByContext": dict(sorted(pair_distance_counts.items())),
            "watercourseIdentitiesValidated": 0,
            "regionAssignmentsAdded": 0,
            "speciesAssertionsAdded": 0,
            "appGeometryAdded": False,
            "publicationApproval": False,
        },
        "localQueue": {
            "path": RAW_QUEUE_RELATIVE.as_posix(),
            "rows": len(pair_rows),
            "sha256": sha256_bytes(raw_queue_bytes),
            "gitIgnored": True,
            "containsNamesOrCoordinates": False,
            "containsExactProviderIds": True,
        },
        "limitations": [
            "The exact normalized-name matches are cross-source discovery leads, not verified watercourse identities.",
            "The HydroRIVERS nearest-line distance is a coarse regional projection screen and cannot confirm that a modeled reach is the named scope lead.",
            "Province context comes from simplified land polygons and source scope associations; conflicts need review and do not invalidate either source automatically.",
            "The FAO WFS bounding rectangle includes adjacent areas and is not an exact CALABARZON feature subset.",
            "HydroRIVERS omits smaller networks under its published threshold and is not field-verified current channel geometry.",
            "Raw rows, names, coordinates and exact source IDs stay in Git-ignored local research storage; nothing is admitted to app data.",
        ],
        "nextAction": "Review local rows with province-context conflicts and multiple scope leads against primary maps, source descriptions and study locality evidence; record an identity decision only when independent evidence supports it, while separately resolving HydroSHEDS distribution terms.",
    }
    report_bytes = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    write_immutable(ROOT / REPORT_RELATIVE, report_bytes, refresh=refresh)
    print(f"Joined {len(pair_rows)} scope-name pairs across {len(matched_geo_ids)} GeoNames points.")
    print("Proximity groups are research priorities only; validated watercourse identities: 0.")
    print(f"Git-ignored joined queue: {RAW_QUEUE_RELATIVE}")
    print(f"Aggregate report: {REPORT_RELATIVE}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
