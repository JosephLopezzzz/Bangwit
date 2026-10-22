"""Local, network-free checks for the research importer and its trust boundaries."""

import copy
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
import xml.etree.ElementTree as ET
import zipfile

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("freshwater", ROOT / "scripts/species/import-freshwater-checklist.py")
freshwater = importlib.util.module_from_spec(spec)
spec.loader.exec_module(freshwater)
NAMESPACE = "http://rs.tdwg.org/dwc/text/"


def fixture(paragraphs=None, license_url=None, orphan_material=False):
    metadata = {
        "key": freshwater.DATASET_KEY,
        "type": "CHECKLIST",
        "title": "Synthetic importer fixture; not a species evidence source",
        "license": license_url or freshwater.CC0,
        "endpoints": [{"type": "DWC_ARCHIVE", "url": freshwater.ARCHIVE_URL}],
    }
    paragraphs = paragraphs or [
        "<p>FAMILY Channidae</p>",
        "<p><i>Channa striata</i> (Bloch, 1793); Native; Found across the Philippines &amp; rivers; study; LC</p>",
        "<p>Channa maculata (Lacepede, 1801); Native; A broad source locality; study; LC</p>",
    ]
    taxon_id, url = "synthetic-family.taxon", "https://treatment.plazi.org/id/synthetic-family"
    rows = {
        "taxa.txt": ("Taxon", ["taxonID", "taxonRank", "canonicalName", "references"],
                     [[taxon_id, "family", "Channidae", url]]),
        "media.txt": ("Document", ["taxonID", "format", "UsageTerms", "additionalInformationURL", "description"],
                      [[taxon_id, "text/html", "Public Domain", url, "<div>" + "".join(paragraphs) + "</div>"]]),
        "distribution.txt": ("Distribution", ["taxonID", "locality"], []),
        "occurrences.txt": ("Occurrence", ["taxonID", "occurrenceID"],
                            [["unjoined-species.taxon", "material-1"]] if orphan_material else []),
    }
    meta = ET.Element("archive", xmlns=NAMESPACE)
    members = {}
    for index, (name, (kind, fields, records)) in enumerate(rows.items()):
        descriptor = ET.SubElement(meta, "core" if index == 0 else "extension", {
            "encoding": "UTF-8", "fieldsTerminatedBy": "\\t", "ignoreHeaderLines": "1",
            "fieldsEnclosedBy": "", "rowType": "http://rs.tdwg.org/dwc/terms/" + kind,
        })
        ET.SubElement(ET.SubElement(descriptor, "files"), "location").text = name
        for position, field in enumerate(fields):
            ET.SubElement(descriptor, "field", index=str(position), term="http://example.test/" + field)
        members[name] = "\n".join("\t".join(record) for record in [fields, *records]) + "\n"
    members["meta.xml"] = ET.tostring(meta)
    members["eml.xml"] = (f'<eml><dataset><citation doi="10.11646/zootaxa.5301.2.1">Synthetic fixture citation</citation>'
                          f'<intellectualRights><ulink url="{freshwater.CC0}"/></intellectualRights></dataset></eml>')
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as archive:
        for name, content in members.items():
            archive.writestr(name, content)
    return freshwater.json_bytes(metadata), buffer.getvalue()


