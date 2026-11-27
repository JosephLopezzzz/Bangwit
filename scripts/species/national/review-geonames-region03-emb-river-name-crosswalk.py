#!/usr/bin/env python3
"""Build a local-only name-candidate crosswalk for the Region III EMB river roster."""

from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
import sys
import unicodedata
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
RUN_DATE = "2026-11-27"
RUN_DATE_COMPACT = RUN_DATE.replace("-", "")
GEO_NAMES_RELATIVE = Path(
    "data/research/philippines/raw/national/geonames-ph-20261107/central-luzon-hydrographic-candidates.jsonl"
)
EMB_CROSSWALK_RELATIVE = Path(
    "data/research/philippines/national/reviews/central-luzon-emb-r3-river-name-locality-crosswalk-20261127.json"
)
EMB_SCOPE_RELATIVE = Path(
    "data/research/philippines/national/reviews/central-luzon-emb-r3-2024-monitoring-scope-crosscheck-20261127.json"
)
REPORT_RELATIVE = Path(
    f"data/research/philippines/national/reviews/geonames-region03-emb-river-name-crosswalk-{RUN_DATE_COMPACT}.json"
)
QUEUE_RELATIVE = Path(
    "data/research/philippines/raw/national/geonames-ph-20261107/central-luzon-emb-river-name-review.jsonl"
)
EXPECTED_HASHES = {
    GEO_NAMES_RELATIVE.as_posix(): "865964a931f9c7c52ffdad84b5bf5d045ddc1d677b002ad934a6137f545afbeb",
    EMB_CROSSWALK_RELATIVE.as_posix(): "aaecb033ebf636b4b821a3bff389308d590bddfabbd313b26f6e3530fed33890",
    EMB_SCOPE_RELATIVE.as_posix(): "cb21c62f21e1c23ed567b233a770e7c26f602551909f5a48b94a7e4dca09aef3",
}
REGION_FLOW_CODES = {"CHN", "STM", "STMC", "STMD", "STMI", "STMIX", "STMX", "WTRC"}
GENERIC_TERMS = {"river", "rivers", "stream", "streams", "watercourse", "channel"}


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


def write_immutable(path: Path, content: bytes, *, refresh: bool = False) -> None:
    if path.exists():
        if path.read_bytes() == content:
            return
        if not refresh:
            raise FileExistsError(f"Refusing to overwrite a different research output: {path}; rerun with --refresh")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    with temporary.open("wb") as output:
        output.write(content)
        output.flush()
        os.fsync(output.fileno())
    temporary.replace(path)


def normalized_full_name(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value.casefold())
    ascii_name = decomposed.encode("ascii", errors="ignore").decode("ascii")
    return " ".join(re.findall(r"[a-z0-9]+", ascii_name))


def normalized_base_name(value: str) -> str:
    # Parenthetical EMB qualifiers are ignored only for candidate retrieval; they
    # remain attached to the source label and never imply reach equivalence.
    without_qualifiers = re.sub(r"\([^)]*\)", " ", value)
    tokens = normalized_full_name(without_qualifiers).split()
    while tokens and tokens[-1] in GENERIC_TERMS:
        tokens.pop()
    return " ".join(tokens)


