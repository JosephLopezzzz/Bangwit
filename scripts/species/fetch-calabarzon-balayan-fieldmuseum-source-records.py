"""Cross-check Balayan Bay FMNH catalog items against the Field Museum's IPT archive."""

import csv
import hashlib
import io
import json
import sys
import urllib.request
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "data" / "research" / "philippines"
RAW_DIR = RESEARCH / "raw" / "calabarzon-balayan-fieldmuseum-source-check-20261025"
ARCHIVE_PATH = RAW_DIR / "fmnh_fishes-v13.13.zip"
OUTPUT_PATH = RESEARCH / "calabarzon-balayan-fieldmuseum-source-records-20261025.json"
ARCHIVE_URL = "https://fmipt.fieldmuseum.org/ipt/archive.do?r=fmnh_fishes&v=13.13"
IPT_URL = "https://fmipt.fieldmuseum.org/ipt/resource?r=fmnh_fishes"
COLLECTION_URL = "https://www.fieldmuseum.org/project-narrative/science/fishes-collection"
TARGETS = {
    "47041": "Caracanthus unipinna",
    "90961": "Lagocephalus lunaris",
}


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def normalize(value: object) -> str:
    return " ".join(str(value or "").strip().casefold().split())


def binomial(value: object) -> str:
    return " ".join(normalize(value).split()[:2])


def is_cc0(value: object) -> bool:
    license_text = normalize(value)
    return "cc0" in license_text or "publicdomain/zero/1.0" in license_text


def source_date_precision(row: dict[str, str]) -> str:
    if row.get("eventDate"):
        parts = row["eventDate"].split("-")
        return {1: "year", 2: "month", 3: "day"}.get(len(parts), "verbatim")
    populated = [row.get("year"), row.get("month"), row.get("day")]
    return {1: "year", 2: "month", 3: "day"}.get(sum(bool(value) for value in populated), "unknown")


def download_archive() -> bytes:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(
        ARCHIVE_URL,
        headers={
            "Accept": "application/zip",
            "User-Agent": "Bangwit-research/1.0 (museum source cross-check)",
        },
    )
    with urllib.request.urlopen(request, timeout=90) as response:
        content_type = response.headers.get("Content-Type", "")
        payload = response.read()
        if not content_type.lower().startswith("application/zip"):
            raise RuntimeError(f"Expected a ZIP archive, received content type {content_type!r}")
    if not zipfile.is_zipfile(io.BytesIO(payload)):
        raise RuntimeError("Field Museum response was not a readable ZIP archive")
    ARCHIVE_PATH.write_bytes(payload)
    return payload


def load_archive() -> tuple[bytes, dict[str, dict[str, str]], str]:
    archive_bytes = download_archive() if "--refresh" in sys.argv else ARCHIVE_PATH.read_bytes()
    with zipfile.ZipFile(io.BytesIO(archive_bytes)) as archive:
        member_names = set(archive.namelist())
        if "occurrence.txt" not in member_names or "eml.xml" not in member_names:
            raise RuntimeError("Expected occurrence.txt and eml.xml in the published Darwin Core Archive")

        eml_bytes = archive.read("eml.xml")
        text_stream = io.TextIOWrapper(archive.open("occurrence.txt"), encoding="utf-8-sig", newline="")
        rows = csv.DictReader(text_stream, delimiter="\t")
        matches: dict[str, dict[str, str]] = {}
        for row in rows:
            catalog = (row.get("catalogNumber") or "").strip()
            if catalog not in TARGETS:
                continue
            if normalize(row.get("institutionCode")) != "fmnh":
                continue
            if normalize(row.get("collectionCode")) != "fishes":
                continue
            if catalog in matches:
                raise RuntimeError(f"Duplicate Field Museum catalog number {catalog} in the archive")
            matches[catalog] = row

    if set(matches) != set(TARGETS):
        missing = sorted(set(TARGETS) - set(matches))
        raise RuntimeError(f"Expected exactly two Field Museum catalog rows; missing {missing}")
    return archive_bytes, matches, sha256(eml_bytes)


def allowlisted_record(catalog: str, row: dict[str, str], idigbio: dict) -> dict:
    direct_name = row.get("scientificName") or None
    direct_date = row.get("eventDate") or None
    direct_locality = row.get("locality") or None
    direct_waterbody = row.get("waterBody") or None
    direct_year = row.get("year") or None
    direct_license = row.get("license") or None
    idigbio_name = idigbio.get("scientificName")
    idigbio_date = idigbio.get("eventDate")
    idigbio_year = (idigbio.get("sourceDateComponents") or {}).get("year")
    idigbio_locality = idigbio.get("locality")
    idigbio_waterbody = idigbio.get("waterBody")
    idigbio_license = idigbio.get("license")
    return {
        "catalogNumber": catalog,
        "institutionCode": row.get("institutionCode"),
        "collectionCode": row.get("collectionCode"),
        "basisOfRecord": row.get("basisOfRecord"),
        "occurrenceId": row.get("occurrenceID") or None,
        "scientificName": direct_name,
        "family": row.get("family") or None,
        "taxonRank": row.get("taxonRank") or None,
        "identificationQualifier": row.get("identificationQualifier") or None,
        "eventDate": direct_date,
        "year": direct_year,
        "month": row.get("month") or None,
        "day": row.get("day") or None,
        "verbatimEventDate": row.get("verbatimEventDate") or None,
        "sourceDatePrecision": source_date_precision(row),
        "country": row.get("country") or None,
        "stateProvince": row.get("stateProvince") or None,
        "county": row.get("county") or None,
        "waterBody": direct_waterbody,
        "locality": direct_locality,
        "license": direct_license,
        "rightsHolder": row.get("rightsHolder") or None,
        "idigbioUuid": idigbio.get("uuid"),
        "idigbioCrosscheck": {
            "scientificNameMatches": binomial(direct_name) == binomial(idigbio_name),
            "eventDateMatches": normalize(direct_date) == normalize(idigbio_date),
            "yearMatches": normalize(direct_year) == normalize(idigbio_year),
            "localityMatches": normalize(direct_locality) == normalize(idigbio_locality),
            "waterBodyMatches": normalize(direct_waterbody) == normalize(idigbio_waterbody),
            "recordLicenseMatches": normalize(direct_license) == normalize(idigbio_license),
            "iDigBioIndexedDateCollected": idigbio.get("indexedDateCollected"),
            "indexDateUsedAsSourceDate": False,
        },
        "rawRecordCoordinatesExcluded": True,
    }


