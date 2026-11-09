#!/usr/bin/env python3
"""Screen DOST ludong-site name strings against Region II GeoNames candidates."""

from __future__ import annotations

import hashlib
import json
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
SOURCE_REVIEW = Path("data/research/philippines/national-freshwater-region02-dost-isabela-ludong-river-site-leads-20261109.json")
GEONAMES = Path("data/research/philippines/raw/national/geonames-region02-hydrographic-candidates-20261109.jsonl")
RAW_OUTPUT = Path("data/research/philippines/raw/national/geonames-region02-dost-ludong-site-crosswalk-20261109.jsonl")
RUN_DATE = datetime.now(timezone.utc).date().isoformat()
RUN_DATE_COMPACT = RUN_DATE.replace("-", "")
REPORT = Path(f"data/research/philippines/national/reviews/geonames-region02-dost-ludong-site-crosswalk-{RUN_DATE_COMPACT}.json")
GENERIC_WATER_TERMS = {"river", "rivers", "creek", "creeks", "stream", "streams", "brook", "brooks", "tributary", "tributaries", "rio"}


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
            row = json.loads(line)
            if not isinstance(row, dict):
                raise ValueError(f"Expected JSON object at {path}:{line_number}")
            rows.append(row)
    return rows


def candidate_labels(row: dict[str, Any]) -> list[str]:
    values = [str(row.get("name") or ""), str(row.get("asciiName") or "")]
    values.extend((row.get("alternateNames") or "").split(","))
    return list(dict.fromkeys(value.strip() for value in values if value.strip()))


def counts(values: list[str]) -> dict[str, int]:
    result: dict[str, int] = {}
    for value in values:
        result[value] = result.get(value, 0) + 1
    return dict(sorted(result.items()))


def main() -> int:
    source_path = ROOT / SOURCE_REVIEW
    source = json.loads(source_path.read_text(encoding="utf-8"))
    features = read_jsonl(ROOT / GEONAMES)
    leads: list[dict[str, str]] = []
    for municipality in source["verbatimMunicipalityLeads"]:
        for label in municipality["sourcePlaceLabelsForDiscovery"]:
            leads.append({
                "sourceMunicipalityLabel": municipality["sourceMunicipalityLabel"],
                "sourceLocationText": municipality["sourceLocationText"],
                "sourcePlaceLabel": label,
            })

    lead_results: list[dict[str, Any]] = []
    raw_rows: list[dict[str, Any]] = []
    for lead in leads:
        target = base_name(lead["sourcePlaceLabel"])
        found: list[dict[str, Any]] = []
        for feature in features:
            matches = [label for label in candidate_labels(feature) if base_name(label) == target]
            if not matches:
                continue
            relation = "primary-label-normalized-name-match" if base_name(str(feature.get("name") or "")) == target else "alternate-label-normalized-name-match"
            found.append({"feature": feature, "labels": matches, "relation": relation})
        lead_results.append({
            **lead,
            "candidateRows": len(found),
            "status": "normalized-name-candidates-found" if found else "no-normalized-name-candidate-in-this-snapshot",
            "featureCodeCounts": counts([str(item["feature"].get("featureCode") or "UNKNOWN") for item in found]),
            "provinceContextCounts": counts([str(item["feature"].get("overlayProvinceNameCandidate") or "Unassigned") for item in found]),
            "candidateNameSummary": [
                {
                    "candidateName": item["feature"].get("name"),
                    "matchedLabels": item["labels"],
                    "relationship": item["relation"],
                    "featureCode": item["feature"].get("featureCode"),
                    "provinceContext": item["feature"].get("overlayProvinceNameCandidate"),
                }
                for item in found
            ],
        })
        for item in found:
            feature = item["feature"]
            raw_rows.append({
                **lead,
                "relationship": item["relation"],
                "matchedLabels": item["labels"],
                "candidateName": feature.get("name"),
                "candidateFeatureCode": feature.get("featureCode"),
                "candidateProvinceContext": feature.get("overlayProvinceNameCandidate"),
                "geonameId": feature.get("geonameId"),
                "sourceModifiedDate": feature.get("sourceModifiedDate"),
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

    unique_ids = {row["geonameId"] for row in raw_rows}
    report = {
        "schemaVersion": 1,
        "reviewId": f"geonames-region02-dost-ludong-site-crosswalk-{RUN_DATE_COMPACT}",
        "generatedOn": RUN_DATE,
        "status": "dost-site-labels-screened-against-region02-geonames;candidate-only;no-place-or-species-validation",
        "purpose": "Name-screen the DOST publication's reported possible ludong fishing-ground place strings against the existing Region II GeoNames hydrographic-point queue.",
        "sourceSnapshots": {
            "dostSiteLeadReview": {"path": SOURCE_REVIEW.as_posix(), "sha256": sha256(source_path)},
            "geoNamesRegion02Candidates": {"path": GEONAMES.as_posix(), "sha256": sha256(ROOT / GEONAMES)},
        },
        "searchMethod": {
            "sourceMunicipalityRows": len(source["verbatimMunicipalityLeads"]),
            "sourcePlaceStringsIncludingLocalityQualifiers": len(leads),
            "candidateFeatureRowsSearched": len(features),
            "matchRule": "Case/diacritic/punctuation-normalized whole-name equality across GeoNames primary and alternate labels, after removing generic hydrographic terms.",
            "relationshipRule": "Primary-name matches and alternate-name matches are kept separate. Source municipality and place strings are preserved but do not establish that a candidate belongs to that municipality or is a waterbody.",
            "provinceContext": "GeoNames point-overlay province is retained for triage only; no municipality conflict is inferred from a source string without exact source station geometry.",
        },
        "summary": {
            "placeStringsWithNameCandidates": sum(result["candidateRows"] > 0 for result in lead_results),
            "normalizedNameCandidateRows": len(raw_rows),
            "uniqueGeoNamesIds": len(unique_ids),
            "waterbodyIdentitiesValidated": 0,
            "speciesAssertions": 0,
            "publicGeometryAdded": False,
            "publicationApproval": False,
        },
        "leadResults": lead_results,
        "localOutput": {
            "path": RAW_OUTPUT.as_posix(),
            "rows": len(raw_rows),
            "sha256": sha256(raw_path),
            "gitIgnored": True,
            "appBundleIncluded": False,
        },
        "limitations": [
            "The DOST source provides a program-level statement about possible fishing grounds, not site-level sampling, methods, vouchers, exact stations, or species-by-place records.",
            "GeoNames points are gazetteer candidates and do not define river courses, verify source locations, or validate the DOST municipality pairing.",
            "Names such as Eden, Reina Mercedes, Cabisera 10, Didiuan and Ilaya may be locality/context labels rather than waterbody names; the screen does not classify them as waterbodies.",
            "The Maconacon/Reina Mercedes and Palanan/Pinacanauan/Didiuan/Ilaya source strings remain unresolved regardless of name candidates.",
            "A missing candidate is not evidence that a place, fishery, or species is absent. No species presence, geometry, access, legal, or safety assertion is made.",
        ],
    }
    report_path = ROOT / REPORT
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Screened {len(leads)} DOST source place strings against {len(features)} GeoNames candidate points")
    print(f"Name candidates: {report['summary']['placeStringsWithNameCandidates']} labels, {len(raw_rows)} candidate rows, {len(unique_ids)} unique IDs")
    print(f"Wrote {REPORT.as_posix()}")
    print(f"Detailed rows remain in ignored {RAW_OUTPUT.as_posix()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
