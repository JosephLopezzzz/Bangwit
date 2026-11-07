#!/usr/bin/env python3
"""Build a local-only CALABARZON GeoNames hydrographic review queue."""

from __future__ import annotations

import hashlib
import json
import math
import os
import subprocess
import sys
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
SNAPSHOT = "20261107"
CONFIG_RELATIVE = Path("data/research/philippines/national/acquisition-config.json")
MANIFEST_RELATIVE = Path("data/research/philippines/national/batch-manifest.json")
OVERLAY_RELATIVE = Path(
    f"data/research/philippines/national/reviews/geonames-ph-hydrography-geoboundaries-overlay-{SNAPSHOT}.json"
)
OVERLAY_QUEUE_RELATIVE = Path(f"data/research/philippines/raw/national/geonames-ph-{SNAPSHOT}/point-admin-overlay-review.jsonl")
OUTPUT_QUEUE_RELATIVE = Path(f"data/research/philippines/raw/national/geonames-ph-{SNAPSHOT}/calabarzon-hydrographic-candidates.jsonl")
REPORT_RELATIVE = Path(f"data/research/philippines/national/reviews/geonames-calabarzon-hydrographic-candidates-{SNAPSHOT}.json")
EXPECTED_OVERLAY_QUEUE_SHA256 = "d413a93dbbb68e860ffa76f9874a327d5580b4c93c08843f5cfb010f760b396d"

