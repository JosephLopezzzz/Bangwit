import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const checklistKey = "7ddf754f-d193-4cc9-b351-99906754a03b";
const endpoint = "https://api.gbif.org/v2/species/match";
const metadataUrl = `${endpoint}/metadata?checklistKey=${checklistKey}`;
const parentReviewPath = "data/research/philippines/national/reviews/ncr-scssap-lppwp-tmtp-fish-list-scope-review-20261120.json";
const reviewId = "ncr-scssap-lppwp-tmtp-taxonomy-crosswalk-20261120";
const outputPath = path.join(root, "data/research/philippines/national/reviews", `${reviewId}.json`);
const rawDir = path.join(root, "data/research/philippines/raw/national/scssap-lppwp-tmtp-colxr-20261120");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// Transcribed from the fish sections of Tables 4.E.1 and 4.F.1. Keep source
// family/name strings verbatim; the matcher is a nomenclature screen only.
const sourceEntries = [
  ...[
    ["Ambassidae", "Ambassis gymnocephalus"],
    ["Carangidae", "Caranx sp."],
    ["Carangidae", "Selaroides leptolepis"],
    ["Carangidae", "Scomberoides sp."],
    ["Cichlidae", "Sarotherodon melanotheron"],
    ["Dorosomatidae", "Sardinela sp."],
    ["Dorosomatidae", "Nematalosa nasus"],
    ["Elopidae", "Elops saurus"],
    ["Gerridae", "Gerres filamentosus"],
    ["Gobiidae", "Amblygobius sp."],
    ["Hemiramphidae", "Hemiramphus sp."],
    ["Leiognathidae", "Leignathus sp."],
    ["Megalopidae", "Megalops cyprinoides"],
    ["Mugilidae", "Crenimugil seheli"],
    ["Mugilidae", "Mugil cephalus"],
    ["Mugilidae", "Ellochelon vaigiensis"],
    ["Osphronemidae", "Trichopodus trichopterus"],
    ["Serranidae", "Epinephelus sp."],
    ["Terapontidae", "Pelates quadrilineatus"],
    ["Tetraodontidae", "Arothron sp."],
  ].map(([familyAsPrinted, nameAsPrinted]) => ({ site: "LPPWP", table: "4.E.1", familyAsPrinted, nameAsPrinted })),
  ...[
    ["Ambassidae", "Ambassis gymnocephalus"],
    ["Ambassidae", "Ambassis sp. 1"],
    ["Ambassidae", "Ambassis sp. 2"],
    ["Ambassidae", "Ambassis marianus"],
    ["Anguillidae", "Anguilla marmorata"],
    ["Carangidae", "Carangoides armatus"],
    ["Carangidae", "Caranx sp."],
    ["Carangidae", "Scomberoides sp."],
    ["Chanidae", "Chanos chanos"],
    ["Cichlidae", "Sarotherodon melanotheron"],
    ["Cynoglossidae", "Paraplagusia sp."],
    ["Cyprinidae", "Tor tambroides"],
    ["Dorosomatidae", "Saurida tumbil"],
    ["Dorosomatidae", "Anodontostoma sp."],
    ["Dorosomatidae", "Sardinella fimbriata"],
    ["Dorosomatidae", "Sardinella sp."],
    ["Dorosomatidae", "Nematalosa nasus"],
    ["Echeneidae", "Remora remora"],
    ["Elopidae", "Elops hawaiensis"],
    ["Gerridae", "Gerres filamentosus"],
    ["Gerridae", "Gerres"],
    ["Gobiidae", "Amblygobius sp. 1"],
    ["Gobiidae", "Ambyglobius sp. 2"],
    ["Gobiidae", "Ambyglobius sp. 3"],
    ["Gobiidae", "Glossogobius aureus"],
    ["Gobiidae", "Oxyurichthys microlepis"],
    ["Haemulidae", "Pomadasys kaakan"],
    ["Hemiramphidae", "Hyporhampus sp."],
    ["Latidae", "Lates sp."],
    ["Leiognathidae", "Leignathus sp."],
    ["Leiognathidae", "Leiognathus equula"],
    ["Leiognathidae", "Eubleekeria splendens"],
    ["Megalopidae", "Megalops cyprinoides"],
    ["Mugilidae", "Crenimugil seheli"],
    ["Mugilidae", "Mugil cephalus"],
    ["Nemipteridae", "Nemipterus japonicus"],
    ["Platycephalidae", "Platycephalus sp. 1"],
    ["Platycephalidae", "Platycephalus indicus"],
    ["Platycephalidae", "Platycephalus sp. 2"],
    ["Pleuronectiformes", "Pleuronectiformes sp."],
    ["Polynemidae", "Eleutheronema tetradactylum"],
    ["Scatophagidae", "Scatophagus argus"],
    ["Sciaenidae", "Johnius belangerii"],
    ["Scombridae", "Rastrelliger brachysoma"],
    ["Serranidae", "Epinephelus sp."],
    ["Siganidae", "Siganus spp."],
    ["Sillaginidae", "Sillago sihama"],
    ["Sphyraenidae", "Sphyraena sp."],
    ["Terapontidae", "Terapon jarbua"],
    ["Terapontidae", "Pelates quadrilineatus"],
    ["Tetraodontidae", "Arothron sp."],
    ["Triacanthidae", "Trixiphichthys weberi"],
  ].map(([familyAsPrinted, nameAsPrinted]) => ({ site: "TMTP", table: "4.F.1", familyAsPrinted, nameAsPrinted })),
];

