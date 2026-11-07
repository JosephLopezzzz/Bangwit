#!/usr/bin/env python3
"""Extract GeoNames Philippines hydrographic features to local research storage."""

from __future__ import annotations

import hashlib
import io
import json
import math
import os
import subprocess
import sys
import unicodedata
import zipfile
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
SNAPSHOT_DATE = "2026-11-07"
SNAPSHOT_COMPACT = SNAPSHOT_DATE.replace("-", "")
SOURCE_LAST_MODIFIED = "Sat, 07 Nov 2026 02:52:17 GMT"
ARCHIVE_RELATIVE = Path(f"data/research/philippines/raw/national/geonames-ph-{SNAPSHOT_COMPACT}/PH.zip")
OUTPUT_RELATIVE = Path(
    f"data/research/philippines/raw/national/geonames-ph-{SNAPSHOT_COMPACT}/hydrographic-candidates.jsonl"
)
REPORT_RELATIVE = Path(
    f"data/research/philippines/national/reviews/geonames-ph-hydrography-extract-{SNAPSHOT_COMPACT}.json"
)
EXPECTED_ARCHIVE_SHA256 = "c0e25a3ea462f818627117f60ace9bf2f87b965c19ea2b0ecc161ab9fc01367a"
EXPECTED_ARCHIVE_BYTES = 2555692
EXPECTED_MEMBER_NAME = "PH.txt"
EXPECTED_MEMBER_BYTES = 11379483
DOWNLOAD_URL = "https://download.geonames.org/export/dump/PH.zip"
README_URL = "https://download.geonames.org/export/dump/readme.txt"
FEATURE_CODES_URL = "https://www.geonames.org/export/codes.html"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        while chunk := source.read(1024 * 1024):
            digest.update(chunk)
    return digest.hexdigest()


