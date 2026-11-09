#!/usr/bin/env python3
"""Screen Region II major-river names against the local GeoNames point queue."""

from __future__ import annotations

import hashlib
import json
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
INVENTORY = Path("data/research/philippines/national-freshwater-region02-inland-water-source-inventory-20261106.json")
GEONAMES = Path("data/research/philippines/raw/national/geonames-region02-hydrographic-candidates-20261109.jsonl")
RAW_OUTPUT = Path("data/research/philippines/raw/national/geonames-region02-major-river-name-crosswalk-20261109.jsonl")
RUN_DATE = datetime.now(timezone.utc).date().isoformat()
RUN_DATE_COMPACT = RUN_DATE.replace("-", "")
REPORT = Path(f"data/research/philippines/national/reviews/geonames-region02-major-river-name-crosswalk-{RUN_DATE_COMPACT}.json")

GENERIC_WATER_TERMS = {
    "river", "rivers", "creek", "creeks", "stream", "streams", "brook", "brooks",
    "tributary", "tributaries", "rio",
}
MAJOR_RIVERS = [
    "Cagayan River",
    "Addalam",
    "Magat",
    "Ilagan",
    "Siffu-Mallig",
    "Dummun",
    "Pared",
    "Pinacanauan",
    "Chico",
]
COMPOSITE_COMPONENTS = {"Siffu-Mallig": ["Siffu", "Mallig"]}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalize(value: str | None) -> str:
    if not value:
        return ""
    folded = unicodedata.normalize("NFKD", value.casefold())
    plain = "".join(char for char in folded if not unicodedata.combining(char))
    return " ".join(re.findall(r"[a-z0-9]+", plain))


def base_name(value: str | None) -> str:
    return " ".join(token for token in normalize(value).split() if token not in GENERIC_WATER_TERMS)


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as stream:
        for line_number, line in enumerate(stream, start=1):
            if not line.strip():
                continue
            value = json.loads(line)
            if not isinstance(value, dict):
                raise ValueError(f"Expected JSON object at {path}:{line_number}")
            rows.append(value)
    return rows


def labels(row: dict[str, Any]) -> list[str]:
    result = [str(row.get("name") or ""), str(row.get("asciiName") or "")]
    result.extend((row.get("alternateNames") or "").split(","))
    return list(dict.fromkeys(label.strip() for label in result if label.strip()))


def match_rows(lead: str, features: list[dict[str, Any]]) -> list[dict[str, Any]]:
    target = base_name(lead)
    matches: list[dict[str, Any]] = []
    for row in features:
        matched_labels = [label for label in labels(row) if base_name(label) == target]
        if not matched_labels:
            continue
        primary = normalize(str(row.get("name") or ""))
        relation = "primary-label-normalized-name-match" if primary and base_name(str(row.get("name"))) == target else "alternate-label-normalized-name-match"
        matches.append({**row, "matchedLabels": matched_labels, "nameMatchRelation": relation})
    return matches


def candidate_summary(matches: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "candidateRows": len(matches),
        "primaryLabelMatches": sum(row["nameMatchRelation"] == "primary-label-normalized-name-match" for row in matches),
        "alternateLabelMatches": sum(row["nameMatchRelation"] == "alternate-label-normalized-name-match" for row in matches),
        "featureCodeCounts": dict(sorted(_counts(str(row.get("featureCode") or "UNKNOWN") for row in matches).items())),
        "provinceContextCounts": dict(sorted(_counts(str(row.get("overlayProvinceNameCandidate") or "Unassigned") for row in matches).items())),
    }


def _counts(values: Any) -> dict[str, int]:
    result: dict[str, int] = {}
    for value in values:
        result[value] = result.get(value, 0) + 1
    return result


