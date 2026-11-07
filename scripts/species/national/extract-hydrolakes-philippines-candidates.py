#!/usr/bin/env python3
"""Create a local-only Philippines HydroLAKES attribute candidate queue."""

from __future__ import annotations

import hashlib
import json
import math
import os
import struct
import subprocess
import sys
import zipfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[3]
ARCHIVE_RELATIVE = Path("data/research/philippines/raw/hydrolakes-asia-subset-screen-20261030/HydroLAKES_Asia.zip")
OUTPUT_RELATIVE = Path("data/research/philippines/raw/national/hydrolakes-philippines-v1-waterbody-candidates.jsonl")
EXPECTED_SHA256 = "7c610c19d561f84624736081d2bdd95c004812f5c2354afb6cbdc1bc5c411cc2"
EXPECTED_MD5 = "7601d5fad928195d6a91c616adb172ad"
EXPECTED_DBF_ROWS = 250196
EXPECTED_DBF_RECORD_LENGTH = 414
ZENODO_RECORD = "https://zenodo.org/records/17503891"
ZENODO_METADATA_API = "https://zenodo.org/api/records/17503891"
OFFICIAL_PRODUCT = "https://www.hydrosheds.org/products/hydrolakes"
TECHNICAL_DOC = "https://data.hydrosheds.org/file/technical-documentation/HydroLAKES_TechDoc_v10.pdf"
RUN_DATE = datetime.now(timezone.utc).date().isoformat()
RUN_DATE_COMPACT = RUN_DATE.replace("-", "")
REPORT_RELATIVE = Path(
    f"data/research/philippines/national/reviews/hydrolakes-philippines-candidate-extract-{RUN_DATE_COMPACT}.json"
)


def hash_file(path: Path, algorithm: str) -> str:
    digest = hashlib.new(algorithm)
    with path.open("rb") as file_handle:
        while chunk := file_handle.read(1024 * 1024):
            digest.update(chunk)
    return digest.hexdigest()


def read_exact(file_handle, size: int) -> bytes:
    value = file_handle.read(size)
    if len(value) != size:
        raise ValueError(f"Unexpected EOF while reading DBF ({len(value)}/{size} bytes)")
    return value


def decode_text(value: bytes) -> str:
    raw = value.rstrip(b" \x00")
    if not raw:
        return ""
    try:
        return raw.decode("utf-8").strip()
    except UnicodeDecodeError:
        return raw.decode("cp1252").strip()


def parse_field_value(raw: bytes, field_type: str):
    if field_type in {"C", "M"}:
        return decode_text(raw)
    if field_type in {"N", "F"}:
        text = raw.strip().decode("ascii", errors="strict")
        if not text:
            return None
        number = float(text)
        if not math.isfinite(number):
            return None
        return int(number) if number.is_integer() else number
    if field_type == "L":
        return raw[:1].upper() in {b"Y", b"T"}
    if field_type == "D":
        return raw.decode("ascii", errors="strict").strip() or None
    return decode_text(raw)


def read_philippines_rows(dbf_stream):
    header = read_exact(dbf_stream, 32)
    declared_rows = struct.unpack_from("<I", header, 4)[0]
    header_length = struct.unpack_from("<H", header, 8)[0]
    record_length = struct.unpack_from("<H", header, 10)[0]
    descriptor_bytes = read_exact(dbf_stream, header_length - 32)
    descriptors = []
    offset = 1
    for start in range(0, len(descriptor_bytes), 32):
        descriptor = descriptor_bytes[start : start + 32]
        if not descriptor or descriptor[0] == 0x0D:
            break
        if len(descriptor) != 32:
            raise ValueError("DBF contains a truncated field descriptor")
        field_name = descriptor[:11].split(b"\x00", 1)[0].decode("ascii")
        field_type = chr(descriptor[11])
        field_length = descriptor[16]
        descriptors.append((field_name, field_type, field_length, offset))
        offset += field_length

    if offset != record_length:
        raise ValueError(f"DBF descriptor length mismatch ({offset}/{record_length})")
    field_names = {name for name, _, _, _ in descriptors}
    required = {"Hylak_id", "Lake_name", "Country", "Continent", "Lake_type", "Lake_area", "Poly_src", "Pour_long", "Pour_lat"}
    if not required.issubset(field_names):
        raise ValueError(f"DBF is missing required fields: {sorted(required - field_names)}")

    philippines_rows = []
    active_rows = 0
    for _ in range(declared_rows):
        record = read_exact(dbf_stream, record_length)
        if record[:1] == b"*":
            continue
        active_rows += 1
        values = {
            name: parse_field_value(record[field_offset : field_offset + field_length], field_type)
            for name, field_type, field_length, field_offset in descriptors
        }
        if str(values.get("Country") or "").strip().casefold() != "philippines":
            continue
        if str(values.get("Continent") or "").strip().casefold() != "asia":
            raise ValueError("A Philippines record is not classified as Asia in the pinned source")
        if not isinstance(values.get("Hylak_id"), int):
            raise ValueError("A Philippines candidate is missing its integer Hylak_id")
        if values.get("Lake_area") is None:
            raise ValueError("A Philippines candidate is missing its Lake_area value")

        longitude = values.get("Pour_long")
        latitude = values.get("Pour_lat")
        if longitude is not None and not -180 <= longitude <= 180:
            longitude = None
        if latitude is not None and not -90 <= latitude <= 90:
            latitude = None
        if longitude is None or latitude is None:
            longitude = None
            latitude = None

        philippines_rows.append(
            {
                "hylakId": values["Hylak_id"],
                "lakeName": values.get("Lake_name") or None,
                "country": values["Country"],
                "continent": values["Continent"],
                "polygonSourceCode": values.get("Poly_src"),
                "lakeTypeCode": values.get("Lake_type"),
                "lakeAreaKm2": values["Lake_area"],
                "shorelineLengthKm": values.get("Shore_len"),
                "pourPointWgs84": None
                if longitude is None
                else {"longitude": longitude, "latitude": latitude},
                "sourceVersion": "HydroLAKES v1",
                "candidateOnly": True,
                "identityAndRegionReviewed": False,
            }
        )

    if active_rows != EXPECTED_DBF_ROWS:
        raise ValueError(f"Unexpected active DBF row count: {active_rows}/{EXPECTED_DBF_ROWS}")
    return declared_rows, record_length, active_rows, philippines_rows


