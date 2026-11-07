#!/usr/bin/env python3
"""Find exact normalized-name leads between GeoNames streams and CALABARZON scope."""

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
RUN_DATE = "2026-11-08"
RUN_DATE_COMPACT = "20261108"
REGION_QUEUE_RELATIVE = Path(
    "data/research/philippines/raw/national/geonames-ph-20261107/calabarzon-hydrographic-candidates.jsonl"
)
SCOPE_RELATIVE = Path("data/research/philippines/calabarzon-scope.json")
REPORT_RELATIVE = Path(
    f"data/research/philippines/national/reviews/geonames-calabarzon-stream-scope-crosswalk-{RUN_DATE_COMPACT}.json"
)
QUEUE_RELATIVE = Path(
    "data/research/philippines/raw/national/geonames-ph-20261107/calabarzon-stream-scope-review.jsonl"
)
EXPECTED_HASHES = {
    REGION_QUEUE_RELATIVE.as_posix(): "3b104459534ab8eb1f0fdb3b45d66c67f44954be863073dddee8ecd5cab8969a",
    SCOPE_RELATIVE.as_posix(): "f1b8d069671bce5a8ca8d5df4b2c3a8516d32b421e4bfbf1eb4341fda19b4ec7",
}
GENERIC_WATER_TERMS = {
    "river", "rivers", "stream", "streams", "creek", "creeks", "brook", "brooks",
    "watercourse", "watercourses", "channel", "channels", "canal", "canals",
    "tributary", "tributaries", "branch", "branches", "fork", "forks", "falls",
    "waterfall", "waterfalls",
}


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def write_output(path: Path, content: bytes, *, refresh: bool) -> None:
    if path.exists() and path.read_bytes() != content and not refresh:
        raise FileExistsError(f"Refusing to overwrite a different review output: {path}; rerun with --refresh")
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
        parsed = [json.loads(line) for line in raw.decode("utf-8").splitlines() if line.strip()]
    else:
        parsed = json.loads(raw.decode("utf-8"))
    return raw, parsed


def normalize(value: str | None) -> str:
    if not value:
        return ""
    decomposed = unicodedata.normalize("NFKD", value.casefold())
    ascii_name = "".join(char for char in decomposed if not unicodedata.combining(char))
    tokens = re.findall(r"[a-z0-9]+", ascii_name)
    return " ".join(token for token in tokens if token not in GENERIC_WATER_TERMS)


def province_context_status(candidate_province: str, province_id_by_name: dict[str, str], waterbody: dict[str, Any]) -> str:
    candidate_id = province_id_by_name.get(candidate_province)
    if not candidate_id:
        return "candidate-point-province-unmapped"
    associated_ids = {
        association.get("provinceId")
        for association in waterbody.get("administrativeAssociations", [])
        if association.get("provinceId")
    }
    if not associated_ids:
        return "scope-lead-has-no-province-id"
    return "province-context-overlap" if candidate_id in associated_ids else "province-context-conflict"