assert.equal(sourceEntries.filter((entry) => entry.site === "LPPWP").length, 20);
assert.equal(sourceEntries.filter((entry) => entry.site === "TMTP").length, 52);
assert.equal(sourceEntries.length, 72);

function isBinomial(name) {
  return /^[A-Z][a-z-]+ [a-z][a-z-]+$/.test(name);
}

function validateMetadata(body) {
  assert.equal(body?.mainIndex?.datasetKey, checklistKey);
  assert.ok(body.mainIndex?.datasetAlias);
  assert.ok(body.created && body.buildInfo?.sha);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "Bangwit research taxonomy crosswalk/1.0" },
    signal: AbortSignal.timeout(30000),
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!response.ok) throw new Error(`GBIF taxonomy service returned HTTP ${response.status}`);
  return { text: bytes.toString("utf8"), bytes };
}

async function storeRaw(name, bytes) {
  const pathInRaw = path.join(rawDir, name);
  await mkdir(path.dirname(pathInRaw), { recursive: true });
  await writeFile(pathInRaw, bytes);
  return {
    path: path.relative(root, pathInRaw).replaceAll("\\", "/"),
    sha256: sha256(bytes),
  };
}

function familyFor(body) {
  return body.classification?.find((taxon) => taxon.rank === "FAMILY")?.name ?? null;
}

function classify(name, body) {
  const usage = body.usage ?? null;
  const type = body.diagnostics?.matchType ?? "NONE";
  if (!usage || type === "NONE") return "no-match";
  if (type !== "EXACT") return `candidate-${type.toLowerCase()}`;
  if (usage.rank !== "SPECIES") return "exact-higher-rank";
  if (usage.status === "SYNONYM" || body.synonym === true) return "exact-synonym";
  if (usage.status === "ACCEPTED" && usage.canonicalName?.toLowerCase() === name.toLowerCase())
    return "exact-accepted-name";
  return "exact-status-review";
}

await mkdir(rawDir, { recursive: true });
const parentReviewBytes = await readFile(path.join(root, parentReviewPath));
const parentReviewHash = sha256(parentReviewBytes);
const startMetadata = await fetchJson(metadataUrl);
const startBody = JSON.parse(startMetadata.text);
validateMetadata(startBody);
const startReceipt = await storeRaw("service-metadata-start.json", startMetadata.bytes);

