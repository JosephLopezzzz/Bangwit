#!/usr/bin/env python3
"""Build a local-only Region II GeoNames hydrographic name/point discovery queue."""

from __future__ import annotations

import hashlib
import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
GEONAMES = Path("data/research/philippines/raw/national/geonames-ph-20261107/hydrographic-candidates.jsonl")
ADMIN_OVERLAY = Path("data/research/philippines/raw/national/geonames-ph-20261107/point-admin-overlay-review.jsonl")
PROVINCES = {"Batanes", "Cagayan", "Isabela", "Quirino", "Nueva Vizcaya"}
RAW_OUTPUT = Path("data/research/philippines/raw/national/geonames-region02-hydrographic-candidates-20261109.jsonl")
RUN_DATE = datetime.now(timezone.utc).date().isoformat()
RUN_DATE_COMPACT = RUN_DATE.replace("-", "")
REPORT = Path(f"data/research/philippines/national/reviews/geonames-region02-hydrographic-candidate-extract-{RUN_DATE_COMPACT}.json")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as stream:
        for line_number, line in enumerate(stream, start=1):
            if line.strip():
                value = json.loads(line)
                if not isinstance(value, dict):
                    raise ValueError(f"Expected JSON object at {path}:{line_number}")
                rows.append(value)
    return rows


def main() -> int:
    missing = [str(path) for path in (GEONAMES, ADMIN_OVERLAY) if not (ROOT / path).is_file()]
    if missing:
        raise FileNotFoundError("Missing local inputs: " + ", ".join(missing))

    features = read_jsonl(ROOT / GEONAMES)
    overlays = read_jsonl(ROOT / ADMIN_OVERLAY)
    overlay_by_id = {str(row.get("geonameId")): row for row in overlays}
    selected: list[dict[str, Any]] = []
    province_counts: Counter[str] = Counter()
    feature_code_counts: Counter[str] = Counter()
    province_feature_code_counts: Counter[tuple[str, str]] = Counter()

    for feature in features:
        overlay = overlay_by_id.get(str(feature.get("geonameId")))
        if overlay is None:
            continue
        province = overlay.get("singlePolygonNameCandidate")
        if province not in PROVINCES or overlay.get("coarseOverlayStatus") != "inside-one-land-admin2-polygon":
            continue
        row = {
            **feature,
            "overlayProvinceNameCandidate": province,
            "overlayStatus": overlay.get("coarseOverlayStatus"),
            "candidateOnly": True,
            "waterbodyIdentityReviewed": False,
            "speciesEvidence": False,
            "publicAppAdmission": False,
        }
        selected.append(row)
        province_counts[province] += 1
        feature_code = str(feature.get("featureCode") or "UNKNOWN")
        feature_code_counts[feature_code] += 1
        province_feature_code_counts[(province, feature_code)] += 1

    selected.sort(key=lambda row: (row["overlayProvinceNameCandidate"], row.get("featureCode") or "", row.get("name") or "", int(row["geonameId"])))
    raw_path = ROOT / RAW_OUTPUT
    raw_path.parent.mkdir(parents=True, exist_ok=True)
    with raw_path.open("w", encoding="utf-8", newline="\n") as stream:
        for row in selected:
            stream.write(json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n")

    report = {
        "schemaVersion": 1,
        "reviewId": f"geonames-region02-hydrographic-candidate-extract-{RUN_DATE_COMPACT}",
        "generatedOn": RUN_DATE,
        "status": "region02-geonames-water-feature-points-extracted;candidate-only;no-waterbody-or-species-validation",
        "purpose": "Create a source-reproducible discovery queue of GeoNames hydrographic name/point records whose approximate WGS84 point falls inside one provincial polygon for a Region II province.",
        "regionScope": {
            "name": "Cagayan Valley / Region II",
            "provinces": sorted(PROVINCES),
            "selectionRule": "GeoNames feature class H candidate joined by geonameId to the existing point-to-admin overlay; overlayProvinceNameCandidate in Region II provinces and coarseOverlayStatus inside-one-land-admin2-polygon.",
        },
        "sourceSnapshots": {
            "geoNamesHydrographicCandidates": {"path": GEONAMES.as_posix(), "sha256": sha256(ROOT / GEONAMES)},
            "geoNamesAdminOverlay": {"path": ADMIN_OVERLAY.as_posix(), "sha256": sha256(ROOT / ADMIN_OVERLAY)},
        },
        "summary": {
            "philippinesGeoNamesHydrographicCandidates": len(features),
            "philippinesOverlayRows": len(overlays),
            "region02ProvincePointCandidates": len(selected),
            "namedCandidates": sum(bool(row.get("name")) for row in selected),
            "provinceCounts": dict(sorted(province_counts.items())),
            "featureCodeCounts": dict(sorted(feature_code_counts.items())),
            "provinceFeatureCodeCounts": {
                f"{province}|{feature_code}": count
                for (province, feature_code), count in sorted(province_feature_code_counts.items())
            },
            "waterbodyIdentitiesValidated": 0,
            "speciesAssertions": 0,
            "publicGeometryAdded": False,
            "publicationApproval": False,
        },
        "localOutput": {
            "path": RAW_OUTPUT.as_posix(),
            "rows": len(selected),
            "sha256": sha256(raw_path),
            "gitIgnored": True,
            "appBundleIncluded": False,
        },
        "limitations": [
            "GeoNames is a heterogeneous gazetteer of water-related feature names and points, not official river lines, lake shorelines, wetland polygons, reservoir boundaries, or fish records.",
            "The province overlay uses approximate source points and land administrative polygons; the result is a candidate attribution, not a verified hydrologic or administrative crosswalk.",
            "The selection excludes features whose points fall outside a single land-province polygon, including offshore and unresolved boundary candidates; it is not a complete Region II hydrography list.",
            "Feature-code labels and names do not independently verify channel identity, feature type, present-day condition, salinity, fish presence, access, or legal status.",
            "Batanes has only two candidate points in this snapshot. This is a source-coverage observation, not evidence that inland waters are absent.",
            "A missing feature or species is not evidence of absence. No candidate geometry or species claim is approved for app publication.",
        ],
    }
    report_path = ROOT / REPORT
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Extracted {len(selected)} Region II GeoNames hydrographic candidates")
    print("Province counts: " + json.dumps(dict(sorted(province_counts.items())), ensure_ascii=False))
    print(f"Wrote {REPORT.as_posix()}")
    print(f"Exact candidate rows remain in ignored {RAW_OUTPUT.as_posix()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
