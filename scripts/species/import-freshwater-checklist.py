"""Import the pinned Plazi freshwater checklist as research candidates, never public evidence.

Python's standard ZIP/XML/HTML parsers keep this local research tool dependency-free.
Run with --fetch to acquire/refresh sources; otherwise rebuild only from verified local bytes.
"""

import argparse
import csv
import hashlib
from html.parser import HTMLParser
import io
import json
from pathlib import Path
import re
import sys
import time
from datetime import datetime, timezone
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "data/research/philippines"
SOURCE_ID = "jamandre-2023-plazi-freshwater"
DATASET_KEY = "f33f36f9-829f-4206-9dca-358ce455b037"
METADATA_URL = f"https://api.gbif.org/v1/dataset/{DATASET_KEY}"
ARCHIVE_URL = "https://tb.plazi.org/GgServer/dwca/FFEDFF8BFFD9FFB1FFA5286528420D67.zip"
CC0 = "https://creativecommons.org/publicdomain/zero/1.0/"
FILES = {"metadata": "jamandre-2023-gbif-metadata.json", "archive": "jamandre-2023-dwca.zip"}
MAX_DOWNLOAD = 8 * 1024 * 1024
NS = {"dwc": "http://rs.tdwg.org/dwc/text/"}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def json_bytes(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_bytes(data)
    temporary.replace(path)


def download(url):
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "Bangwit public-source species research/0.1"})
            with urllib.request.urlopen(request, timeout=25) as response:
                data = response.read(MAX_DOWNLOAD + 1)
                if not data or len(data) > MAX_DOWNLOAD:
                    raise ValueError("Empty response or source exceeds 8 MiB research limit")
                return data, response.url
        except urllib.error.HTTPError as error:
            if error.code not in (429, 500, 502, 503, 504) or attempt == 2:
                raise
        except (urllib.error.URLError, TimeoutError):
            if attempt == 2:
                raise
        time.sleep(2 ** attempt)