def write_jsonl_atomically(path: Path, rows: list[dict]) -> bytes:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = path.with_suffix(path.suffix + ".tmp")
    encoded = "".join(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in rows).encode("utf-8")
    with temporary_path.open("wb") as file_handle:
        file_handle.write(encoded)
        file_handle.flush()
        os.fsync(file_handle.fileno())
    temporary_path.replace(path)
    return encoded


def write_json_atomically(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = path.with_suffix(path.suffix + ".tmp")
    with temporary_path.open("w", encoding="utf-8", newline="\n") as file_handle:
        json.dump(value, file_handle, ensure_ascii=False, indent=2)
        file_handle.write("\n")
        file_handle.flush()
        os.fsync(file_handle.fileno())
    temporary_path.replace(path)


def main() -> int:
    archive_path = ROOT / ARCHIVE_RELATIVE
    output_path = ROOT / OUTPUT_RELATIVE
    report_path = ROOT / REPORT_RELATIVE
    if not archive_path.is_file():
        raise FileNotFoundError(
            f"HydroLAKES Asia subset is missing at {ARCHIVE_RELATIVE}; retrieve the Zenodo Asia file before running this local-only extraction"
        )

    sha256 = hash_file(archive_path, "sha256")
    md5 = hash_file(archive_path, "md5")
    if sha256 != EXPECTED_SHA256 or md5 != EXPECTED_MD5:
        raise ValueError("HydroLAKES Asia archive checksum differs from the reviewed Zenodo record")

    with zipfile.ZipFile(archive_path) as archive:
        dbf_members = [info for info in archive.infolist() if PurePosixPath(info.filename).name == "HydroLAKES_Asia.dbf"]
        if len(dbf_members) != 1:
            raise ValueError(f"Expected one HydroLAKES_Asia.dbf member; found {len(dbf_members)}")
        dbf_member = dbf_members[0]
        if dbf_member.file_size <= 0:
            raise ValueError("HydroLAKES_Asia.dbf is empty")
        with archive.open(dbf_member) as dbf_stream:
            declared_rows, record_length, active_rows, candidates = read_philippines_rows(dbf_stream)
        if declared_rows != EXPECTED_DBF_ROWS or record_length != EXPECTED_DBF_RECORD_LENGTH:
            raise ValueError(
                f"Unexpected DBF schema dimensions: {declared_rows} rows, {record_length} bytes per row"
            )

    candidate_ids = [row["hylakId"] for row in candidates]
    if len(candidate_ids) != len(set(candidate_ids)):
        raise ValueError("Duplicate Hylak_id values found in the Philippines candidate queue")

    jsonl_bytes = write_jsonl_atomically(output_path, candidates)
    ignored_result = subprocess.run(
        ["git", "check-ignore", "--quiet", str(OUTPUT_RELATIVE).replace("\\", "/")],
        cwd=ROOT,
        check=False,
    )
    if ignored_result.returncode != 0:
        output_path.unlink(missing_ok=True)
        raise RuntimeError("Local candidate output is not Git-ignored; it was removed to prevent accidental publication")

    named_rows = [row for row in candidates if row["lakeName"]]
    unnamed_rows = len(candidates) - len(named_rows)
    distinct_names = {
        " ".join(row["lakeName"].split()).casefold()
        for row in named_rows
    }
    type_counts = Counter(str(row["lakeTypeCode"] if row["lakeTypeCode"] is not None else "MISSING") for row in candidates)
    missing_pour_points = sum(row["pourPointWgs84"] is None for row in candidates)
    small_area_rows = sum(row["lakeAreaKm2"] < 0.1 for row in candidates)

    artifact = {
        "schemaVersion": 1,
        "reviewId": f"hydrolakes-philippines-candidate-extract-{RUN_DATE_COMPACT}",
        "generatedOn": RUN_DATE,
        "status": "philippines-waterbody-attributes-extracted;candidate-review-only;no-fish-assertions",
        "source": {
            "product": "HydroLAKES v1",
            "officialProductUrl": OFFICIAL_PRODUCT,
            "technicalDocumentationUrl": TECHNICAL_DOC,
            "sourceVersion": "v1",
            "originalProductLicense": "CC BY 4.0",
            "subsetRepository": "Zenodo",
            "subsetRecordUrl": ZENODO_RECORD,
            "subsetDoi": "10.5281/zenodo.17503891",
            "subsetCreator": "Daniel Schönberger",
            "subsetVersion": "v1",
            "subsetLicense": "CC BY 4.0 (cc-by-4.0), confirmed from Zenodo record metadata",
            "licenseMetadataApi": ZENODO_METADATA_API,
            "licenseVerifiedOn": RUN_DATE,
            "subsetFile": "HydroLAKES_Asia.zip",
            "retrieval": "Reused existing local archive; this run made no network request",
            "publishedMd5": EXPECTED_MD5,
            "verifiedMd5": md5,
            "verifiedSha256": sha256,
            "attribution": "HydroLAKES v1 by Lehner and Messager; Asia subset by Daniel Schönberger (2025), Zenodo DOI 10.5281/zenodo.17503891; CC BY 4.0.",
        },
        "sourceTable": {
            "dbfMember": dbf_member.filename,
            "dbfUncompressedBytes": dbf_member.file_size,
            "declaredRows": declared_rows,
            "activeRows": active_rows,
            "recordLengthBytes": record_length,
            "philippinesCandidateRows": len(candidates),
            "namedCandidateRows": len(named_rows),
            "unnamedCandidateRows": unnamed_rows,
            "distinctNormalizedNonEmptyNames": len(distinct_names),
            "lakeTypeCodeCounts": dict(sorted(type_counts.items())),
            "missingPourPointRows": missing_pour_points,
            "areaBelowProductThresholdRows": small_area_rows,
            "areaField": "Lake_area, km2, per HydroLAKES technical documentation",
        },
        "localOutput": {
            "path": str(OUTPUT_RELATIVE).replace("\\", "/"),
            "rows": len(candidates),
            "bytes": len(jsonl_bytes),
            "sha256": hashlib.sha256(jsonl_bytes).hexdigest(),
            "gitIgnored": True,
            "appBundleIncluded": False,
            "containsCandidateNames": True,
            "containsPourPointCoordinates": True,
            "containsPolygons": False,
        },
        "decisions": {
            "waterbodyIdentityValidated": False,
            "regionAssignmentsAdded": 0,
            "speciesAssertionsAdded": 0,
            "publicGeometryAdded": False,
            "publicationApproval": False,
        },
        "limitations": [
            "This is a source-derived candidate index, not a complete Philippine lake inventory or a fish occurrence dataset.",
            "HydroLAKES v1 targets lakes with surface area of at least 10 ha, includes reservoirs and some saline lakes, and explicitly omits river and wetland polygons; smaller lakes, ponds, wetlands, rivers and streams need separate sources.",
            "The source populates names only for selected larger lakes and named reservoirs; blank Lake_name values are not evidence that a waterbody is unnamed locally.",
            "Country is assigned by HydroLAKES using the lake pour point, which can be arbitrary for boundary cases; no candidate was assigned to a Philippine region or province in this extraction.",
            "Lake_type code 1 is a default that can include unidentified smaller reservoirs or regulated lakes; type codes are retained as source indicators, not independently verified waterbody classifications.",
            "Pour points are outlet coordinates, not lake centroids or shoreline polygons. The local candidate output is excluded from Git and the app bundle.",
            "Use required CC BY 4.0 attribution for any future redistribution and review positional accuracy and source version before map use.",
        ],
    }
    write_json_atomically(report_path, artifact)

    print(f"HydroLAKES Asia DBF rows: {active_rows}; Philippines candidates: {len(candidates)}")
    print(
        f"Named: {len(named_rows)}; unnamed in source field: {unnamed_rows}; distinct names: {len(distinct_names)}; "
        f"no region assignments; fish assertions: 0"
    )
    print(f"Local-only candidate queue: {OUTPUT_RELATIVE}; report: {REPORT_RELATIVE}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:  # keep a concise CLI failure for local research tooling
        print(str(error), file=sys.stderr)
        sys.exit(1)
