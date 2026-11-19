import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const researchRoot = "data/research/philippines";
const rawDirectory = "raw/pantabangan-ncbi-sequence-search-20261119";
const rawAbsoluteDirectory = path.join(root, researchRoot, rawDirectory);
const rawPath = path.join(rawAbsoluteDirectory, "pantabangan-all-41-records.gb");
const receiptPath = path.join(rawAbsoluteDirectory, "receipt.json");
const outputPath = path.join(
  root,
  researchRoot,
  "national/reviews/central-luzon-pantabangan-ncbi-accession-review-20261119.json",
);
const sha256 = (contents) => createHash("sha256").update(contents).digest("hex");
const normalize = (value) => value?.replace(/\s+/g, " ").trim() ?? null;

function qualifier(record, name) {
  const expression = new RegExp(`/${name}="([\\s\\S]*?)"`);
  return normalize(record.match(expression)?.[1]);
}

function referenceField(record, field) {
  const expression = new RegExp(`\\n\\s{2}${field}\\s+([\\s\\S]*?)(?=\\n\\s{2}(?:JOURNAL|PUBMED|REMARK)|$)`);
  return normalize(record.match(expression)?.[1]);
}

function parseRecord(record) {
  const reference = record.match(/REFERENCE\s+1[\s\S]*?(?=\nREFERENCE\s+2|\nFEATURES)/)?.[0] ?? "";
  const definition = normalize(record.match(/^DEFINITION\s+([\s\S]*?)(?=\nACCESSION)/m)?.[1]);
  const location = qualifier(record, "geo_loc_name");
  return {
    accession: record.match(/^VERSION\s+(\S+)/m)?.[1] ?? null,
    submittedName: normalize(record.match(/^  ORGANISM\s+([^\r\n]+)/m)?.[1]),
    definition,
    voucher: qualifier(record, "specimen_voucher"),
    geoLocName: location,
    collectionDate: qualifier(record, "collection_date"),
    boldCrossReference: [...record.matchAll(/\/db_xref="(BOLD:[^"]+)"/g)].map((match) => match[1])[0] ?? null,
    projectReferenceTitle: referenceField(reference, "TITLE"),
    directSubmissionDate: reference.match(/JOURNAL\s+Submitted \(([^)]+)\)/)?.[1] ?? null,
    directWaterbodyText: location?.includes("Pantabangan Dam") ?? false,
  };
}

const raw = readFileSync(rawPath);
const receiptBytes = readFileSync(receiptPath);
const receipt = JSON.parse(receiptBytes.toString("utf8"));
const records = raw
  .toString("utf8")
  .split(/^LOCUS\s+/m)
  .slice(1)
  .map((record) => `LOCUS ${record}`);
const parsed = records.map(parseRecord);
const datasetTitle = "DNA barcoding of commercially-important fish species in Pantabangan Dam, Nueva Ecija Philippines";
const fishRecords = parsed
  .filter((record) => record.projectReferenceTitle === datasetTitle && record.definition?.includes("COI"))
  .sort((a, b) => a.accession.localeCompare(b.accession));
const excludedMatches = parsed
  .filter((record) => !fishRecords.some((fish) => fish.accession === record.accession))
  .map(({ accession, submittedName, definition, projectReferenceTitle }) => ({
    accession,
    submittedName,
    definition,
    projectReferenceTitle,
    disposition: "Excluded from the fish-project subset because the NCBI result is not linked to the Pantabangan fish-project reference title.",
  }));
const bySpecies = Map.groupBy(fishRecords, (record) => record.submittedName);
const species = [...bySpecies.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, rows]) => ({
    submittedName: name,
    accessionCount: rows.length,
    accessions: rows.map((row) => row.accession),
    specimenVouchers: rows.map((row) => row.voucher),
    collectionDates: [...new Set(rows.map((row) => row.collectionDate))].sort(),
    geoLocNames: [...new Set(rows.map((row) => row.geoLocName))].sort(),
    recordsWithExplicitPantabanganDamLocality: rows.filter((row) => row.directWaterbodyText).length,
  }));

if (records.length !== Number(receipt.reportedCount)) {
  throw new Error(`NCBI retrieval count mismatch: receipt=${receipt.reportedCount}, records=${records.length}`);
}
if (fishRecords.length !== 40 || species.length !== 9) {
  throw new Error(`Expected 40 project records and 9 names, got ${fishRecords.length} records and ${species.length} names`);
}