class Paragraphs(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.rows = []
        self.parts = None

    def handle_starttag(self, tag, attrs):
        if tag == "p":
            if self.parts is not None:
                raise ValueError("Nested source paragraphs require review")
            self.parts = []

    def handle_endtag(self, tag):
        if tag == "p" and self.parts is not None:
            self.rows.append(" ".join("".join(self.parts).split()))
            self.parts = None

    def handle_data(self, data):
        if self.parts is not None:
            self.parts.append(data)
        elif data.strip():
            raise ValueError("Source text outside paragraphs requires extraction review")


def table(archive, meta, row_type):
    matches = [node for node in meta if node.get("rowType", "").rsplit("/", 1)[-1] == row_type]
    if len(matches) != 1:
        raise ValueError(f"Expected one {row_type} table descriptor")
    node = matches[0]
    if (node.get("encoding") != "UTF-8" or node.get("fieldsTerminatedBy") != "\\t"
            or node.get("ignoreHeaderLines") != "1" or node.get("fieldsEnclosedBy", "") != ""):
        raise ValueError(f"Unsupported {row_type} table encoding/layout")
    locations = node.findall("dwc:files/dwc:location", NS)
    if len(locations) != 1 or locations[0].text not in archive.namelist():
        raise ValueError(f"Missing {row_type} table")
    fields = {int(field.attrib["index"]): field.attrib["term"].rsplit("/", 1)[-1]
              for field in node.findall("dwc:field", NS) if "index" in field.attrib}
    text = archive.read(locations[0].text).decode("utf-8-sig")
    rows = list(csv.reader(io.StringIO(text, newline=""), delimiter="\t", quoting=csv.QUOTE_NONE))
    if not rows or not fields:
        raise ValueError(f"Missing {row_type} header or fields")
    width = len(rows[0])
    if max(fields) >= width or len(set(fields.values())) != len(fields):
        raise ValueError(f"Invalid {row_type} field indices")
    if any(rows[0][index] != term for index, term in fields.items()):
        raise ValueError(f"{row_type} descriptor/header mismatch")
    result = []
    for number, row in enumerate(rows[1:], 2):
        if len(row) != width:
            raise ValueError(f"{row_type} column mismatch at row {number}")
        result.append({term: row[index] for index, term in fields.items()})
    return result


def build(metadata_bytes, archive_bytes):
    metadata = json.loads(metadata_bytes)
    allowed_licenses = {CC0, CC0.replace("https:", "http:"), CC0 + "legalcode", CC0.replace("https:", "http:") + "legalcode"}
    if (metadata.get("key") != DATASET_KEY or metadata.get("type") != "CHECKLIST"
            or metadata.get("license") not in allowed_licenses):
        raise ValueError("Unexpected dataset identity/type/license; review source before importing")
    if not any(row.get("type") == "DWC_ARCHIVE" and row.get("url") == ARCHIVE_URL
               for row in metadata.get("endpoints", [])):
        raise ValueError("Pinned archive endpoint is no longer advertised by the dataset")
    with zipfile.ZipFile(io.BytesIO(archive_bytes)) as archive:
        infos = archive.infolist()
        if (len({item.filename for item in infos}) != len(infos) or len(infos) > 30
                or sum(item.file_size for item in infos) > MAX_DOWNLOAD):
            raise ValueError("Duplicate ZIP members or expanded archive exceeds research limit")
        # Parse in memory; never extract source-controlled paths or execute archive content.
        meta_bytes, eml_bytes = archive.read("meta.xml"), archive.read("eml.xml")
        if any(token in (meta_bytes + eml_bytes).upper() for token in (b"<!DOCTYPE", b"<!ENTITY")):
            raise ValueError("DTD/entity XML requires source review")
        meta, eml = ET.fromstring(meta_bytes), ET.fromstring(eml_bytes)
        rights = eml.findall(".//intellectualRights")
        rights_urls = [link.attrib.get("url", "") for right in rights for link in right.iter("ulink")]
        if CC0 not in rights_urls:
            raise ValueError("Archive does not confirm the dataset's CC0 dedication")
        citation = eml.find(".//dataset/citation")
        if citation is None or citation.get("doi") != "10.11646/zootaxa.5301.2.1":
            raise ValueError("Archive publication identity mismatch")
        taxa = table(archive, meta, "Taxon")
        treatments = table(archive, meta, "Document")
        distribution = table(archive, meta, "Distribution")
        materials = table(archive, meta, "Occurrence")
    families = {row["taxonID"]: row for row in taxa}
    if len(families) != len(taxa) or not taxa or any(row.get("taxonRank") != "family" for row in taxa):
        raise ValueError("Expected unique family-level core; changed ranks require an extraction review")
    if len(treatments) != len(families) or {row.get("taxonID") for row in treatments} != set(families):
        raise ValueError("Family/treatment join is incomplete or duplicated")
    candidates, names = [], set()
    for treatment in treatments:
        family = families[treatment["taxonID"]]
        if (treatment.get("format") != "text/html" or treatment.get("UsageTerms") != "Public Domain"
                or treatment.get("additionalInformationURL") != family.get("references")):
            raise ValueError("Treatment format, rights or reference requires review")
        parser = Paragraphs()
        parser.feed(treatment["description"])
        parser.close()
        if parser.parts is not None or not parser.rows:
            raise ValueError("Incomplete/empty treatment paragraphs")
        family_start = len(candidates)
        for index, paragraph in enumerate(parser.rows, 1):
            if re.fullmatch(r"FAMILY\s+" + re.escape(family["canonicalName"]), paragraph, re.IGNORECASE):
                continue
            recorded_name = paragraph.split(";", 1)[0].strip()
            # This source enumerates species; lowercase authority particles (e.g. "de Beaufort") are not epithets.
            match = re.match(r"^([A-Z][a-z]+ [a-z][a-z-]+)(?:\s|$)", recorded_name)
            if not match or ";" not in paragraph:
                raise ValueError(f"Unparsed treatment paragraph: {family['canonicalName']}:{index}")
            name = match.group(1)
            if name in names:
                raise ValueError(f"Duplicate candidate name requires review: {name}")
            names.add(name)
            candidates.append({
                "id": f"{SOURCE_ID}:{digest((family['taxonID'] + chr(0) + name).encode())[:20]}",
                "sourceId": SOURCE_ID,
                "recordedName": recorded_name,
                "candidateName": name,
                "recordedFamily": family["canonicalName"],
                "sourceFamilyTaxonId": family["taxonID"],
                "sourceParagraph": index,
                "sourceUrl": treatment["additionalInformationURL"],
                "verbatimEntry": paragraph,
                "evidenceKind": "literature-checklist-entry",
                "publicationDate": "2023-06-09",
                "observationDate": None,
                "license": "CC0-1.0",
                "reviewStatus": "pending",
                "reviewFlags": ["taxonomy-unreviewed", "locality-unreviewed", "treatment-text-extraction"]
                               + (["source-replacement-character"] if "\ufffd" in paragraph else []),
                "regionIds": [],
                "waterbodyIds": [],
                "acceptedTaxonId": None,
                "publicationEligible": False,
            })
        if len(candidates) == family_start:
            raise ValueError(f"Family treatment has no parsed species candidates: {family['canonicalName']}")
    candidates.sort(key=lambda row: row["candidateName"])
    return {
        "schemaVersion": 1,
        "status": "research-candidates-only",
        "source": {
            "id": SOURCE_ID,
            "datasetKey": DATASET_KEY,
            "title": metadata["title"],
            "datasetDoi": "10.15468/aaa5s3",
            "articleDoi": "10.11646/zootaxa.5301.2.1",
            "publicationDate": "2023-06-09",
            "metadataModified": metadata.get("modified"),
            "metadataUrl": METADATA_URL,
            "archiveUrl": ARCHIVE_URL,
            "metadataSha256": digest(metadata_bytes),
            "archiveSha256": digest(archive_bytes),
            "license": "CC0-1.0",
            "citation": citation.text,
        },
        "scope": {
            "countryCode": "PH",
            "regionAssignments": "none",
            "waterbodyAssignments": "none",
            "interpretation": "Provisional 2023 checklist names extracted from family treatments; not accepted taxonomy, current presence, salinity, conservation, catchability or regional coverage.",
        },
        "counts": {
            "structuredTaxonRows": len(taxa),
            "structuredSpeciesRows": 0,
            "familyTreatments": len(treatments),
            "candidateEntries": len(candidates),
            "uniqueCandidateNames": len(names),
            "structuredDistributionRows": len(distribution),
            "materialCitationRowsNotImported": len(materials),
            "materialCitationOrphanReferences": sum(row.get("taxonID") not in families for row in materials),
            "entriesWithSourceReplacementCharacters": sum("source-replacement-character" in row["reviewFlags"] for row in candidates),
            "publishedRecords": 0,
        },
        "candidates": candidates,
    }


def acquire(output):
    """Validate the pair before promoting bytes; failed refreshes leave the last good receipt intact."""
    raw = output / "raw"
    blobs, sources = {}, []
    for kind, url in (("metadata", METADATA_URL), ("archive", ARCHIVE_URL)):
        data, resolved_url = download(url)
        blobs[kind] = data
        sources.append({"kind": kind, "url": url, "resolvedUrl": resolved_url,
                        "file": FILES[kind], "bytes": len(data), "sha256": digest(data)})
    build(blobs["metadata"], blobs["archive"])
    receipt = {"sourceId": SOURCE_ID, "retrievedAtUtc": datetime.now(timezone.utc).isoformat(), "sources": sources}
    for kind, data in blobs.items():
        save(raw / FILES[kind], data)
    # The receipt is written last; an interrupted promotion fails hash verification on the next run.
    save(raw / "freshwater-download-receipt.json", json_bytes(receipt))
    return receipt


def load_snapshot(output):
    raw = output / "raw"
    receipt = json.loads((raw / "freshwater-download-receipt.json").read_text(encoding="utf-8"))
    if receipt.get("sourceId") != SOURCE_ID or len(receipt.get("sources", [])) != 2:
        raise ValueError("Invalid freshwater download receipt")
    blobs = {}
    for kind, expected_url in (("metadata", METADATA_URL), ("archive", ARCHIVE_URL)):
        rows = [row for row in receipt["sources"] if row.get("kind") == kind]
        if len(rows) != 1 or rows[0].get("file") != FILES[kind] or rows[0].get("url") != expected_url:
            raise ValueError("Unexpected receipt source path or URL")
        data = (raw / FILES[kind]).read_bytes()
        if digest(data) != rows[0].get("sha256") or len(data) != rows[0].get("bytes"):
            raise ValueError(f"Snapshot hash/length mismatch: {kind}; use --fetch to refresh")
        blobs[kind] = data
    return receipt, blobs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fetch", action="store_true", help="Fetch and validate current provider bytes before building")
    parser.add_argument("--check", action="store_true", help="Rebuild locally and require byte-identical checked-in candidates")
    args = parser.parse_args()
    try:
        if args.fetch:
            acquire(OUTPUT)
        receipt, blobs = load_snapshot(OUTPUT)
        result = build(blobs["metadata"], blobs["archive"])
        result["source"]["retrievedAtUtc"] = receipt["retrievedAtUtc"]
        generated = json_bytes(result)
        target = OUTPUT / "freshwater-checklist-candidates.json"
        if args.check:
            if target.read_bytes() != generated:
                raise ValueError("Candidate artifact differs from the verified local snapshot")
        else:
            save(target, generated)
        print(json.dumps({"result": "checked" if args.check else "built", **result["counts"]}))
    except (OSError, ValueError, KeyError, ET.ParseError, zipfile.BadZipFile) as error:
        print(f"Freshwater research import failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
