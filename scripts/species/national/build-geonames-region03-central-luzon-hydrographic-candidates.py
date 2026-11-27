#!/usr/bin/env python3
"""Build a local-only Central Luzon GeoNames hydrographic review queue."""

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
GENERATED_ON = "2026-11-27"
REGION_ID = "0300000000"
REGION_NAME = "Region III (Central Luzon)"
PROVINCES = {
    "Aurora",
    "Bataan",
    "Bulacan",
    "Nueva Ecija",
    "Pampanga",
    "Tarlac",
    "Zambales",
}
MANIFEST_RELATIVE = Path("data/research/philippines/luzon-completion-manifest.json")
OVERLAY_RELATIVE = Path(
    f"data/research/philippines/national/reviews/geonames-ph-hydrography-geoboundaries-overlay-{SNAPSHOT}.json"
)
OVERLAY_QUEUE_RELATIVE = Path(
    f"data/research/philippines/raw/national/geonames-ph-{SNAPSHOT}/point-admin-overlay-review.jsonl"
)
OUTPUT_QUEUE_RELATIVE = Path(
    f"data/research/philippines/raw/national/geonames-ph-{SNAPSHOT}/central-luzon-hydrographic-candidates.jsonl"
)
REPORT_RELATIVE = Path(
    f"data/research/philippines/national/reviews/geonames-region03-central-luzon-hydrographic-candidates-{GENERATED_ON.replace('-', '')}.json"
)
EXPECTED_OVERLAY_QUEUE_SHA256 = "d413a93dbbb68e860ffa76f9874a327d5580b4c93c08843f5cfb010f760b396d"
FEATURE_CODES_URL = "https://www.geonames.org/export/codes.html"

# These are source-code groupings for manual triage, not habitat or ecology claims.
FEATURE_GROUPS = {
    "flowing_water_or_channel": {"CHN", "STM", "STMC", "STMD", "STMI", "STMIX", "STMX", "WTRC"},
    "lake_or_reservoir": {"LK", "RSV"},
    "wetland": {"MRSH", "SWMP"},
    "coastal_or_tidal_water_feature": {"BAY", "CHNM", "COVE", "CRKT", "LGN"},
    "water_infrastructure": {"CNLA", "SYSI"},
    "waterfall": {"FLLS"},
    "navigation_or_water_access_context": {"AIRS", "ANCH", "SHOL"},
}
FEATURE_CODE_DEFINITIONS = {
    "AIRS": "seaplane landing area",
    "ANCH": "anchorage",
    "BAY": "bay",
    "CHN": "channel",
    "CHNM": "marine channel",
    "CNLA": "aqueduct",
    "COVE": "cove(s)",
    "CRKT": "tidal creek(s)",
    "FLLS": "waterfall(s)",
    "LGN": "lagoon",
    "LK": "lake",
    "MRSH": "marsh(es)",
    "RSV": "reservoir(s)",
    "SHOL": "shoal(s)",
    "STM": "stream",
    "STMC": "canalized stream",
    "STMD": "distributary(-ies)",
    "STMI": "intermittent stream",
    "STMIX": "section of intermittent stream",
    "STMX": "section of stream",
    "SWMP": "swamp",
    "SYSI": "irrigation system",
    "WTRC": "watercourse",
}


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def write_immutable(path: Path, content: bytes) -> None:
    if path.exists():
        if path.read_bytes() == content:
            return
        raise FileExistsError(f"Refusing to overwrite a different research artifact: {path}")
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
        raise ValueError(f"GeoNames feature code {feature_code!r} needs a reviewed grouping")
    return matching[0]