# These groupings describe GeoNames feature codes only; they do not assign salinity or habitat.
FEATURE_GROUPS = {
    "stream_channel_or_waterfall": {"STM", "STMI", "STMC", "STMD", "STMX", "WTRC", "RVN", "FLLS"},
    "lake_reservoir_or_pool": {"LK", "LKS", "RSV", "POOL"},
    "hot_spring": {"SPNT"},
    "artificial_canal": {"CNL"},
    "other_hydrographic_context": {"AIRS", "ANCH", "BAY"},
}
FEATURE_CODE_DEFINITIONS = {
    "AIRS": "seaplane landing area",
    "ANCH": "anchorage",
    "BAY": "bay",
    "CNL": "canal (artificial watercourse)",
    "FLLS": "waterfall(s)",
    "LK": "lake",
    "LKS": "lakes",
    "POOL": "pool(s)",
    "RSV": "reservoir(s)",
    "RVN": "ravine(s), including a small stream channel",
    "SPNT": "hot spring(s)",
    "STM": "stream",
    "STMC": "canalized stream",
    "STMD": "distributary(-ies)",
    "STMI": "intermittent stream",
    "STMX": "section of stream",
    "WTRC": "watercourse",
}
FEATURE_CODES_URL = "https://www.geonames.org/export/codes.html"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def write_immutable(path: Path, content: bytes) -> None:
    if path.exists():
        if path.read_bytes() == content:
            return
        raise FileExistsError(f"Refusing to overwrite a different regional review output: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    with temporary.open("wb") as output:
        output.write(content)
        output.flush()
        os.fsync(output.fileno())
    temporary.replace(path)


def group_for_code(feature_code: str) -> str:
    matching = [group for group, codes in FEATURE_GROUPS.items() if feature_code in codes]
    if len(matching) != 1:
        raise ValueError(f"GeoNames feature code {feature_code!r} needs a reviewed source-code grouping")
    return matching[0]


def main() -> int:
    config = json.loads((ROOT / CONFIG_RELATIVE).read_text(encoding="utf-8"))
    manifest = json.loads((ROOT / MANIFEST_RELATIVE).read_text(encoding="utf-8"))
    overlay = json.loads((ROOT / OVERLAY_RELATIVE).read_text(encoding="utf-8"))
    overlay_queue_path = ROOT / OVERLAY_QUEUE_RELATIVE
    if not overlay_queue_path.is_file():
        raise FileNotFoundError(f"Missing local overlay queue: {OVERLAY_QUEUE_RELATIVE}")
    overlay_queue_bytes = overlay_queue_path.read_bytes()
    if sha256_bytes(overlay_queue_bytes) != EXPECTED_OVERLAY_QUEUE_SHA256:
        raise ValueError("GeoNames overlay queue differs from the pinned row-level review input")
    if overlay["localReviewQueue"]["sha256"] != EXPECTED_OVERLAY_QUEUE_SHA256:
        raise ValueError("Overlay receipt does not attest the pinned row-level queue")

    region = config.get("regionalTriage", {})
    region_id = region.get("regionId")
    provinces = set(region.get("provinceTextLabels", []))
    if region_id != manifest["scope"]["firstIntegratedRegion"] or not provinces:
        raise ValueError("Acquisition configuration and national batch do not agree on the first integrated region")

    counts_by_province: dict[str, Counter[str]] = defaultdict(Counter)
    counts_by_group: Counter[str] = Counter()
    counts_by_code: Counter[str] = Counter()
    distinct_names: set[str] = set()
    local_rows = []
    overlay_rows = 0
    selected_rows = 0
    for line_number, line in enumerate(overlay_queue_bytes.decode("utf-8").splitlines(), start=1):
        row = json.loads(line)
        overlay_rows += 1
        candidate_province = row.get("singlePolygonNameCandidate")
        if candidate_province not in provinces:
            continue
        code = row["featureCode"]
        group = group_for_code(code)
        if code not in FEATURE_CODE_DEFINITIONS:
            raise ValueError(f"Missing official source-code description for {code!r} at line {line_number}")
        candidate = {
            "geonameId": row["geonameId"],
            "name": row["name"],
            "asciiName": row["asciiName"],
            "alternateNames": row.get("alternateNames"),
            "featureClass": "H",
            "featureCode": code,
            "sourceFeatureCodeLabel": FEATURE_CODE_DEFINITIONS[code],
            "sourceFeatureGroup": group,
            "sourceAdmin1Code": row["sourceAdmin1Code"],
            "sourceAdmin2Code": row["sourceAdmin2Code"],
            "longitudeWgs84": row["longitudeWgs84"],
            "latitudeWgs84": row["latitudeWgs84"],
            "singlePolygonPointContext": candidate_province,
            "reviewScope": region_id,
            "regionAssignment": None,
            "waterbodyIdentityReviewed": False,
            "speciesEvidence": False,
        }
        longitude = float(candidate["longitudeWgs84"])
        latitude = float(candidate["latitudeWgs84"])
        if not (math.isfinite(longitude) and math.isfinite(latitude)):
            raise ValueError(f"Invalid candidate coordinates at line {line_number}")
        local_rows.append(candidate)
        counts_by_province[candidate_province][code] += 1
        counts_by_group[group] += 1
        counts_by_code[code] += 1
        if candidate["name"]:
            distinct_names.add(unicodedata.normalize("NFKC", candidate["name"]).strip().casefold())
        selected_rows += 1

    if overlay_rows != overlay["results"]["inputRows"]:
        raise ValueError("Overlay row count does not match its pinned receipt")
    if selected_rows == 0:
        raise ValueError("No GeoNames candidates matched the first region's coarse province screen")
    if set(counts_by_code) != set(FEATURE_CODE_DEFINITIONS):
        raise ValueError("The regional candidate set and documented GeoNames codes differ")

    local_bytes = "".join(
        json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n"
        for row in sorted(local_rows, key=lambda item: (item["singlePolygonPointContext"], item["featureCode"], item["geonameId"]))
    ).encode("utf-8")
    write_immutable(ROOT / OUTPUT_QUEUE_RELATIVE, local_bytes)
    ignored = subprocess.run(
        ["git", "check-ignore", "--quiet", OUTPUT_QUEUE_RELATIVE.as_posix()],
        cwd=ROOT,
        check=False,
    )
    if ignored.returncode != 0:
        (ROOT / OUTPUT_QUEUE_RELATIVE).unlink(missing_ok=True)
        raise RuntimeError("CALABARZON candidate queue is not Git-ignored; removed it to prevent accidental publication")

    report = {
        "schemaVersion": 1,
        "reviewId": f"geonames-{region_id.lower()}-hydrographic-candidates-{SNAPSHOT}",
        "generatedOn": "2026-11-07",
        "status": "regional-discovery-queue-built;source-code-groupings-only;waterbody-and-species-review-pending",
        "scope": {
            "regionReviewScope": region_id,
            "provincePolygonNames": sorted(provinces),
            "selectionRule": "only records whose GeoNames point fell inside exactly one pinned simplified province polygon named in the first-region manifest",
            "overlayReview": str(OVERLAY_RELATIVE).replace("\\", "/"),
            "overlayQueueSha256": EXPECTED_OVERLAY_QUEUE_SHA256,
            "allPhilippinesOverlayRows": overlay_rows,
        },
        "source": {
            "provider": "GeoNames Gazetteer Philippines country extract",
            "featureClass": "H",
            "featureCodeDefinitions": FEATURE_CODES_URL,
            "license": "CC BY 4.0",
            "attribution": "GeoNames Gazetteer (https://www.geonames.org/), country extract PH, downloaded 2026-11-07; CC BY 4.0.",
        },
        "featureCodeGroups": {
            group: {
                "codes": sorted(codes),
                "rows": counts_by_group[group],
                "meaning": "GeoNames source-feature labels grouped for review; not habitat, salinity, species, or access conclusions",
            }
            for group, codes in FEATURE_GROUPS.items()
        },
        "results": {
            "candidateRows": selected_rows,
            "distinctNormalizedNameStrings": len(distinct_names),
            "candidateRowsByProvincePolygonContext": {
                province: sum(counts.values()) for province, counts in sorted(counts_by_province.items())
            },
            "candidateRowsByProvinceAndFeatureCode": {
                province: dict(sorted(counts.items())) for province, counts in sorted(counts_by_province.items())
            },
            "candidateRowsByFeatureCode": dict(sorted(counts_by_code.items())),
            "regionAssignmentsAdded": 0,
            "waterbodyIdentitiesValidated": 0,
            "speciesAssertionsAdded": 0,
            "publicGeometryAdded": False,
        },
        "localReviewQueue": {
            "path": str(OUTPUT_QUEUE_RELATIVE).replace("\\", "/"),
            "rows": len(local_rows),
            "bytes": len(local_bytes),
            "sha256": sha256_bytes(local_bytes),
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
            "A GeoNames feature point inside a province polygon is coarse point context, not a verified waterbody-to-province or region assignment.",
            "GeoNames source-feature codes and these groupings do not establish freshwater/brackish/marine salinity, waterbody identity, ecology, fishing access, or present condition.",
            "Some rows represent stream sections, falls, channels, or artificial watercourses rather than distinct waterbodies; repeated names and features are not deduplicated into unique sites.",
            "The 2020 simplified land polygons may be outdated and do not describe coastal or municipal-water boundaries.",
            "This queue has no fish observations. No species records or public map geometry were created.",
            "Exact candidate names, IDs, coordinates and source administrative codes remain in Git-ignored local storage."
        ],
    }
    write_immutable(ROOT / REPORT_RELATIVE, (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
    print(f"{region_id} GeoNames point candidates: {selected_rows}; distinct normalized names: {len(distinct_names)}")
    print("GeoNames source-code groups: " + json.dumps(dict(counts_by_group), ensure_ascii=False, sort_keys=True))
    print("Candidate counts by province polygon context: " + json.dumps(report["results"]["candidateRowsByProvincePolygonContext"], ensure_ascii=False, sort_keys=True))
    print(f"Region assignments: 0; verified waterbody identities: 0; species assertions: 0")
    print(f"Local-only queue: {OUTPUT_QUEUE_RELATIVE}")
    print(f"Aggregate review: {REPORT_RELATIVE}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
