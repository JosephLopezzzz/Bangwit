#!/usr/bin/env python3
"""Join Central Luzon EMB/GeoNames name leads to local HydroRIVERS proximity rows."""

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
RUN_DATE = "2026-11-27"
RUN_DATE_COMPACT = RUN_DATE.replace("-", "")
EMB_REVIEW = Path("data/research/philippines/national/reviews/geonames-region03-emb-river-name-crosswalk-20261127.json")
EMB_QUEUE = Path("data/research/philippines/raw/national/geonames-ph-20261107/central-luzon-emb-river-name-review.jsonl")
HYDRORIVERS_REVIEW = Path("data/research/philippines/national/reviews/fao-hydrorivers-region03-wfs-screen-20261127.json")
HYDRORIVERS_QUEUE = Path("data/research/philippines/raw/national/fao-hydrorivers-region03-wfs-20261127/region03-geonames-stream-nearest-hydrorivers.jsonl")
OUTPUT_QUEUE = Path("data/research/philippines/raw/national/fao-hydrorivers-region03-wfs-20261127/emb-roster-nearest-reach-priority-review.jsonl")
REPORT = Path(f"data/research/philippines/national/reviews/fao-hydrorivers-region03-emb-roster-prioritization-{RUN_DATE_COMPACT}.json")
EXPECTED_HASHES = {
    EMB_QUEUE.as_posix(): "e9df72ef26ebe0b614f6af228066f08c19ceb4e4200a338a6c4d2ad2303061ea",
    HYDRORIVERS_QUEUE.as_posix(): "b70a0e121f13445b08c1a642b72626af3e60466fccc177db57f10bc6e37596fd",
}


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def read_pinned_json(relative: Path) -> dict[str, Any]:
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


def read_pinned_jsonl(relative: Path) -> tuple[bytes, list[dict[str, Any]]]:
    raw = (ROOT / relative).read_bytes()
    expected = EXPECTED_HASHES[relative.as_posix()]
    actual = sha256_bytes(raw)
    if actual != expected:
        raise ValueError(f"Pinned input changed: {relative} (expected {expected}, got {actual})")
    return raw, [json.loads(line) for line in raw.decode("utf-8").splitlines() if line.strip()]


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