const eligibleNames = [...new Set(sourceEntries.map((entry) => entry.nameAsPrinted).filter(isBinomial))].sort();
const responseByName = new Map();
for (const [index, name] of eligibleNames.entries()) {
  const url = new URL(endpoint);
  url.searchParams.set("scientificName", name);
  url.searchParams.set("checklistKey", checklistKey);
  url.searchParams.set("kingdom", "Animalia");
  const result = await fetchJson(url);
  const body = JSON.parse(result.text);
  const usage = body.usage ?? null;
  const safeName = sha256(name).slice(0, 16);
  const raw = await storeRaw(`matches/${safeName}.json`, result.bytes);
  responseByName.set(name, {
    queriedName: name,
    queryUrl: url.toString(),
    queryParameters: { scientificName: name, checklistKey, kingdom: "Animalia" },
    matchType: body.diagnostics?.matchType ?? null,
    confidence: body.diagnostics?.confidence ?? null,
    classification: classify(name, body),
    usage: usage ? {
      key: usage.key,
      scientificName: usage.name ?? null,
      canonicalName: usage.canonicalName ?? null,
      rank: usage.rank ?? null,
      status: usage.status ?? null,
      authorship: usage.authorship ?? null,
    } : null,
    acceptedUsage: body.acceptedUsage ? {
      key: body.acceptedUsage.key,
      scientificName: body.acceptedUsage.name ?? null,
      canonicalName: body.acceptedUsage.canonicalName ?? null,
      rank: body.acceptedUsage.rank ?? null,
      status: body.acceptedUsage.status ?? null,
    } : null,
    matchedFamily: familyFor(body),
    sourceFamilyLabels: [...new Set(sourceEntries.filter((entry) => entry.nameAsPrinted === name).map((entry) => entry.familyAsPrinted))],
    rawResponse: raw,
  });
  if (index < eligibleNames.length - 1) await delay(200);
}

const endMetadata = await fetchJson(metadataUrl);
const endBody = JSON.parse(endMetadata.text);
validateMetadata(endBody);
const endReceipt = await storeRaw("service-metadata-end.json", endMetadata.bytes);
const indexStable = startReceipt.sha256 === endReceipt.sha256;