def main() -> int:
    geo_bytes, geonames = read_pinned(GEO_NAMES_RELATIVE)
    emb_crosswalk_bytes, emb_crosswalk = read_pinned(EMB_CROSSWALK_RELATIVE)
    emb_scope_bytes, emb_scope = read_pinned(EMB_SCOPE_RELATIVE)
    if emb_crosswalk["regionId"] != "0300000000" or emb_scope["regionId"] != "0300000000":
        raise ValueError("Pinned EMB review scope is no longer Region III")
    if emb_crosswalk["findings"]["monitoringRoster"]["sourceReportedRiverNameEntryCount"] != 14:
        raise ValueError("EMB's reviewed river-name roster changed; re-review before proceeding")
    if len(geonames) != 1106:
        raise ValueError("Pinned GeoNames Central Luzon candidate count changed")

    ignored = subprocess.run(["git", "check-ignore", "--quiet", QUEUE_RELATIVE.as_posix()], cwd=ROOT, check=False)
    if ignored.returncode != 0:
        raise RuntimeError("EMB/GeoNames crosswalk queue path is not Git-ignored")

    candidates = [row for row in geonames if row.get("featureCode") in REGION_FLOW_CODES and row.get("name")]
    by_full_name: dict[str, list[dict[str, Any]]] = {}
    by_base_name: dict[str, list[dict[str, Any]]] = {}
    for row in candidates:
        by_full_name.setdefault(normalized_full_name(row["name"]), []).append(row)
        by_base_name.setdefault(normalized_base_name(row["name"]), []).append(row)

    source_labels = emb_crosswalk["findings"]["monitoringRoster"]["namesAsPrinted"]
    queue_rows = []
    full_match_labels = 0
    base_candidate_labels = 0
    full_candidate_ids: set[int] = set()
    base_candidate_ids: set[int] = set()
    base_only_labels = 0
    candidate_code_counts: Counter[str] = Counter()
    candidate_province_counts: Counter[str] = Counter()
    for source_label in source_labels:
        full_key = normalized_full_name(source_label)
        base_key = normalized_base_name(source_label)
        full_matches = by_full_name.get(full_key, []) if full_key else []
        base_matches = by_base_name.get(base_key, []) if base_key else []
        if full_matches:
            full_match_labels += 1
            full_candidate_ids.update(int(row["geonameId"]) for row in full_matches)
        if base_matches:
            base_candidate_labels += 1
            base_candidate_ids.update(int(row["geonameId"]) for row in base_matches)
        if base_matches and not full_matches:
            base_only_labels += 1
        selected = {int(row["geonameId"]): row for row in [*full_matches, *base_matches]}
        match_rows = []
        for row in sorted(selected.values(), key=lambda item: (item["singlePolygonPointContext"], item["featureCode"], int(item["geonameId"]))):
            candidate_code_counts[row["featureCode"]] += 1
            candidate_province_counts[row["singlePolygonPointContext"]] += 1
            match_rows.append(
                {
                    "geonameId": int(row["geonameId"]),
                    "name": row["name"],
                    "featureCode": row["featureCode"],
                    "provincePolygonPointContext": row["singlePolygonPointContext"],
                    "longitudeWgs84": row["longitudeWgs84"],
                    "latitudeWgs84": row["latitudeWgs84"],
                    "fullNormalizedNameMatch": int(row["geonameId"]) in {int(item["geonameId"]) for item in full_matches},
                    "qualifierStrippedBaseNameCandidate": int(row["geonameId"]) in {int(item["geonameId"]) for item in base_matches},
                    "identityValidated": False,
                }
            )
        queue_rows.append(
            {
                "embReportedRiverLabel": source_label,
                "normalizedFullNameKey": full_key,
                "normalizedBaseNameKey": base_key,
                "fullNameCandidateCount": len(full_matches),
                "qualifierStrippedBaseCandidateCount": len(base_matches),
                "candidateRows": match_rows,
                "waterbodyIdentityValidated": False,
                "speciesEvidence": False,
            }
        )

    queue_bytes = "".join(
        json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in queue_rows
    ).encode("utf-8")
    refresh = "--refresh" in sys.argv[1:]
    write_immutable(ROOT / QUEUE_RELATIVE, queue_bytes, refresh=refresh)
    candidate_union_ids = full_candidate_ids | base_candidate_ids
    report = {
        "schemaVersion": 1,
        "reviewId": f"geonames-region03-emb-river-name-crosswalk-{RUN_DATE_COMPACT}",
        "reviewedOn": RUN_DATE,
        "phaseId": "L3",
        "regionId": "0300000000",
        "regionName": "Region III (Central Luzon)",
        "status": "14-emb-roster-labels-screened-against-geonames;name-candidates-only;research-only",
        "sourceIds": ["emb-r3-state-environment-2024", "geonames-ph-country-hydrography-2026-11-07"],
        "inputs": [
            str(EMB_CROSSWALK_RELATIVE).replace("\\", "/"),
            str(EMB_SCOPE_RELATIVE).replace("\\", "/"),
            str(GEO_NAMES_RELATIVE).replace("\\", "/"),
        ],
        "method": {
            "candidateGeoNamesFeatureCodes": sorted(REGION_FLOW_CODES),
            "fullNameMatching": "exact normalized text after Unicode decomposition, case-folding, and punctuation/space normalization",
            "baseNameCandidateMatching": "exact normalized tokens after stripping parenthetical qualifiers from the EMB label and removing a terminal generic river/stream/watercourse/channel term; qualifier-stripped candidates are discovery leads only",
            "fuzzyMatching": False,
            "spatialRole": "already screened against simplified province polygons for coarse point context; no reach geometry or official province assignment is implied",
        },
        "results": {
            "embRiverLabelsScreened": len(source_labels),
            "geonamesStreamChannelRowsEligibleForNameScreen": len(candidates),
            "embLabelsWithFullNormalizedNameMatch": full_match_labels,
            "embLabelsWithQualifierStrippedBaseNameCandidate": base_candidate_labels,
            "baseCandidateLabelsWithoutFullNameMatch": base_only_labels,
            "uniqueGeoNamesRowsInCandidateUnion": len(candidate_union_ids),
            "candidateLabelPairsByFeatureCode": dict(sorted(candidate_code_counts.items())),
            "candidateLabelPairsByProvincePolygonPointContext": dict(sorted(candidate_province_counts.items())),
            "waterbodyIdentitiesValidated": 0,
            "riverReachAssignmentsValidated": 0,
            "speciesAssertionsAdded": 0,
            "publicGeometryAdded": False,
        },
        "localReviewQueue": {
            "path": str(QUEUE_RELATIVE).replace("\\", "/"),
            "rows": len(queue_rows),
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
            "The EMB source's 14 labels are monitoring roster units, not a complete regional river list or proof of unique systems.",
            "A name match does not establish that a GeoNames point is the EMB-monitored waterbody, station, reach, or segment.",
            "Qualifiers such as upstream or provincial reporting labels are ignored only to retrieve possible base-name candidates; they are not resolved or merged.",
            "GeoNames records are gazetteer points with aggregated source provenance, not river centerlines or independent confirmations.",
            "The prior EMB locality crosswalk found mixed locality precision and unresolved reach relationships; the underlying official report was only available as indexed text because direct PDF and screenshot requests returned HTTP 403.",
            "No species occurrence, fishing access, regulation, water safety, public geometry, or app assertion follows from these name candidates.",
            "Exact names, identifiers, and coordinates remain only in Git-ignored local storage.",
        ],
        "nextAction": "Review each name candidate with locality-specific source evidence and a rights-cleared river centerline or station map; do not assign species records until reach and sampling-site links are separately resolved.",
    }
    report_bytes = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    report_path = ROOT / REPORT_RELATIVE
    report_path.parent.mkdir(parents=True, exist_ok=True)
    write_immutable(report_path, report_bytes, refresh=refresh)
    print(
        f"EMB roster labels: {len(source_labels)}; full exact-name labels: {full_match_labels}; "
        f"qualifier-stripped base-name candidate labels: {base_candidate_labels}; unique GeoNames candidate rows: {len(candidate_union_ids)}"
    )
    print("Canonical river identities or reach assignments: 0; species assertions: 0")
    print(f"Local-only review queue: {QUEUE_RELATIVE}")
    print(f"Aggregate report: {REPORT_RELATIVE}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