def write_bytes_atomically(path: Path, content: bytes) -> None:
    if path.exists():
        if path.read_bytes() == content:
            return
        raise FileExistsError(f"Refusing to overwrite a different snapshot output: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    with temporary.open("wb") as output:
        output.write(content)
        output.flush()
        os.fsync(output.fileno())
    temporary.replace(path)


def write_json_atomically(path: Path, value: dict) -> None:
    content = (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    if path.exists():
        if path.read_bytes() == content:
            return
        raise FileExistsError(f"Refusing to overwrite a different review receipt: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    with temporary.open("wb") as output:
        output.write(content)
        output.flush()
        os.fsync(output.fileno())
    temporary.replace(path)


def main() -> int:
    archive_path = ROOT / ARCHIVE_RELATIVE
    output_path = ROOT / OUTPUT_RELATIVE
    report_path = ROOT / REPORT_RELATIVE
    if not archive_path.is_file():
        raise FileNotFoundError(f"Download the public GeoNames snapshot to {ARCHIVE_RELATIVE} first")
    if archive_path.stat().st_size != EXPECTED_ARCHIVE_BYTES:
        raise ValueError("GeoNames archive size differs from the reviewed 2026-11-07 snapshot")
    archive_sha256 = sha256_file(archive_path)
    if archive_sha256 != EXPECTED_ARCHIVE_SHA256:
        raise ValueError("GeoNames archive SHA-256 differs from the reviewed 2026-11-07 snapshot")

    candidates = []
    country_rows = 0
    feature_code_counts: Counter[str] = Counter()
    named_rows = 0
    unique_names: set[str] = set()
    unique_ids: set[int] = set()
    invalid_coordinate_rows = 0
    with zipfile.ZipFile(archive_path) as archive:
        members = [member for member in archive.infolist() if Path(member.filename).name == EXPECTED_MEMBER_NAME]
        if len(members) != 1 or members[0].file_size != EXPECTED_MEMBER_BYTES:
            raise ValueError("GeoNames PH.zip does not match the reviewed PH.txt member")
        member = members[0]
        with archive.open(member) as binary_source:
            with io.TextIOWrapper(binary_source, encoding="utf-8", newline="") as text_source:
                for line_number, line in enumerate(text_source, start=1):
                    columns = line.rstrip("\r\n").split("\t")
                    if len(columns) != 19:
                        raise ValueError(f"GeoNames PH.txt line {line_number} has {len(columns)} columns, expected 19")
                    geoname_id, name, ascii_name, alternate_names = columns[:4]
                    latitude, longitude, feature_class, feature_code, country_code = columns[4:9]
                    admin1_code, admin2_code, admin3_code, admin4_code = columns[9:13]
                    modified_date = columns[18]
                    if country_code != "PH":
                        raise ValueError(f"GeoNames PH.txt line {line_number} has country code {country_code!r}")
                    country_rows += 1
                    if feature_class != "H":
                        continue
                    if not geoname_id.isdigit() or not feature_code:
                        raise ValueError(f"GeoNames hydrographic line {line_number} is missing its ID or feature code")
                    numeric_latitude = float(latitude)
                    numeric_longitude = float(longitude)
                    valid_coordinates = math.isfinite(numeric_latitude) and math.isfinite(numeric_longitude)
                    valid_coordinates = valid_coordinates and -90 <= numeric_latitude <= 90 and -180 <= numeric_longitude <= 180
                    if not valid_coordinates:
                        invalid_coordinate_rows += 1

                    identifier = int(geoname_id)
                    if identifier in unique_ids:
                        raise ValueError(f"Duplicate GeoNames ID {identifier} in the country file")
                    unique_ids.add(identifier)
                    feature_code_counts[feature_code] += 1
                    if name.strip():
                        named_rows += 1
                        unique_names.add(unicodedata.normalize("NFKC", name).strip().casefold())
                    candidates.append(
                        {
                            "geonameId": identifier,
                            "name": name or None,
                            "asciiName": ascii_name or None,
                            "alternateNames": alternate_names or None,
                            "latitudeWgs84": latitude if valid_coordinates else None,
                            "longitudeWgs84": longitude if valid_coordinates else None,
                            "featureClass": feature_class,
                            "featureCode": feature_code,
                            "countryCode": country_code,
                            "admin1Code": admin1_code or None,
                            "admin2Code": admin2_code or None,
                            "admin3Code": admin3_code or None,
                            "admin4Code": admin4_code or None,
                            "sourceModifiedDate": modified_date or None,
                            "candidateOnly": True,
                            "waterbodyIdentityReviewed": False,
                            "speciesEvidence": False,
                        }
                    )

    if not candidates:
        raise ValueError("No GeoNames hydrographic features were found in the Philippines dump")
    local_bytes = "".join(
        json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n"
        for row in candidates
    ).encode("utf-8")
    write_bytes_atomically(output_path, local_bytes)
    ignore_status = subprocess.run(
        ["git", "check-ignore", "--quiet", str(OUTPUT_RELATIVE).replace("\\", "/")],
        cwd=ROOT,
        check=False,
    )
    if ignore_status.returncode != 0:
        output_path.unlink(missing_ok=True)
        raise RuntimeError("Hydrographic candidate output is not Git-ignored; removed to prevent accidental publication")

    report = {
        "schemaVersion": 1,
        "reviewId": f"geonames-ph-hydrography-extract-{SNAPSHOT_COMPACT}",
        "snapshotDate": SNAPSHOT_DATE,
        "status": "hydrographic-features-extracted;name-discovery-only;no-species-assertions",
        "source": {
            "provider": "GeoNames Gazetteer",
            "countryFileUrl": DOWNLOAD_URL,
            "readmeUrl": README_URL,
            "featureCodesUrl": FEATURE_CODES_URL,
            "license": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
            "licenseEvidence": "The current GeoNames data README states CC BY 4.0; GeoNames requires credit when using the dump.",
            "attribution": "GeoNames Gazetteer (https://www.geonames.org/), country extract PH, downloaded 2026-11-07; CC BY 4.0.",
            "sourceAggregation": "GeoNames aggregates records from over one hundred sources; this is a downloadable gazetteer, not an independent field survey.",
            "sourceLastModifiedHttp": SOURCE_LAST_MODIFIED,
            "archiveBytes": EXPECTED_ARCHIVE_BYTES,
            "archiveSha256": archive_sha256,
            "archivePath": str(ARCHIVE_RELATIVE).replace("\\", "/"),
            "archiveGitIgnored": True,
        },
        "sourceTable": {
            "countryRows": country_rows,
            "hydrographicFeatureRows": len(candidates),
            "namedRows": named_rows,
            "distinctNormalizedNames": len(unique_names),
            "invalidCoordinateRows": invalid_coordinate_rows,
            "featureCodeCounts": dict(sorted(feature_code_counts.items())),
            "filter": "featureClass exactly H, the GeoNames hydrographic class",
        },
        "localCandidateFile": {
            "path": str(OUTPUT_RELATIVE).replace("\\", "/"),
            "rows": len(candidates),
            "bytes": len(local_bytes),
            "sha256": hashlib.sha256(local_bytes).hexdigest(),
            "gitIgnored": True,
            "appBundleIncluded": False,
            "containsExactCoordinates": True,
            "containsNamesAndAlternateNames": True,
            "containsLinesOrPolygons": False,
        },
        "decisions": {
            "regionAssignmentsAdded": 0,
            "waterbodyIdentitiesValidated": 0,
            "speciesAssertionsAdded": 0,
            "publicGeometryAdded": False,
            "publicationApproval": False,
        },
        "limitations": [
            "GeoNames records are names and points, not river lines, lake shorelines, wetland polygons or species observations.",
            "The dataset aggregates many source providers; records may overlap other portals and are not independent confirmations of one another.",
            "A feature code and gazetteer point are discovery context only; they do not establish a verified waterbody identity, salinity, fish presence, fishing access or legal boundary.",
            "Coordinate and name quality, provider lineage and source-specific recency require review before a waterbody crosswalk or map use.",
            "The source is provided as-is and does not promise completeness, accuracy or timeliness; no absent feature should be treated as proof of absence.",
            "Exact coordinates and names are kept only in Git-ignored local research storage; no species or public map data was produced.",
        ],
    }
    write_json_atomically(ROOT / REPORT_RELATIVE, report)
    print(f"GeoNames PH gazetteer rows: {country_rows}; hydrographic candidates: {len(candidates)}")
    print(f"Named candidates: {named_rows}; distinct names: {len(unique_names)}; invalid coordinates: {invalid_coordinate_rows}")
    print(f"Species assertions: 0; regional assignments: 0; local-only queue: {OUTPUT_RELATIVE}")
    print(f"Wrote aggregate receipt: {REPORT_RELATIVE}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:  # keep the local research CLI concise
        print(str(error), file=sys.stderr)
        sys.exit(1)