def main() -> int:
    region_bytes, geonames = read_pinned(REGION_QUEUE_RELATIVE)
    scope_bytes, scope = read_pinned(SCOPE_RELATIVE)
    province_id_by_name = {row["name"]: row["id"] for row in scope["administrativeScope"]["provinces"]}
    if len(geonames) != 811 or len(scope["waterbodies"]) != 158:
        raise ValueError("Pinned source counts changed; inspect the region and scope before rerunning")

    aliases: dict[str, dict[str, tuple[dict[str, Any], set[str]]]] = {}
    for waterbody in scope["waterbodies"]:
        for name in [waterbody.get("name"), *waterbody.get("aliases", [])]:
            key = normalize(name)
            if not key:
                continue
            if waterbody["id"] not in aliases.setdefault(key, {}):
                aliases[key][waterbody["id"]] = (waterbody, set())
            aliases[key][waterbody["id"]][1].add(name)

    stream_candidates = [row for row in geonames if row.get("sourceFeatureGroup") == "stream_channel_or_waterfall"]
    feature_codes = Counter(row["featureCode"] for row in stream_candidates)
    matched_rows = []
    pair_context_counts = Counter()
    matched_scope_ids: set[str] = set()
    matched_candidate_ids: set[int] = set()
    unique_pair_count = 0
    candidate_rows_with_conflict: set[int] = set()
    candidate_rows_with_overlap: set[int] = set()
    ambiguous_candidate_rows = 0

    for candidate in sorted(stream_candidates, key=lambda row: row["geonameId"]):
        key = normalize(candidate["name"])
        matches = aliases.get(key, {})
        if not matches:
            continue
        candidate_matches = []
        for waterbody_id in sorted(matches):
            waterbody, matched_names = matches[waterbody_id]
            context_status = province_context_status(candidate["singlePolygonPointContext"], province_id_by_name, waterbody)
            pair_context_counts[context_status] += 1
            if context_status == "province-context-overlap":
                candidate_rows_with_overlap.add(int(candidate["geonameId"]))
            elif context_status == "province-context-conflict":
                candidate_rows_with_conflict.add(int(candidate["geonameId"]))
            candidate_matches.append(
                {
                    "waterbodyId": waterbody_id,
                    "canonicalScopeName": waterbody["name"],
                    "matchedScopeNameForms": sorted(matched_names),
                    "kind": waterbody.get("kind"),
                    "identityStatus": waterbody.get("identityStatus"),
                    "boundaryStatus": waterbody.get("boundaryStatus"),
                    "administrativeProvinceIds": sorted(
                        {
                            association["provinceId"]
                            for association in waterbody.get("administrativeAssociations", [])
                            if association.get("provinceId")
                        }
                    ),
                    "provinceContextComparison": context_status,
                    "sourceRefs": sorted(set(waterbody.get("sourceRefs", []))),
                    "identityValidatedByThisCrosswalk": False,
                }
            )
            matched_scope_ids.add(waterbody_id)
            unique_pair_count += 1

        matched_candidate_ids.add(int(candidate["geonameId"]))
        if len(candidate_matches) > 1:
            ambiguous_candidate_rows += 1
        matched_rows.append(
            {
                "geonameId": int(candidate["geonameId"]),
                "name": candidate["name"],
                "featureCode": candidate["featureCode"],
                "sourceFeatureCodeLabel": candidate["sourceFeatureCodeLabel"],
                "candidateProvincePolygonPointContext": candidate["singlePolygonPointContext"],
                "pointWgs84": {"longitude": candidate["longitudeWgs84"], "latitude": candidate["latitudeWgs84"]},
                "normalizedComparisonKey": key,
                "sourceFeatureGroup": candidate["sourceFeatureGroup"],
                "matches": candidate_matches,
                "reviewStatus": "exact-normalized-name-lead;province-is-context-only;identity-not-validated",
            }
        )

    queue_bytes = "".join(
        json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in matched_rows
    ).encode("utf-8")
    refresh = "--refresh" in sys.argv[1:]
    write_output(ROOT / QUEUE_RELATIVE, queue_bytes, refresh=refresh)
    if subprocess.run(["git", "check-ignore", "--quiet", QUEUE_RELATIVE.as_posix()], cwd=ROOT, check=False).returncode != 0:
        (ROOT / QUEUE_RELATIVE).unlink(missing_ok=True)
        raise RuntimeError("Stream crosswalk rows are not Git-ignored; removed the output to prevent accidental publication")

    report = {
        "schemaVersion": 1,
        "reviewId": f"geonames-calabarzon-stream-scope-crosswalk-{RUN_DATE_COMPACT}",
        "generatedOn": RUN_DATE,
        "status": "exact-normalized-name-candidate-crosswalk-built;scope-lead-and-point-context-only;identity-review-pending",
        "scope": {
            "regionId": scope["regionId"],
            "candidateRows": "GeoNames CALABARZON stream_channel_or_waterfall source-code group",
            "scopeRows": "current CALABARZON research-scope waterbody leads and aliases",
            "matchingRule": "case-folded Unicode normalization, diacritics removed, punctuation collapsed, generic English hydrography terms removed; no fuzzy spelling matching",
            "administrativeRule": "compares GeoNames point-in-polygon province label to province IDs already attached to a scope lead; context comparison only, never assignment",
            "sourceLimit": "the scope is a selected research-lead list, not an exhaustive river catalogue; matching against it does not replace source-level identity review",
        },
        "provenance": {
            REGION_QUEUE_RELATIVE.as_posix(): {"sha256": sha256_bytes(region_bytes), "bytes": len(region_bytes)},
            SCOPE_RELATIVE.as_posix(): {"sha256": sha256_bytes(scope_bytes), "bytes": len(scope_bytes)},
        },
        "results": {
            "geonamesStreamGroupRows": len(stream_candidates),
            "calabarzonScopeWaterbodyRows": len(scope["waterbodies"]),
            "geonamesRowsWithExactNormalizedNameLead": len(matched_candidate_ids),
            "uniqueWaterbodyScopeLeadsMatched": len(matched_scope_ids),
            "candidateToScopeLeadPairs": unique_pair_count,
            "candidateRowsWithMultipleDistinctScopeLeadMatches": ambiguous_candidate_rows,
            "candidateScopePairsByProvinceContext": dict(sorted(pair_context_counts.items())),
            "candidateRowsWithAtLeastOneProvinceContextOverlap": len(candidate_rows_with_overlap),
            "candidateRowsWithAtLeastOneProvinceContextConflict": len(candidate_rows_with_conflict),
            "candidateRowsWithBothOverlapAndConflict": len(candidate_rows_with_overlap & candidate_rows_with_conflict),
            "candidateRowsByFeatureCode": dict(sorted(feature_codes.items())),
            "waterbodyIdentitiesValidated": 0,
            "regionAssignmentsAdded": 0,
            "speciesAssertionsAdded": 0,
            "publicGeometryAdded": False,
            "publicationApproval": False,
        },
        "localReviewQueue": {
            "path": QUEUE_RELATIVE.as_posix(),
            "rows": len(matched_rows),
            "candidateToScopeLeadPairs": unique_pair_count,
            "bytes": len(queue_bytes),
            "sha256": sha256_bytes(queue_bytes),
            "gitIgnored": True,
            "appBundleIncluded": False,
            "containsExactCoordinates": True,
            "containsCandidateAndScopeNames": True,
            "containsSourceReferences": True,
        },
        "privacy": {
            "exactCoordinatesInTrackedReport": False,
            "candidateNamesInTrackedReport": False,
            "perRecordIdsInTrackedReport": False,
        },
        "limitations": [
            "GeoNames stream/channel/waterfall feature codes and name points are discovery candidates, not river lines or exact reaches.",
            "The CALABARZON scope contains selected named research leads, not a complete waterbody inventory; unmatched names do not prove absence.",
            "Removing generic watercourse words can surface homonyms and spelling variants; normalized-name equality is not evidence that two records describe the same site.",
            "Province context derives from a coarse point-in-land-polygon screen and source-described scope associations; agreement or conflict does not verify geography or source identity.",
            "No candidate was merged into the scope, no region assignment or geometry was added, and no fish presence or habitat claim was created.",
        ],
        "nextAction": "Review the local queue against the linked source references. Resolve the province-context conflicts and homonym collisions first; require a named primary map, study locality or independently reusable route source before linking a candidate to a scope waterbody.",
    }
    report_bytes = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    write_output(ROOT / REPORT_RELATIVE, report_bytes, refresh=refresh)
    print(f"CALABARZON GeoNames stream/channel/waterfall candidates: {len(stream_candidates)}")
    print(f"Exact normalized-name candidates: {len(matched_candidate_ids)} rows; {len(matched_scope_ids)} scope leads; {unique_pair_count} pairs")
    print(f"Province context overlap/conflict pairs: {pair_context_counts['province-context-overlap']}/{pair_context_counts['province-context-conflict']}; identity validations: 0")
    print(f"Local-only review queue: {QUEUE_RELATIVE}")
    print(f"Aggregate report: {REPORT_RELATIVE}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