const rows = sourceEntries.map((entry, index) => {
  const match = responseByName.get(entry.nameAsPrinted) ?? null;
  const familyMatches = match?.matchedFamily
    ? match.matchedFamily.toLowerCase() === entry.familyAsPrinted.toLowerCase()
    : null;
  return {
    sourceRow: index + 1,
    site: entry.site,
    table: entry.table,
    familyAsPrinted: entry.familyAsPrinted,
    nameAsPrinted: entry.nameAsPrinted,
    lookupStatus: match ? match.classification : "not-queried-non-binomial-source-label",
    nameMatchQuery: match?.queriedName ?? null,
    matchedFamily: match?.matchedFamily ?? null,
    sourceFamilyExactTextMatch: familyMatches,
  };
});
const uniqueMatches = [...responseByName.values()];
const artifact = {
  schemaVersion: 1,
  reviewId,
  reviewedOn: "2026-11-20",
  phaseId: "L2",
  regionId: "1300000000",
  regionName: "National Capital Region (NCR)",
  status: indexStable ? "col-xr-name-match-screen-complete;source-row-preservation;identification-unverified;research-only" : "col-xr-index-changed-during-screen;review-required;research-only",
  question: "How do the source-printed fish names and family labels in the LPPWP/TMTP tables compare with the pinned Catalogue of Life XR match service, without changing source spellings or treating matches as specimen identification?",
  sourceIds: ["scssap-ph-ecosystems-ch4-lppwp-tmtp-2026", "gbif-col-xr-taxonomy-matching"],
  inputs: [parentReviewPath],
  snapshotHashes: { parentSourceReview: parentReviewHash },
  sourceAccess: {
    endpoint,
    metadataUrl,
    checklistKey,
    checklistAlias: startBody.mainIndex.datasetAlias,
    buildSha: startBody.buildInfo.sha,
    indexCreated: startBody.created,
    indexStableDuringQueries: indexStable,
    metadataStartReceipt: startReceipt,
    metadataEndReceipt: endReceipt,
    responseCapture: "Each unique source-printed binomial was queried once. Generic, numbered sp., plural spp., missing-epithet, and higher-rank strings were not sent as species names. Raw API JSON bytes are local-only snapshots; hashes and paths are recorded below.",
  },
  method: {
    summary: "Preserved all 72 site-table fish rows and their printed family/name strings. Deduplicated only exact name strings for the GBIF v2 matcher, queried against the explicit Catalogue of Life XR checklist, and compared the returned family string with the family printed in each row.",
    classifier: "An exact accepted species-name match is a nomenclatural candidate only. Fuzzy matches, synonyms, higher-rank matches, no-matches, and family-text differences remain unresolved. No source text was corrected.",
    limitations: [
      "The Catalogue of Life XR match service is one automated taxonomic resource; it is not an independent second authority or fish-specimen determination.",
      "No key, specimen photograph, voucher, diagnostic description, or author confirmation was available to verify the underlying field identifications.",
      "A family name returned by the matcher is a name-level comparison only; family disagreement does not prove the source's fish was identified incorrectly.",
      "No geographic, habitat, native-range, or occurrence inference is made from a taxon-name match.",
    ],
  },
  sourceRowCounts: { LPPWP: 20, TMTP: 52, total: rows.length },
  matchCounts: {
    uniqueSourceStrings: new Set(sourceEntries.map((entry) => entry.nameAsPrinted)).size,
    uniqueBinomialsQueried: eligibleNames.length,
    exactAcceptedNameMatches: uniqueMatches.filter((item) => item.classification === "exact-accepted-name").length,
    exactSynonymMatches: uniqueMatches.filter((item) => item.classification === "exact-synonym").length,
    fuzzyOrOtherCandidates: uniqueMatches.filter((item) => item.classification.startsWith("candidate-") || item.classification === "exact-status-review" || item.classification === "exact-higher-rank").length,
    noMatch: uniqueMatches.filter((item) => item.classification === "no-match").length,
    familyTextMismatches: rows.filter((row) => row.sourceFamilyExactTextMatch === false).length,
    nonBinomialRowsNotQueried: rows.filter((row) => row.lookupStatus === "not-queried-non-binomial-source-label").length,
    allPendingBiologicalIdentificationReview: true,
  },
  uniqueNameMatches: uniqueMatches,
  sourceRows: rows,
  interpretation: {
    exactMatchedNames: "Current name-service agreement does not prove the source authors correctly identified a fish, nor does it establish presence at either park.",
    familyMismatches: "Printed family names differ from matcher lineage in some rows. Retain the source family verbatim and investigate these cases against the underlying study and independent ichthyological authority.",
    distributionAndHabitat: "Do not transfer marine/brackish taxonomy matches to a locality checklist; any geographic or habitat outlier must be reviewed independently using specimen and site evidence.",
    publication: "All matches remain internal research proposals; neither this screen nor the parent project chapter has item-specific redistribution clearance.",
  },
  decision: {
    speciesAssertionsAdded: 0,
    occurrenceRowsAdded: 0,
    acceptedNamesAppliedToSourceRows: 0,
    familyLabelsCorrected: 0,
    waterbodyAssignmentsAdded: 0,
    geometryAdded: false,
    publicAppProjection: false,
    publicationApproval: false,
    regionalBaselineComplete: false,
    reason: "The matcher supports candidate name status only. Family conflicts, source spellings, generic/higher-rank labels, undocumented methods and missing voucher evidence prevent biological identification decisions; all 72 original rows remain unchanged and research-only.",
  },
  nextActions: [
    "Independently check exact accepted-name candidates and all family conflicts against Eschmeyer's Catalog of Fishes and relevant specialist marine taxonomy resources; do not use the GBIF matcher as its own independent verification.",
    "Seek the underlying Ancog et al. report, specimen/voucher basis, and author clarification for source strings such as Sardinela, Leignathus, Ambyglobius, Hyporhampus, Gerres, and Pleuronectiformes sp.",
    "Review apparent habitat or geographic outliers (including Tor tambroides in the TMTP table and Elops saurus at LPPWP) only against source vouchers, sampling context, and authoritative distribution evidence.",
    "Keep all names and densities research-only until exact site/locality evidence, identification basis, date, method, and reuse terms are established.",
  ],
  sources: [
    { url: "https://api.gbif.org/v2/species/match", supports: "Automated name matching against the explicit Catalogue of Life XR checklist; raw requests and responses are pinned in local-only research snapshots." },
    { url: "https://techdocs.gbif.org/en/data-processing/taxonomy-interpretation", supports: "GBIF documentation for interpreting taxonomic matches; automated matches require review and do not establish occurrence." },
    { url: "https://scssap.org/library/publications/871-ch4-ecosystems-v20260103-1/file", supports: "Source rows transcribed from Table 4.E.1 and Table 4.F.1, preserving printed spellings and family strings." },
  ],
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  review: path.relative(root, outputPath).replaceAll("\\", "/"),
  indexStable,
  rows: rows.length,
  uniqueNames: artifact.matchCounts.uniqueSourceStrings,
  binomialQueries: eligibleNames.length,
  exactAccepted: artifact.matchCounts.exactAcceptedNameMatches,
  familyMismatches: artifact.matchCounts.familyTextMismatches,
  nonBinomialRows: artifact.matchCounts.nonBinomialRowsNotQueried,
}, null, 2));