const review = {
  schemaVersion: 1,
  reviewId: "central-luzon-pantabangan-ncbi-accession-review-20261119",
  reviewedOn: receipt.retrievedOn,
  phaseId: "L3",
  regionId: "0300000000",
  regionName: "Region III (Central Luzon)",
  waterbodyNames: ["Pantabangan Dam", "Pantabangan Reservoir", "Pantabangan Lake"],
  status: "historical-NCBI-COI-accessions-retrieved;2013-project-and-2026-paper-crosswalk-unverified;research-only",
  question: "Do public NCBI sequence records provide specimen metadata for the Pantabangan fish-barcode lead, and are they demonstrably the accessions used by the 2026 journal article?",
  sourceIds: [
    "pantabangan-2013-fish-coi-submission-ncbi",
    "pantabangan-dam-dna-fish-inventory-2026",
  ],
  inputs: [
    "data/research/philippines/central-luzon-pantabangan-source-reconciliation-20261024.json",
  ],
  query: {
    database: receipt.database,
    term: receipt.query,
    searchUrl: receipt.searchUrl,
    searchHttpStatus: receipt.httpStatus,
    searchResultCount: Number(receipt.reportedCount),
    retrievalUrl: receipt.fetchUrl,
    retrievalHttpStatus: receipt.fetchHttpStatus,
    method: "NCBI E-utilities Nucleotide search with Pantabangan[All Fields], followed by GenBank-format retrieval for all returned NCBI record IDs. A fish-project subset was identified by the exact GenBank REFERENCE 1 title, not by locality text alone.",
    limitations: [
      "The text search is a discovery query, not a spatial or validated waterbody filter.",
      "The GenBank project title alone is not used as a substitute for row-level geo_loc_name; one fish record is only localized to Nueva Ecija.",
      "The EFetch file contains nucleotide sequences and is retained only in the ignored local raw directory; no sequence strings are embedded in this review.",
    ],
  },
  rawSnapshot: {
    directory: rawDirectory,
    files: [
      {
        path: "pantabangan-all-41-records.gb",
        sha256: sha256(raw),
        bytes: raw.byteLength,
      },
      {
        path: "receipt.json",
        sha256: sha256(receiptBytes),
        bytes: receiptBytes.byteLength,
      },
    ],
    gitIgnored: true,
  },
  findings: {
    retrieval: {
      nucleotideSearchMatches: records.length,
      fishProjectRecords: fishRecords.length,
      distinctSubmittedNames: species.length,
      recordsWithExplicitPantabanganDamLocality: fishRecords.filter((record) => record.directWaterbodyText).length,
      recordsOnlyLocalizedToNuevaEcija: fishRecords.filter((record) => record.geoLocName === "Philippines: Nueva Ecija").map((record) => record.accession),
      excludedIndexMatches: excludedMatches,
      sourceSubmissionTitle: datasetTitle,
      sequenceSubmissionDates: [...new Set(fishRecords.map((record) => record.directSubmissionDate))].sort(),
      taxonSummaries: species,
      accessionRecords: fishRecords,
      specimenVoucherFields: "NCBI GenBank source qualifiers; voucher identifiers are submitted metadata, not independently verified museum catalogues.",
      coordinates: "No latitude/longitude qualifier was returned for the fish-project records.",
    },
    comparisonWith2026Article: {
      doi: "10.1080/24701394.2026.2631395",
      articleAbstractReportedCounts: { coiSequences: 40, species: 9 },
      ncbiPriorSubmissionCounts: { records: fishRecords.length, distinctSubmittedNames: species.length },
      aggregateCountsAlign: true,
      abstractNameOverlap: [
        "Leiopotherapon plumbeus",
        "Glossogobius aureus",
        "Clarias batrachus",
        "Coptodon zillii",
        "Micropterus floridanus (NCBI annotation: Micropterus salmoides floridanus)",
      ],
      additionalNamesInPriorNCBISetNotVisibleInAbstract: [
        "Trichopodus trichopterus",
        "Oreochromis niloticus",
        "Cyprinus carpio",
        "Channa striata",
      ],
      interpretation: "The matching 40-record/nine-name totals, shared names, and overlapping authors/title are a strong discovery lead, but the abstract does not expose sequence accessions. The NCBI records cite an unpublished project submitted in 2013, before the journal article was received in 2025. This review cannot establish that the NCBI records are the exact set analyzed in the 2026 article; keep the datasets linked only as a crosswalk question.",
    },
    disposition: "Historical accession-level evidence for an NCBI-submitted Pantabangan fish-barcode project. The 39 explicitly waterbody-localized records and one province-only fish record remain research-only; no species app assertion, sequence redistribution, diet statement, abundance estimate, current-presence claim, or regional release is approved.",
    reuse: "Public NCBI sequence records were retrieved for research review. No separate determination of application redistribution rights was made. Keep nucleotide sequences local and ignored; require taxonomy, source-lineage, and reuse review before any public projection.",
  },
  appUse: {
    speciesAssertionsAdded: 0,
    sequenceDataPublished: false,
    geometryAdded: false,
    publicChecklistChanged: false,
    regionalReleaseApproved: false,
  },
  nextStep: "Obtain or locate the full 2026 article/supplement and compare its accession table to the 2013 NCBI submissions. Keep the source datasets separate until an exact crosswalk is documented; then review current taxonomy and reuse terms before deciding on any public species record.",
};

writeFileSync(outputPath, `${JSON.stringify(review, null, 2)}\n`);
console.log(`Review written: ${path.relative(root, outputPath)}`);
console.log(`NCBI hits: ${records.length}; fish project accessions: ${fishRecords.length}; names: ${species.length}`);
console.log(`Explicit Pantabangan Dam locality: ${review.findings.retrieval.recordsWithExplicitPantabanganDamLocality}; province-only: ${review.findings.retrieval.recordsOnlyLocalizedToNuevaEcija.length}`);