def main() -> int:
    inventory_path = ROOT / INVENTORY
    inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
    source_finding = inventory["regionalSourceSummary"]["cagayanRiverinePlan"]["finding"]
    if not all(name.casefold() in source_finding.casefold() for name in ["Addalam", "Magat", "Ilagan", "Siffu-Mallig", "Dummun", "Pared", "Pinacanauan", "Chico"]):
        raise ValueError("The local inventory no longer contains the expected major tributary names.")

    features = read_jsonl(ROOT / GEONAMES)
    matched_by_lead = {lead: match_rows(lead, features) for lead in MAJOR_RIVERS}
    raw_rows: list[dict[str, Any]] = []

    for lead, matches in matched_by_lead.items():
        for row in matches:
            raw_rows.append({
                "sourceLead": lead,
                "relationship": row["nameMatchRelation"],
                "matchedLabels": row["matchedLabels"],
                "candidateName": row.get("name"),
                "candidateFeatureCode": row.get("featureCode"),
                "candidateProvinceContext": row.get("overlayProvinceNameCandidate"),
                "geonameId": row.get("geonameId"),
                "sourceModifiedDate": row.get("sourceModifiedDate"),
                "candidateOnly": True,
                "waterbodyIdentityReviewed": False,
                "speciesEvidence": False,
                "publicAppAdmission": False,
            })

    component_summaries: dict[str, Any] = {}
    for composite, components in COMPOSITE_COMPONENTS.items():
        component_rows: list[dict[str, Any]] = []
        for component in components:
            for row in match_rows(component, features):
                component_rows.append(row)
                raw_rows.append({
                    "sourceLead": composite,
                    "relationship": "composite-component-name-lead-only",
                    "componentName": component,
                    "matchedLabels": row["matchedLabels"],
                    "candidateName": row.get("name"),
                    "candidateFeatureCode": row.get("featureCode"),
                    "candidateProvinceContext": row.get("overlayProvinceNameCandidate"),
                    "geonameId": row.get("geonameId"),
                    "sourceModifiedDate": row.get("sourceModifiedDate"),
                    "candidateOnly": True,
                    "waterbodyIdentityReviewed": False,
                    "speciesEvidence": False,
                    "publicAppAdmission": False,
                })
        component_summaries[composite] = {
            "compositeNameMatch": False,
            "components": components,
            "componentCandidateRows": len(component_rows),
            "interpretation": "Component labels are separate discovery leads; this does not resolve whether the source composite denotes one river system or linked rivers.",
        }

    # Preserve specific Pinacanauan branches as weaker related-name candidates, separate from exact base-name matches.
    pinacanauan_base = base_name("Pinacanauan")
    related_pinacanauan = [
        row for row in features
        if base_name(str(row.get("name") or "")).startswith(pinacanauan_base + " ")
    ]
    for row in related_pinacanauan:
        raw_rows.append({
            "sourceLead": "Pinacanauan",
            "relationship": "related-compound-name-lead-only",
            "matchedLabels": [str(row.get("name") or "")],
            "candidateName": row.get("name"),
            "candidateFeatureCode": row.get("featureCode"),
            "candidateProvinceContext": row.get("overlayProvinceNameCandidate"),
            "geonameId": row.get("geonameId"),
            "sourceModifiedDate": row.get("sourceModifiedDate"),
            "candidateOnly": True,
            "waterbodyIdentityReviewed": False,
            "speciesEvidence": False,
            "publicAppAdmission": False,
        })

    raw_path = ROOT / RAW_OUTPUT
    raw_path.parent.mkdir(parents=True, exist_ok=True)
    with raw_path.open("w", encoding="utf-8", newline="\n") as stream:
        for row in raw_rows:
            stream.write(json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n")

    lead_summaries = {
        lead: {
            **candidate_summary(matches),
            "status": "normalized-name-candidates-found" if matches else "no-normalized-name-candidate-in-this-snapshot",
        }
        for lead, matches in matched_by_lead.items()
    }
    strict_ids = {row.get("geonameId") for matches in matched_by_lead.values() for row in matches}
    report = {
        "schemaVersion": 1,
        "reviewId": f"geonames-region02-major-river-name-crosswalk-{RUN_DATE_COMPACT}",
        "generatedOn": RUN_DATE,
        "status": "region02-major-river-name-crosswalk-screened;candidate-only;no-identity-or-species-assertions",
        "purpose": "Screen the Cagayan Riverine Zone plan's main river and named major tributaries against the already extracted Region II GeoNames hydrography point queue.",
        "sourceSnapshots": {
            "regionalInventory": {"path": INVENTORY.as_posix(), "sha256": sha256(inventory_path)},
            "geoNamesRegion02Candidates": {"path": GEONAMES.as_posix(), "sha256": sha256(ROOT / GEONAMES)},
        },
        "searchMethod": {
            "planRiverLeadCount": len(MAJOR_RIVERS),
            "nameRule": "Case/diacritic/punctuation-normalized whole-label equality after removing generic river/creek/stream terms; primary and alternate labels are distinguished.",
            "componentRule": "The source composite Siffu-Mallig is also screened as two separate component names; component hits are not counted as a match to the composite name.",
            "specificBranchRule": "Names beginning with Pinacanauan plus another specific locality term are reported as related-name candidates, not exact matches.",
            "candidateRowsSearched": len(features),
            "provinceContext": "Retained as a source point-overlay label for triage; no expected-province conflict is inferred because the planning text does not assign a province to each river lead.",
        },
        "summary": {
            "leadsWithNormalizedNameCandidates": sum(bool(matches) for matches in matched_by_lead.values()),
            "normalizedNameLeadCandidateRows": sum(len(matches) for matches in matched_by_lead.values()),
            "uniqueNormalizedNameGeonameIds": len(strict_ids),
            "compositeLeadsWithDirectNameMatch": 0,
            "compositeComponentCandidateRows": sum(row["componentCandidateRows"] for row in component_summaries.values()),
            "relatedSpecificPinacanauanCandidateRows": len(related_pinacanauan),
            "waterbodyIdentitiesValidated": 0,
            "speciesAssertions": 0,
            "publicGeometryAdded": False,
            "publicationApproval": False,
        },
        "leadResults": lead_summaries,
        "compositeNameResults": component_summaries,
        "relatedNameResults": {
            "Pinacanauan": {
                "exactBaseNameCandidateRows": len(matched_by_lead["Pinacanauan"]),
                "specificCompoundCandidateRows": len(related_pinacanauan),
                "interpretation": "Specific locality-qualified labels are kept separate; point gazetteer names do not establish whether they are branches, reaches, or distinct rivers.",
            }
        },
        "localOutput": {
            "path": RAW_OUTPUT.as_posix(),
            "rows": len(raw_rows),
            "sha256": sha256(raw_path),
            "gitIgnored": True,
            "appBundleIncluded": False,
        },
        "limitations": [
            "The planning source is a 2005-2030 regional framework, not a current hydrographic inventory or fish survey.",
            "GeoNames feature-H points and labels are heterogeneous gazetteer candidates, not river centerlines, basin boundaries, verified tributary topology, or current waterbody conditions.",
            "A normalized name or alternate label may refer to a settlement, reach, branch, historical name, or ambiguous feature; no identity or hydrologic connection is confirmed.",
            "No per-river expected province was established from the plan, so overlay province labels are context only and are not conflict findings.",
            "A missing candidate is not evidence that a river is absent; the candidate list excludes unresolved points outside one land-province polygon and has uneven source coverage.",
            "No fish occurrence, habitat, access, salinity, legal, safety, or public-app claim is made.",
        ],
    }
    report_path = ROOT / REPORT
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Screened {len(MAJOR_RIVERS)} river leads against {len(features)} Region II GeoNames points")
    print(f"Name candidates: {lead_summaries}")
    print(f"Wrote {REPORT.as_posix()}")
    print(f"Detailed candidate rows remain in ignored {RAW_OUTPUT.as_posix()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