class FreshwaterImportTests(unittest.TestCase):
    def test_preserves_source_claims_without_turning_them_into_local_presence_or_accepted_taxa(self):
        metadata, archive = fixture(orphan_material=True)
        result = freshwater.build(metadata, archive)
        self.assertEqual(result["counts"]["structuredSpeciesRows"], 0)
        self.assertEqual(result["counts"]["materialCitationOrphanReferences"], 1)
        self.assertEqual(result["counts"]["publishedRecords"], 0)
        self.assertEqual([row["candidateName"] for row in result["candidates"]], ["Channa maculata", "Channa striata"])
        for row in result["candidates"]:
            self.assertEqual(row["reviewStatus"], "pending")
            self.assertEqual(row["regionIds"], [])
            self.assertEqual(row["waterbodyIds"], [])
            self.assertIsNone(row["acceptedTaxonId"])
            self.assertIsNone(row["observationDate"])
            self.assertFalse(row["publicationEligible"])
        self.assertIn("Philippines & rivers", result["candidates"][1]["verbatimEntry"])
        self.assertEqual(freshwater.json_bytes(result), freshwater.json_bytes(freshwater.build(metadata, archive)))

    def test_rejects_changed_dataset_rights_endpoint_and_identity(self):
        metadata, archive = fixture()
        original = json.loads(metadata)
        for field, value in [("key", "different-dataset"), ("type", "OCCURRENCE"), ("license", "CC-BY-NC"),
                             ("endpoints", [{"type": "DWC_ARCHIVE", "url": "https://example.test/unreviewed.zip"}])]:
            changed = copy.deepcopy(original)
            changed[field] = value
            with self.subTest(field=field), self.assertRaises(ValueError):
                freshwater.build(freshwater.json_bytes(changed), archive)

    def test_unknown_paragraph_duplicate_name_and_truncated_html_fail_closed(self):
        cases = [
            ["<p>FAMILY Channidae</p>", "<p>An unparsed source row</p>"],
            ["<p>Channa striata; Native; A</p>", "<p>Channa striata; Native; B</p>"],
            ["<p>Channa striata; Native; Unclosed"],
            ["<p>FAMILY Channidae</p>", "Channa striata; Native; Outside paragraphs"],
            ["<p>Channa striata; Native; A</p>", "<li>Channa maculata; Native; Dropped list entry</li>"],
            ["<p>FAMILY Channidae</p>"],
        ]
        for paragraphs in cases:
            with self.subTest(paragraphs=paragraphs), self.assertRaises(ValueError):
                freshwater.build(*fixture(paragraphs))

    def test_source_encoding_damage_is_flagged_not_silently_repaired(self):
        result = freshwater.build(*fixture(["<p>Channa striata (Synthetic \ufffd authority); Native; broad locality</p>"]))
        self.assertEqual(result["counts"]["entriesWithSourceReplacementCharacters"], 1)
        self.assertIn("\ufffd", result["candidates"][0]["recordedName"])
        self.assertIn("source-replacement-character", result["candidates"][0]["reviewFlags"])

    def test_lowercase_authority_particles_do_not_become_part_of_a_species_name(self):
        result = freshwater.build(*fixture(["<p>Schismatogobius bruynisi de Beaufort, 1912; Native; Synthetic context</p>"]))
        candidate = result["candidates"][0]
        self.assertEqual(candidate["candidateName"], "Schismatogobius bruynisi")
        self.assertEqual(candidate["recordedName"], "Schismatogobius bruynisi de Beaufort, 1912")

    def test_failed_refresh_keeps_previous_snapshot_and_receipt(self):
        metadata, archive = fixture()
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            with patch.object(freshwater, "download", side_effect=[(metadata, freshwater.METADATA_URL), (archive, freshwater.ARCHIVE_URL)]):
                freshwater.acquire(output)
            before = {path.name: path.read_bytes() for path in (output / "raw").iterdir()}
            with patch.object(freshwater, "download", side_effect=[(metadata, freshwater.METADATA_URL), (b"not-a-zip", freshwater.ARCHIVE_URL)]):
                with self.assertRaises(zipfile.BadZipFile):
                    freshwater.acquire(output)
            self.assertEqual(before, {path.name: path.read_bytes() for path in (output / "raw").iterdir()})
            freshwater.load_snapshot(output)
            (output / "raw" / freshwater.FILES["archive"]).write_bytes(archive + b"changed")
            with self.assertRaisesRegex(ValueError, "hash/length mismatch"):
                freshwater.load_snapshot(output)

    def test_committed_research_artifact_has_auditable_candidates_and_no_public_or_regional_admission(self):
        result = json.loads((ROOT / "data/research/philippines/freshwater-checklist-candidates.json").read_text(encoding="utf-8"))
        self.assertEqual(result["counts"]["familyTreatments"], 78)
        self.assertEqual(result["counts"]["candidateEntries"], 374)
        self.assertEqual(len(result["candidates"]), 374)
        self.assertEqual(len({row["id"] for row in result["candidates"]}), 374)
        self.assertEqual(len({row["candidateName"] for row in result["candidates"]}), 374)
        self.assertRegex(result["source"]["archiveSha256"], r"^[0-9a-f]{64}$")
        self.assertEqual(result["counts"]["publishedRecords"], 0)
        for row in result["candidates"]:
            self.assertEqual(row["sourceId"], freshwater.SOURCE_ID)
            self.assertFalse(row["publicationEligible"])
            self.assertEqual(row["regionIds"], [])
            self.assertEqual(row["waterbodyIds"], [])


if __name__ == "__main__":
    unittest.main()