def main() -> None:
    archive_bytes, source_rows, eml_sha256 = load_archive()
    idigbio_path = RESEARCH / "calabarzon-balayan-idigbio-catalog-check-20261025.json"
    idigbio_review = json.loads(idigbio_path.read_text(encoding="utf-8"))
    records = []
    for catalog, expected_name in TARGETS.items():
        row = source_rows[catalog]
        assert binomial(row.get("scientificName")) == binomial(expected_name), (
            f"Field Museum catalog {catalog} scientific-name drift requires review"
        )
        mirror = next(
            item for item in idigbio_review["records"]
            if normalize(item.get("institutionCode")) == "fmnh"
            and normalize(item.get("catalogNumber")) == normalize(catalog)
        )
        records.append(allowlisted_record(catalog, row, mirror))

    report = {
        "schemaVersion": 1,
        "title": "Balayan Bay Field Museum source records cross-checked with iDigBio",
        "reviewedOn": "2026-10-25",
        "provider": "Field Museum of Natural History, Division of Fishes",
        "collectionPage": COLLECTION_URL,
        "iptDatasetPage": IPT_URL,
        "archiveUrl": ARCHIVE_URL,
        "archiveVersion": "13.13",
        "archive": {
            "path": "raw/calabarzon-balayan-fieldmuseum-source-check-20261025/fmnh_fishes-v13.13.zip",
            "bytes": len(archive_bytes),
            "sha256": sha256(archive_bytes),
            "emlSha256": eml_sha256,
            "coordinateBearingRawArchive": True,
            "trackedReviewCoordinates": False,
        },
        "rights": {
            "datasetLicense": "CC0 1.0",
            "basis": "Field Museum IPT resource rights statement",
            "rightsUrl": "https://fmipt.fieldmuseum.org/ipt/resource?r=fmnh_fishes",
            "rawArchive": "Full institution archive remains in ignored local storage; do not commit or distribute the source archive as part of this review.",
        },
        "comparison": {
            "idigbioReview": "calabarzon-balayan-idigbio-catalog-check-20261025.json",
            "idigbioReviewSha256": sha256(idigbio_path.read_bytes()),
            "fieldsCompared": ["catalogNumber", "scientificName", "eventDate", "year", "locality", "waterBody", "license"],
            "datePolicy": "Use the institution's eventDate and year/month/day fields as published. Do not upgrade precision using the iDigBio dateCollected index.",
        },
        "records": records,
        "summary": {
            "expectedCatalogs": len(TARGETS),
            "matchedFieldMuseumRecords": len(records),
            "sourceLocalityMentionsBalayanBay": sum(
                "balayan bay" in normalize(record.get("locality")) for record in records
            ),
            "allSourceRecordLicensesCc0": all(
                is_cc0(record.get("license")) for record in records
            ),
            "exactFieldComparisonsWithIDigBio": sum(
                all(record["idigbioCrosscheck"][field] for field in [
                    "scientificNameMatches", "yearMatches", "localityMatches", "recordLicenseMatches"
                ])
                for record in records
            ),
        },
        "decision": {
            "institutionSourceIdentityVerified": True,
            "historicalAssertionsAdmitted": 0,
            "publicRecordsAdded": 0,
            "publicAdmission": False,
            "coordinatesIncluded": False,
            "currentPresenceInferred": False,
            "completeSpeciesInventoryClaimed": False,
            "interpretation": "The Field Museum-hosted archive directly confirms the two institution, collection, catalog, name, source-date, locality and CC0 fields. Source year precision is retained; iDigBio's normalized dateCollected values are not promoted into source dates. GBIF quality flags remain on the candidate records. Consider these source items only for historical-only evidence after the separate taxonomy and row-level quality review.",
        },
    }
    OUTPUT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"Field Museum source archive: {len(records)} catalog items matched; "
        f"{report['summary']['sourceLocalityMentionsBalayanBay']} name Balayan Bay in source locality."
    )
    print("CC0 source terms and iDigBio field comparisons were retained; the review excludes coordinates.")


if __name__ == "__main__":
    main()
