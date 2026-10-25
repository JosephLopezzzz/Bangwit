"""Reconcile Balayan Field Museum records with GBIF flags and accepted WoRMS names."""

import hashlib
import json
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "data" / "research" / "philippines"
RAW_DIR = RESEARCH / "raw" / "calabarzon-balayan-fieldmuseum-source-check-20261025"
INPUTS = {
    "institution": RESEARCH / "calabarzon-balayan-fieldmuseum-source-records-20261025.json",
    "gbif": RESEARCH / "calabarzon-balayan-gbif-record-details-20261025.json",
}
OUTPUT = RESEARCH / "calabarzon-balayan-fieldmuseum-row-decisions-20261025.json"
TAXA = {
    "47041": "Caracanthus unipinna",
    "90961": "Lagocephalus lunaris",
}
GBIF_ISSUE_GUIDANCE = "https://techdocs.gbif.org/en/data-use/occurrence-issues-and-flags"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def fetch_worms(name: str) -> tuple[bytes, dict]:
    encoded = urllib.parse.quote(name)
    url = f"https://www.marinespecies.org/rest/AphiaRecordsByName/{encoded}?like=false&marine_only=false"
    request = urllib.request.Request(
        url,
        headers={"Accept": "application/json", "User-Agent": "Bangwit-research/1.0 (taxonomy cross-check)"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = response.read()
    records = json.loads(payload)
    exact = [item for item in records if (item.get("scientificname") or "").casefold() == name.casefold()]
    accepted = [
        item for item in exact
        if item.get("status") == "accepted"
        and item.get("rank") == "Species"
        and item.get("valid_AphiaID") == item.get("AphiaID")
        and (item.get("valid_name") or "").casefold() == name.casefold()
    ]
    if len(accepted) != 1:
        raise RuntimeError(f"Expected one exact accepted WoRMS species result for {name}; found {len(accepted)}")
    return payload, accepted[0]


def main() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    institution_bytes = INPUTS["institution"].read_bytes()
    gbif_bytes = INPUTS["gbif"].read_bytes()
    institution = json.loads(institution_bytes)
    gbif = json.loads(gbif_bytes)
    records = []

    for catalog, expected_name in TAXA.items():
        direct = next(row for row in institution["records"] if row["catalogNumber"] == catalog)
        occurrence = next(row for row in gbif["records"] if row["catalogNumber"] == catalog)
        if direct["scientificName"].casefold() != expected_name.casefold():
            raise RuntimeError(f"Institution name changed for FMNH catalog {catalog}")
        if direct["occurrenceId"] != occurrence["occurrenceId"]:
            raise RuntimeError(f"GBIF occurrence identity no longer matches FMNH catalog {catalog}")
        if occurrence["acceptedScientificName"].split(" (")[0].casefold() != expected_name.casefold():
            raise RuntimeError(f"GBIF accepted-name mismatch for FMNH catalog {catalog}")

        payload, taxon = fetch_worms(expected_name)
        slug = expected_name.lower().replace(" ", "-")
        raw_path = RAW_DIR / f"worms-{slug}.json"
        raw_path.write_bytes(payload)
        issues = occurrence["issues"]
        issue_notes = []
        if "CONTINENT_COORDINATE_MISMATCH" in issues:
            issue_notes.append({
                "issue": "CONTINENT_COORDINATE_MISMATCH",
                "handling": "Coordinate-derived flag retained; no GBIF coordinate or point is used. The source label's Bay locality remains a textual historical locality only.",
            })
        if "GEODETIC_DATUM_ASSUMED_WGS84" in issues:
            issue_notes.append({
                "issue": "GEODETIC_DATUM_ASSUMED_WGS84",
                "handling": "Coordinate datum warning retained; coordinates are excluded from the review and no map point is admitted.",
            })
        if "INSTITUTION_COLLECTION_MISMATCH" in issues or "INSTITUTION_MATCH_FUZZY" in issues:
            issue_notes.append({
                "issue": "INSTITUTION_COLLECTION_MISMATCH and/or INSTITUTION_MATCH_FUZZY",
                "handling": "GBIF's registry interpretation flags remain visible. The Field Museum-hosted archive independently gives institution FMNH and collection Fishes for this exact catalog number, resolving source-record attribution for this cross-check without deleting the GBIF flags.",
            })
        if "OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT" in issues:
            issue_notes.append({
                "issue": "OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT",
                "handling": "GBIF inferred status from individualCount rather than an explicit occurrenceStatus. Treat the dated preserved specimen as historical collection evidence only, not as a current-presence statement.",
            })

        records.append({
            "catalogNumber": catalog,
            "gbifId": occurrence["gbifId"],
            "occurrenceId": occurrence["occurrenceId"],
            "institutionCode": direct["institutionCode"],
            "collectionCode": direct["collectionCode"],
            "basisOfRecord": direct["basisOfRecord"],
            "sourceName": direct["scientificName"],
            "sourceFamily": direct["family"],
            "acceptedTaxonomy": {
                "scientificName": taxon["scientificname"],
                "authority": taxon["authority"],
                "rank": taxon["rank"],
                "status": taxon["status"],
                "aphiaId": taxon["AphiaID"],
                "validAphiaId": taxon["valid_AphiaID"],
                "taxonUrl": taxon["url"],
                "apiUrl": f"https://www.marinespecies.org/rest/AphiaRecordByAphiaID/{taxon['AphiaID']}? marine_only=false".replace("? ", "?"),
                "exactAcceptedNameMatch": True,
                "rawResponse": {
                    "path": f"raw/calabarzon-balayan-fieldmuseum-source-check-20261025/{raw_path.name}",
                    "sha256": sha256(payload),
                },
            },
            "historicalLocalityEvidence": {
                "year": direct["year"],
                "datePrecision": direct["sourceDatePrecision"],
                "country": direct["country"],
                "province": direct["stateProvince"],
                "sourceLocality": direct["locality"],
                "waterBodyField": direct["waterBody"],
                "sourceLicense": direct["license"],
            },
            "gbifQualityFlags": issues,
            "qualityIssueInterpretations": issue_notes,
            "decision": {
                "researchLedger": "admit-historical-source-locality-evidence",
                "historicalOnly": True,
                "publicAppAdmission": False,
                "mapPointAdmission": False,
                "currentPresenceInferred": False,
                "completeChecklistClaimed": False,
                "reason": "The institution-hosted archive confirms a dated FMNH preserved specimen with Balayan Bay locality text and CC0 terms; the exact species name is accepted in WoRMS and agrees with GBIF. Preserve year-only precision and all GBIF flags. This is eligible as a historical, text-locality research assertion; it does not justify a coordinate, current-presence, or complete-inventory claim. Balayan Bay is outside the current Cavite app pilot, so no public app row is added in this step.",
            },
        })

    input_hashes = {key: sha256(path.read_bytes()) for key, path in INPUTS.items()}
    report = {
        "schemaVersion": 1,
        "title": "Balayan Bay Field Museum row-level historical evidence decisions",
        "reviewedOn": "2026-10-25",
        "institutionSource": institution["archiveUrl"],
        "taxonomyProvider": "World Register of Marine Species (WoRMS)",
        "taxonomyMethod": "Exact AphiaRecordsByName lookup; accepted status, species rank, self-valid AphiaID and exact valid name required.",
        "qualityIssueGuidance": GBIF_ISSUE_GUIDANCE,
        "inputHashes": input_hashes,
        "records": records,
        "summary": {
            "recordsReviewed": len(records),
            "acceptedTaxa": sum(row["acceptedTaxonomy"]["exactAcceptedNameMatch"] for row in records),
            "historicalEvidenceAdmittedToResearchLedger": sum(row["decision"]["researchLedger"] == "admit-historical-source-locality-evidence" for row in records),
            "publicAppRowsAdded": 0,
            "coordinateRowsAdded": 0,
        },
        "decision": {
            "coordinatesIncluded": False,
            "currentPresenceInferred": False,
            "publicAppAdmission": False,
            "completeSpeciesInventoryClaimed": False,
            "interpretation": "Two rows are admitted only as historical source-locality research evidence after direct institutional and accepted-name checks. Their year-only dates and every GBIF quality flag remain visible. Public app and map admission remain false because the pilot is Cavite, these records are from Balayan Bay in Batangas, and coordinate-derived fields are not trusted here.",
        },
    }
    OUTPUT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print("Row decisions: 2 historical research assertions admitted; 0 public rows or map points added.")


if __name__ == "__main__":
    main()