def main() -> int:
    manifest = json.loads((ROOT / MANIFEST_RELATIVE).read_text(encoding="utf-8"))
    region = next(
        (item for item in manifest["regions"] if item.get("rolloutKey") == "L3"),
        None,
    )
    if (
        region is None
        or region.get("regionId") != REGION_ID
        or region.get("name") != REGION_NAME
        or set(region.get("provinces", [])) != PROVINCES
    ):
        raise ValueError("Central Luzon manifest scope differs from this pinned candidate screen")

    overlay = json.loads((ROOT / OVERLAY_RELATIVE).read_text(encoding="utf-8"))
    overlay_queue_path = ROOT / OVERLAY_QUEUE_RELATIVE
    if not overlay_queue_path.is_file():
        raise FileNotFoundError(f"Missing local overlay queue: {OVERLAY_QUEUE_RELATIVE}")
    overlay_queue_bytes = overlay_queue_path.read_bytes()
    overlay_queue_sha256 = sha256_bytes(overlay_queue_bytes)
    if overlay_queue_sha256 != EXPECTED_OVERLAY_QUEUE_SHA256:
        raise ValueError("GeoNames overlay queue differs from the pinned row-level review input")
    if overlay["localReviewQueue"]["sha256"] != EXPECTED_OVERLAY_QUEUE_SHA256:
        raise ValueError("Overlay receipt does not attest the pinned row-level queue")

    ignored = subprocess.run(
        ["git", "check-ignore", "--quiet", OUTPUT_QUEUE_RELATIVE.as_posix()],
        cwd=ROOT,
        check=False,
    )
    if ignored.returncode != 0:
        raise RuntimeError("Central Luzon candidate queue path is not Git-ignored")

    counts_by_province: dict[str, Counter[str]] = defaultdict(Counter)
    counts_by_group: Counter[str] = Counter()
    counts_by_code: Counter[str] = Counter()
    distinct_names: set[str] = set()
    local_rows = []
    overlay_rows = 0
    for line_number, line in enumerate(overlay_queue_bytes.decode("utf-8").splitlines(), start=1):
        row = json.loads(line)
        overlay_rows += 1
        province_context = row.get("singlePolygonNameCandidate")
        if province_context not in PROVINCES:
            continue
        code = row["featureCode"]
        group = group_for_code(code)
        if code not in FEATURE_CODE_DEFINITIONS:
            raise ValueError(f"Missing official feature-code label for {code!r} at line {line_number}")
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
            "singlePolygonPointContext": province_context,
            "reviewScope": "Central Luzon candidate selection only; not a region assignment",
            "regionAssignment": None,
            "waterbodyIdentityReviewed": False,
            "speciesEvidence": False,
        }
        longitude = float(candidate["longitudeWgs84"])
        latitude = float(candidate["latitudeWgs84"])
        if not (math.isfinite(longitude) and math.isfinite(latitude)):
            raise ValueError(f"Invalid candidate coordinates at line {line_number}")
        local_rows.append(candidate)
        counts_by_province[province_context][code] += 1
        counts_by_group[group] += 1
        counts_by_code[code] += 1
        if candidate["name"]:
            distinct_names.add(unicodedata.normalize("NFKC", candidate["name"]).strip().casefold())

    if overlay_rows != overlay["results"]["inputRows"]:
        raise ValueError("Overlay row count does not match its pinned receipt")
    if not local_rows:
        raise ValueError("No GeoNames candidates matched the Central Luzon polygon-context screen")
    if set(counts_by_code) != set(FEATURE_CODE_DEFINITIONS):
        raise ValueError("Candidate feature codes and reviewed code definitions differ")

    local_bytes = "".join(
        json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n"
        for row in sorted(
            local_rows,
            key=lambda item: (
                item["singlePolygonPointContext"],
                item["featureCode"],
                item["geonameId"],
            ),
        )
    ).encode("utf-8")
    write_immutable(ROOT / OUTPUT_QUEUE_RELATIVE, local_bytes)

    report = {
        "schemaVersion": 1,
        "reviewId": "geonames-region03-central-luzon-hydrographic-candidates-20261127",
        "generatedOn": GENERATED_ON,
        "status": "regional-discovery-screen-built;source-code-groupings-only;waterbody-and-species-review-pending",
        "scope": {
            "regionReviewScope": REGION_NAME,
            "provincePolygonNames": sorted(PROVINCES),
            "selectionRule": "only GeoNames hydrographic records whose points fell inside exactly one of the seven named simplified ADM2 province polygons in the pinned overlay",
            "overlayReview": str(OVERLAY_RELATIVE).replace("\\", "/"),
            "overlayQueueSha256": overlay_queue_sha256,
            "allPhilippinesOverlayRows": overlay_rows,
            "regionAssignmentsAdded": 0,
        },
        "source": {
            "provider": "GeoNames Gazetteer Philippines country extract",
            "featureClass": "H",
            "extractReview": "data/research/philippines/national/reviews/geonames-ph-hydrography-extract-20261107.json",
            "featureCodeDefinitions": FEATURE_CODES_URL,
            "license": "CC BY 4.0",
            "attribution": "GeoNames Gazetteer (https://www.geonames.org/), country extract PH, downloaded 2026-11-07; CC BY 4.0.",
        },
        "featureCodeDefinitions": FEATURE_CODE_DEFINITIONS,
        "featureCodeGroups": {
            group: {
                "codes": sorted(codes),
                "rows": counts_by_group[group],
                "meaning": "GeoNames source labels grouped for research triage; not an ecological habitat, salinity, catchability, or access conclusion",
            }
            for group, codes in FEATURE_GROUPS.items()
        },
        "results": {
            "candidateRows": len(local_rows),
            "distinctNormalizedNameStrings": len(distinct_names),
            "candidateRowsByProvincePolygonPointContext": {
                province: sum(counts.values()) for province, counts in sorted(counts_by_province.items())
            },
            "candidateRowsByProvinceAndFeatureCode": {
                province: dict(sorted(counts.items()))
                for province, counts in sorted(counts_by_province.items())
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
            "A point inside one simplified province polygon is coarse point context only; it does not verify waterbody identity, province/region assignment, or legal boundaries.",
            "The pinned overlay uses simplified 2020 land polygons and does not define municipal waters, coastlines, waterbody boundaries, or fishing areas.",
            "GeoNames feature labels and the research groupings do not establish salinity, habitat, fish presence, ecological condition, fishing access, or current condition.",
            "Some entries are channels, stream sections, irrigation context, navigation features, or waterfalls rather than distinct waterbodies; repeated names and records were not resolved into unique sites.",
            "GeoNames aggregates over a hundred source datasets; records are not independent confirmations and may have varying precision or currency.",
            "This candidate screen contains no fish observations. No species assertions, public geometry, or app records were created.",
            "Exact candidate names, IDs, coordinates, and source administrative codes remain only in Git-ignored local storage.",
        ],
    }
    report_bytes = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    write_immutable(ROOT / REPORT_RELATIVE, report_bytes)
    print(f"{REGION_NAME} GeoNames point candidates: {len(local_rows)}; distinct normalized names: {len(distinct_names)}")
    print("GeoNames source-code groups: " + json.dumps(dict(counts_by_group), ensure_ascii=False, sort_keys=True))
    print("Candidate counts by province polygon point context: " + json.dumps(report["results"]["candidateRowsByProvincePolygonPointContext"], ensure_ascii=False, sort_keys=True))
    print("Region assignments: 0; verified waterbody identities: 0; species assertions: 0")
    print(f"Local-only queue: {OUTPUT_QUEUE_RELATIVE}")
    print(f"Aggregate review: {REPORT_RELATIVE}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