def main() -> int:
    if subprocess.run(["git", "check-ignore", "--quiet", OUTPUT_QUEUE.as_posix()], cwd=ROOT, check=False).returncode != 0:
        raise RuntimeError("EMB/HydroRIVERS priority queue is not Git-ignored")
    emb_review = read_pinned_json(EMB_REVIEW)
    hydrorivers_review = read_pinned_json(HYDRORIVERS_REVIEW)
    emb_bytes, emb_rows = read_pinned_jsonl(EMB_QUEUE)
    hydro_bytes, hydro_rows = read_pinned_jsonl(HYDRORIVERS_QUEUE)
    if emb_review["localReviewQueue"]["sha256"] != sha256_bytes(emb_bytes):
        raise ValueError("EMB review does not attest the pinned local queue")
    if hydrorivers_review["localResearchStorage"]["nearestLineQueueSha256"] != sha256_bytes(hydro_bytes):
        raise ValueError("HydroRIVERS review does not attest the pinned nearest-line queue")
    if len(emb_rows) != 14 or len(hydro_rows) != 1062:
        raise ValueError("Pinned review queue counts changed; re-review the scope")

    nearest_by_geoname = {int(row["geonameId"]): row for row in hydro_rows}
    if len(nearest_by_geoname) != len(hydro_rows):
        raise ValueError("HydroRIVERS nearest-line queue contains duplicate GeoNames IDs")

    output_rows = []
    matched_labels = 0
    joined_pairs = 0
    candidate_ids: set[int] = set()
    nearest_hyriv_ids: set[str] = set()
    nearest_main_rivers: set[str] = set()
    pair_distance_counts = Counter()
    label_distance_counts = Counter()
    feature_code_counts = Counter()
    province_context_counts = Counter()
    for source_row in emb_rows:
        candidates = source_row.get("candidateRows", [])
        joined = []
        for candidate in candidates:
            geoname_id = int(candidate["geonameId"])
            nearby = nearest_by_geoname.get(geoname_id)
            if nearby is None:
                raise ValueError(f"No HydroRIVERS nearest-line row for GeoNames id {geoname_id}")
            distance = (nearby.get("nearestHydroRiversCandidate") or {}).get("distanceKm")
            if distance is None:
                raise ValueError(f"No modeled line within the pinned screen radius for GeoNames id {geoname_id}")
            distance = float(distance)
            line = nearby["nearestHydroRiversCandidate"]
            joined.append(
                {
                    **candidate,
                    "nearestModeledReach": line,
                    "distanceThresholdScreenKm": {str(t): distance <= t for t in (1, 5, 10, 25, 50)},
                    "identityValidated": False,
                }
            )
            candidate_ids.add(geoname_id)
            joined_pairs += 1
            feature_code_counts[candidate["featureCode"]] += 1
            province_context_counts[candidate["provincePolygonPointContext"]] += 1
            if line.get("hyrivId") is not None:
                nearest_hyriv_ids.add(str(line["hyrivId"]))
            if line.get("mainRiverIdentifier") is not None:
                nearest_main_rivers.add(str(line["mainRiverIdentifier"]))
            for threshold in (1, 5, 10, 25, 50):
                if distance <= threshold:
                    pair_distance_counts[str(threshold)] += 1
        if joined:
            matched_labels += 1
            for threshold in (1, 5, 10, 25, 50):
                if any(row["distanceThresholdScreenKm"][str(threshold)] for row in joined):
                    label_distance_counts[str(threshold)] += 1
        output_rows.append(
            {
                "embReportedRiverLabel": source_row["embReportedRiverLabel"],
                "fullNameCandidateCount": source_row["fullNameCandidateCount"],
                "qualifierStrippedBaseCandidateCount": source_row["qualifierStrippedBaseCandidateCount"],
                "candidateRows": joined,
                "screenPriorityOnly": True,
                "waterbodyOrReachIdentityValidated": False,
                "speciesEvidence": False,
            }
        )

    queue_bytes = "".join(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in output_rows).encode("utf-8")
    write_immutable(ROOT / OUTPUT_QUEUE, queue_bytes)
    unique_sources = sorted({"emb-r3-state-environment-2024", "geonames-ph-country-hydrography-2026-11-07", "fao-aquastat-rivers-global-2026-wfs"})
    report = {
        "schemaVersion": 1,
        "reviewId": f"fao-hydrorivers-region03-emb-roster-prioritization-{RUN_DATE_COMPACT}",
        "reviewedOn": RUN_DATE,
        "phaseId": "L3",
        "regionId": "0300000000",
        "regionName": "Region III (Central Luzon)",
        "status": "emb-geonames-name-candidates-joined-to-nearest-modeled-line;research-priority-only;identity-pending",
        "sourceIds": unique_sources,
        "inputs": {
            str(EMB_REVIEW).replace("\\", "/"): emb_review["reviewId"],
            str(HYDRORIVERS_REVIEW).replace("\\", "/"): hydrorivers_review["reviewId"],
            str(EMB_QUEUE).replace("\\", "/"): {"sha256": sha256_bytes(emb_bytes), "rows": len(emb_rows)},
            str(HYDRORIVERS_QUEUE).replace("\\", "/"): {"sha256": sha256_bytes(hydro_bytes), "rows": len(hydro_rows)},
        },
        "method": {
            "joinKey": "GeoNames ID from the existing name-only candidate queue",
            "prioritySignal": "nearest HydroRIVERS modeled line distance and shared MAIN_RIV identifier; neither identifies the EMB monitored river or reach",
            "thresholdsKm": [1, 5, 10, 25, 50],
            "lineDistanceMethod": "inherited from the pinned regional equirectangular point-to-segment screen",
        },
        "results": {
            "embLabelsScreened": len(emb_rows),
            "embLabelsWithGeoNamesNameCandidates": matched_labels,
            "joinedEmbGeoNamesCandidatePairs": joined_pairs,
            "distinctGeoNamesRowsInPriorityQueue": len(candidate_ids),
            "distinctNearestHydroRiversReachIds": len(nearest_hyriv_ids),
            "distinctNearestMainRiverIdentifiers": len(nearest_main_rivers),
            "candidatePairsWithinKm": dict(sorted(pair_distance_counts.items(), key=lambda item: int(item[0]))),
            "embLabelsWithAnyCandidateWithinKm": dict(sorted(label_distance_counts.items(), key=lambda item: int(item[0]))),
            "candidatePairsByGeoNamesFeatureCode": dict(sorted(feature_code_counts.items())),
            "candidatePairsByProvincePolygonPointContext": dict(sorted(province_context_counts.items())),
            "waterbodyIdentitiesValidated": 0,
            "reachIdentitiesValidated": 0,
            "regionAssignmentsAdded": 0,
            "speciesAssertionsAdded": 0,
            "publicGeometryAdded": False,
            "publicationApproval": False,
        },
        "localReviewQueue": {
            "path": str(OUTPUT_QUEUE).replace("\\", "/"),
            "rows": len(output_rows),
            "bytes": len(queue_bytes),
            "sha256": sha256_bytes(queue_bytes),
            "gitIgnored": True,
            "containsNamesCoordinatesAndProviderIds": True,
            "appBundleIncluded": False,
        },
        "limitations": [
            "The EMB roster labels are monitoring units, and GeoNames name matches are candidate strings only; the joins do not resolve local station or reach identity.",
            "The nearest FAO line comes from a rectangular bbox with adjacent areas; its distance and MAIN_RIV grouping do not validate the named river.",
            "FAO HydroRIVERS is a modeled reach network that omits streams below its threshold; it is not current field-verified geometry or fish evidence.",
            "The GeoNames points, EMB labels and HydroRIVERS lines have different provenance and are not three independent confirmations of a waterbody.",
            "No species occurrence, legal access, water safety, public geometry, or app content follows from this priority screen.",
            "Raw names, coordinates, GeoNames IDs and HydroRIVERS IDs remain in Git-ignored local research storage.",
        ],
        "nextAction": "Review only the highest-priority source name/line pairs against independent primary locality maps and site records; hold every match until a source resolves the same reach and sampling locality.",
    }
    report_bytes = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    write_immutable(ROOT / REPORT, report_bytes)
    print(f"EMB labels: {len(emb_rows)}; labels with name candidates: {matched_labels}; joined pairs: {joined_pairs}")
    print(f"Unique candidate GeoNames rows: {len(candidate_ids)}; nearest reach IDs: {len(nearest_hyriv_ids)}; MAIN_RIV groups: {len(nearest_main_rivers)}")
    print("Validated river/reach identities: 0; species assertions: 0; public geometry: none")
    print(f"Local-only priority queue: {OUTPUT_QUEUE}")
    print(f"Aggregate report: {REPORT}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
