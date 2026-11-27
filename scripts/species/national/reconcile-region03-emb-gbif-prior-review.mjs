import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const screenPath = "data/research/philippines/national/reviews/central-luzon-emb-river-colxr-occurrence-screen-20261127.json";
const rawDirectory = "data/research/philippines/raw/national/region03-emb-river-colxr-screen-20261127";
const priorReviews = [
  "data/research/philippines/national/reviews/central-luzon-angat-river-bpc001-13-record-review-20261119.json",
  "data/research/philippines/national/reviews/central-luzon-angat-river-aac5247-bin-membership-review-20261119.json",
  "data/research/philippines/national/reviews/central-luzon-angat-bpc001-13-georeference-plausibility-20261119.json",
];
const reportPath = "data/research/philippines/national/reviews/central-luzon-emb-river-gbif-prior-review-reconciliation-20261127.json";
const expectedHashes = new Map([
  [screenPath, "22c6792f2314743d216c4056f794330047eee5e29ace669b5bf0e55dc11a9542"],
  [priorReviews[0], "c132c6cd723cb27f78609f72c24cd6a4e448a2b35dd350aa5eada1eee27bb677"],
  [priorReviews[1], "ff29abafeabf37640160ec53701f918fc1d62dccd1c0471360586ec1b8f0c08e"],
  [priorReviews[2], "2dc6d944fe6704fab9b1f011b772c666b68a425cbe3c218f026d51c42b412872"],
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function readPinnedJson(path) {
  const bytes = await readFile(resolve(root, path));
  const actualHash = sha256(bytes);
  const expectedHash = expectedHashes.get(path);
  if (expectedHash && actualHash !== expectedHash) throw new Error(`Pinned input changed: ${path}`);
  return { bytes, hash: actualHash, value: JSON.parse(bytes.toString("utf8")) };
}

async function writeImmutable(path, bytes) {
  const absolute = resolve(root, path);
  try {
    const existing = await readFile(absolute);
    if (existing.equals(bytes)) return;
    throw new Error(`Refusing to overwrite changed research snapshot: ${path}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await mkdir(dirname(absolute), { recursive: true });
  await writeFile(absolute, bytes, { flag: "wx" });
}

const screenInput = await readPinnedJson(screenPath);
const [recordInput, binInput, georeferenceInput] = await Promise.all(priorReviews.map(readPinnedJson));
const screen = screenInput.value;
const recordReview = recordInput.value;
const binReview = binInput.value;
const georeferenceReview = georeferenceInput.value;
if (screen.reviewId !== "central-luzon-emb-river-colxr-occurrence-screen-20261127") throw new Error("Unexpected GBIF screen input.");
if (screen.results?.embLabelsScreened !== 14 || screen.queries?.length !== 31) throw new Error("Unexpected screen scope or query count.");

const positiveQueries = screen.queries.filter((query) => !query.coordinatesRequired && query.count > 0);
const coordinateFollowups = screen.queries.filter((query) => query.coordinatesRequired && query.count > 0);
if (positiveQueries.length !== 1 || coordinateFollowups.length !== 1) throw new Error("Expected one text hit and one coordinate-required follow-up.");

const positiveRows = [];
for (const query of [...positiveQueries, ...coordinateFollowups]) {
  const rawPath = `${rawDirectory}/${query.rawFile}`;
  const bytes = await readFile(resolve(root, rawPath));
  if (sha256(bytes) !== query.responseSha256) throw new Error(`Raw response hash mismatch: ${rawPath}`);
  const response = JSON.parse(bytes.toString("utf8"));
  if (response.results?.length !== 1) throw new Error(`Expected one retained sample row: ${rawPath}`);
  positiveRows.push({ rawPath, hash: sha256(bytes), row: response.results[0] });
}

const uniqueRows = new Map();
for (const item of positiveRows) {
  const row = item.row;
  const identity = `${row.datasetKey}:${row.key}`;
  if (!row.key || !row.datasetKey || !row.occurrenceID) throw new Error("Sample lacks a stable occurrence identity.");
  const existing = uniqueRows.get(identity);
  if (existing && (existing.row.occurrenceID !== row.occurrenceID || existing.row.scientificName !== row.scientificName)) {
    throw new Error(`Conflicting sample rows for ${identity}`);
  }
  if (!existing) uniqueRows.set(identity, item);
}
if (uniqueRows.size !== 1) throw new Error(`Expected one unique occurrence, received ${uniqueRows.size}.`);

const occurrence = [...uniqueRows.values()][0].row;
const retrieval = recordReview.retrieval;
const sourceChain = recordReview.recordAssessment?.originalSourceChain;
const binTarget = binReview.findings?.targetRecord;
if (
  String(occurrence.key) !== String(retrieval.occurrenceKey) ||
  occurrence.datasetKey !== retrieval.datasetKey ||
  occurrence.occurrenceID !== sourceChain?.boldProcessId ||
  occurrence.scientificName !== sourceChain?.boldBin ||
  occurrence.verbatimIdentification !== sourceChain?.boldIdentification ||
  occurrence.occurrenceID !== binTarget?.processId ||
  occurrence.scientificName !== binTarget?.matchingBin ||
  !georeferenceReview.inputs.includes(priorReviews[0]) ||
  !georeferenceReview.inputs.includes(priorReviews[1])
) throw new Error("The GBIF sample does not match all three pinned prior reviews.");

const report = {
  schemaVersion: 1,
  reviewId: "central-luzon-emb-river-gbif-prior-review-reconciliation-20261127",
  checkedOn: "2026-11-27",
  phaseId: "L3",
  regionId: "0300000000",
  regionName: "Region III (Central Luzon)",
  status: "two-positive-query-variants-deduplicated-to-previously-reviewed-specimen-chain;taxonomy-and-exact-reach-unresolved;research-only",
  question: "Does the positive Angat River hit from the 2026-11-27 GBIF screen represent a new record, or the specimen already reviewed on 2026-11-19?",
  sourceIds: [...new Set([
    "gbif-occurrence-downloads",
    ...recordReview.sourceIds,
    ...binReview.sourceIds,
    ...georeferenceReview.sourceIds,
  ])],
  inputs: {
    [screenPath]: { sha256: screenInput.hash, queryCount: screen.queries.length },
    [priorReviews[0]]: { sha256: recordInput.hash, reviewId: recordReview.reviewId },
    [priorReviews[1]]: { sha256: binInput.hash, reviewId: binReview.reviewId },
    [priorReviews[2]]: { sha256: georeferenceInput.hash, reviewId: georeferenceReview.reviewId },
    [`${rawDirectory}/01-locality-angat-river-all.json`]: { sha256: positiveRows[0].hash, gitIgnored: true },
    [`${rawDirectory}/02-locality-angat-river-coordinates.json`]: { sha256: positiveRows[1].hash, gitIgnored: true },
  },
  reconciliation: {
    labelsScreened: screen.results.embLabelsScreened,
    nonCoordinatePositiveQueryVariants: positiveQueries.length,
    coordinateRequiredPositiveFollowups: coordinateFollowups.length,
    retainedPositiveSampleRows: positiveRows.length,
    uniqueOccurrenceIdentities: uniqueRows.size,
    matchedPriorRecordReviews: 1,
    sameSpecimenChainAcrossGbifBoldAndGenBank: true,
    independentNewOccurrenceEvidence: false,
    matchedOccurrenceKey: String(occurrence.key),
    matchedDatasetKey: occurrence.datasetKey,
    matchedOccurrenceId: occurrence.occurrenceID,
    gbifIndexedName: occurrence.scientificName,
    originalSourceIdentification: occurrence.verbatimIdentification,
    previousRecordReview: {
      path: priorReviews[0],
      status: recordReview.status,
      identityDecision: recordReview.decision.classification,
      sourceChainAssessment: sourceChain.linkageAssessment,
      taxonomyAssessment: recordReview.recordAssessment.taxonomicCrosscheck.interpretation,
    },
    previousBinReview: {
      path: priorReviews[1],
      status: binReview.status,
      speciesCrosswalkResolved: binReview.decision.taxonomicCrosswalkResolved,
      interpretation: binReview.findings.interpretation,
    },
    previousGeoreferenceReview: {
      path: priorReviews[2],
      status: georeferenceReview.status,
      exactNamedReachIdentity: georeferenceReview.findings.exactNamedReachIdentity,
      coordinateUncertainty: georeferenceReview.findings.sourceCoordinateUncertainty,
      disposition: georeferenceReview.decision.disposition,
    },
  },
  decision: {
    newSpeciesAssertionAdded: false,
    newOccurrenceAdded: false,
    newGeometryAdded: false,
    publicAppProjection: false,
    publicationApproval: false,
    interpretation: "The new GBIF screen rediscovered the same BPC001-13/ANAd1 source specimen already reviewed on 2026-11-19. Its GBIF and coordinate-required query variants are not independent records, and the BOLD/GenBank entries are linked representations of the same specimen/sequence. Preserve the source-reported Arius dispar identification as a held label; the BOLD BIN and GBIF taxonomic mapping do not settle the species. The prior spatial review supports coarse plausibility but does not establish coordinate precision or an exact named reach.",
  },
  nextAction: "Continue seeking a curator-reviewed determination for the linked specimen and independent support for exact Angat River reach identity; do not duplicate this hit as new evidence or promote it to the app.",
};

const reportBytes = Buffer.from(`${JSON.stringify(report, null, 2)}\n`, "utf8");
await writeImmutable(reportPath, reportBytes);
console.log(`Reconciled ${positiveRows.length} positive query samples to ${uniqueRows.size} unique occurrence and one prior record-review chain.`);
console.log(`No new species, occurrence, geometry, or app row; report: ${reportPath}`);
