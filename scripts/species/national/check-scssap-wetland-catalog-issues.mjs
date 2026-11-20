import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const parentCrosswalkPath = "data/research/philippines/national/reviews/ncr-scssap-lppwp-tmtp-taxonomy-crosswalk-20261120.json";
const parentScopePath = "data/research/philippines/national/reviews/ncr-scssap-lppwp-tmtp-fish-list-scope-review-20261120.json";
const reviewId = "ncr-scssap-lppwp-tmtp-catalog-of-fishes-issues-20261120";
const outputPath = path.join(root, "data/research/philippines/national/reviews", `${reviewId}.json`);
const rawDir = path.join(root, "data/research/philippines/raw/national/scssap-fish-catalog-check-20261120");
const baseUrl = "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=";
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

// Selected Catalog of Fishes records for the synonym, all family conflicts,
// and two source/table habitat or range flags. This is not a full rerun of the
// 35-binomial crosswalk and it does not reidentify any sampled fish.
const targets = [
  { id: 34496, label: "Atropus armatus accepted-name record", expectedStatus: "Valid as Atropus armatus", expectedFamily: "Carangidae" },
  { id: 59622, label: "Carangoides armatus historical combination record", expectedStatus: "Synonym of Atropus armatus", expectedFamily: "Carangidae" },
  { id: 15647, label: "Gerres filamentosus", expectedStatus: "Valid as Gerres filamentosus", expectedFamily: "Gerreidae" },
  { id: 11427, label: "Saurida tumbil", expectedStatus: "Valid as Saurida tumbil", expectedFamily: "Harpadontidae" },
  { id: 31936, label: "Tor tambroides", expectedStatus: "Valid as Tor tambroides", expectedFamily: "Cyprinidae", expectedHabitat: "freshwater" },
  { id: 57824, label: "Elops saurus", expectedStatus: "Valid as Elops saurus", expectedFamily: "Elopidae", expectedDistribution: "Western Atlantic" },
  { id: 58306, label: "Elops hawaiensis", expectedStatus: "Valid as Elops hawaiensis", expectedFamily: "Elopidae", expectedDistribution: "western Pacific" },
];

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
    .replace(/&#x([\da-f]+);/gi, (_, value) => String.fromCodePoint(Number.parseInt(value, 16)))
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&bull;", "•")
    .replaceAll("&quot;", '"')
    .replaceAll("&rsquo;", "’")
    .replaceAll("&lsquo;", "‘");
}

function pageText(html) {
  return decodeEntities(html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function extractFields(text, target) {
  const status = text.match(/Current status:\s*(.*?)(?=\s*Distribution:|\s*Habitat:|\s*CalAcademy Footer|$)/)?.[1]?.trim() ?? null;
  const familyAndSubfamily = text.match(/Current status:[\s\S]*?\.(.*?)(?=\s*Distribution:|\s*Habitat:|\s*CalAcademy Footer|$)/)?.[1]?.trim() ?? null;
  const distribution = text.match(/Distribution:\s*(.*?)(?=\s*Habitat:|\s*CalAcademy Footer|$)/)?.[1]?.trim() ?? null;
  const habitat = text.match(/Habitat:\s*(.*?)(?=\s*CalAcademy Footer|$)/)?.[1]?.trim() ?? null;
  const pageVersion = text.match(/Online Version, Updated\s+([^•]+?)\s+(?:Search Eschmeyer's Catalog|Institute for Biodiversity)/)?.[1]?.trim() ?? null;
  assert.ok(status?.includes(target.expectedStatus), `${target.label}: expected status not found`);
  assert.ok(familyAndSubfamily?.startsWith(target.expectedFamily), `${target.label}: expected family not found`);
  if (target.expectedHabitat) assert.ok(habitat?.toLowerCase().includes(target.expectedHabitat), `${target.label}: expected habitat not found`);
  if (target.expectedDistribution) assert.ok(distribution?.includes(target.expectedDistribution), `${target.label}: expected distribution not found`);
  return { pageVersion, currentStatus: status, familyAndSubfamily, distribution, habitat };
}

const parentCrosswalkBytes = await readFile(path.join(root, parentCrosswalkPath));
const parentScopeBytes = await readFile(path.join(root, parentScopePath));
const parentCrosswalk = JSON.parse(parentCrosswalkBytes.toString("utf8"));
const parentScope = JSON.parse(parentScopeBytes.toString("utf8"));
await mkdir(rawDir, { recursive: true });

const catalogRecords = await Promise.all(targets.map(async (target) => {
  const url = `${baseUrl}${target.id}`;
  const response = await fetch(url, {
    headers: { Accept: "text/html", "User-Agent": "Bangwit research taxonomy review/1.0" },
    signal: AbortSignal.timeout(30000),
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(response.status, 200, `${target.label}: Catalog returned HTTP ${response.status}`);
  const text = pageText(bytes.toString("utf8"));
  const localPath = path.join(rawDir, `${target.id}.html`);
  await writeFile(localPath, bytes);
  return {
    label: target.label,
    url,
    ...extractFields(text, target),
    responseBytes: bytes.length,
    rawResponse: {
      path: path.relative(root, localPath).replaceAll("\\", "/"),
      sha256: sha256(bytes),
    },
  };
}));

const selectedNames = new Set(["Carangoides armatus", "Gerres filamentosus", "Saurida tumbil", "Tor tambroides", "Elops saurus"]);
const sourceRows = parentCrosswalk.sourceRows.filter((row) => selectedNames.has(row.nameAsPrinted));
const independentlyCheckedSourceNames = new Set(sourceRows.map((row) => row.nameAsPrinted));
assert.equal(catalogRecords.length, 7);
assert.equal(sourceRows.length, 6);
assert.equal(sourceRows.filter((row) => row.sourceFamilyExactTextMatch === false).length, 3);

const artifact = {
  schemaVersion: 1,
  reviewId,
  reviewedOn: "2026-11-20",
  phaseId: "L2",
  regionId: "1300000000",
  regionName: "National Capital Region (NCR)",
  status: "targeted-catalog-crosscheck-complete;specimen-identity-unverified;research-only",
  question: "Do independent Eschmeyer's Catalog of Fishes records support the CoL XR name candidate, resolve printed family-name conflicts, and clarify selected range or habitat flags in the LPPWP/TMTP source tables?",
  sourceIds: ["scssap-ph-ecosystems-ch4-lppwp-tmtp-2026", "calacademy-catalog-scssap-wetland-taxa-20261120"],
  inputs: [parentScopePath, parentCrosswalkPath],
  snapshotHashes: {
    parentFishTableReview: sha256(parentScopeBytes),
    parentColXrCrosswalk: sha256(parentCrosswalkBytes),
  },
  method: {
    summary: "Retrieved seven direct Eschmeyer's Catalog of Fishes records: the current accepted-name record and a historical combination record for the Carangoides/Atropus candidate, all three source rows with family-string conflicts, and the Elops and Tor source-table flags. These selected-record checks do not re-run the 35-binomial crosswalk.",
    authorityUse: "Catalog status, family, range, and habitat fields are independent nomenclatural/context references. A record does not verify the organism sampled in the source study or its precise park site.",
    limitations: [
      "No voucher, image, diagnostic description, station record, or author statement was available to reidentify source specimens.",
      "Catalog distribution summaries are not proof of absence outside their stated range; a range or habitat discrepancy is a review flag only.",
      "The remaining CoL XR binomial candidates were not individually checked against the Catalog in this targeted batch.",
      "The underlying Ancog et al. report, field methods, sample dates, item-specific reuse terms, and exact site assignment remain unresolved.",
    ],
  },
  sourceRows,
  catalogRecords,
  findings: [
    {
      name: "Carangoides armatus",
      result: "The Catalog's current treatment resolves the related historical combination as a synonym of Atropus armatus and identifies Atropus armatus as valid; this independently agrees with the CoL XR accepted-name candidate.",
      sourceDecision: "Preserve Carangoides armatus exactly as printed. Do not rewrite the survey table or assert that the sampled fish was Atropus armatus.",
    },
    {
      name: "Gerres filamentosus",
      result: "The Catalog lists Gerreidae, while both source rows print Gerridae. This supports a family-string conflict at the nomenclatural-reference level only.",
      sourceDecision: "Keep Gerridae unchanged in the transcribed source rows pending the original study or author clarification.",
    },
    {
      name: "Saurida tumbil",
      result: "The Catalog lists Harpadontidae and marine habitat, while the TMTP row prints Dorosomatidae. This supports a family-string conflict at the nomenclatural-reference level only.",
      sourceDecision: "Keep Dorosomatidae unchanged in the transcribed source row pending the original study or author clarification.",
    },
    {
      name: "Elops saurus / Elops hawaiensis",
      result: "The Catalog treats E. saurus as valid with a Western Atlantic distribution, and E. hawaiensis as valid with an Eastern Indian Ocean/western Pacific distribution. This makes the LPPWP table's E. saurus label a substantial range/identification flag.",
      sourceDecision: "Do not substitute E. hawaiensis. Verify the original study, voucher, or author identification; no specimen identity or correction is established.",
    },
    {
      name: "Tor tambroides",
      result: "The Catalog lists freshwater habitat and a Southeast Asian distribution (Malaysia, Singapore, Indonesia, and the Mekong River basin) for the name printed in the TMTP table.",
      sourceDecision: "Flag for source-method and locality follow-up. Do not infer impossibility, absence, or erroneous identity from this range summary alone.",
    },
  ],
  decision: {
    independentCrosscheckOfAll35Binomials: false,
    sourceRowsCorrected: 0,
    acceptedNamesApplied: 0,
    speciesAssertionsAdded: 0,
    occurrenceRowsAdded: 0,
    geometryAdded: false,
    publicAppProjection: false,
    publicationApproval: false,
    regionalBaselineComplete: false,
  },
  nextActions: [
    "Seek the underlying Ancog et al. Coastal Biodiversity Report, its voucher or photo catalog, survey dates, methods, and park/station mapping.",
    "Independently cross-check the remaining accepted-name candidates; prioritize table misspellings and taxa whose source habitats or regions appear inconsistent.",
    "Retain all source strings, measurements, site labels, and imagery as research-only until identification, locality, date, and reuse rights are resolved.",
  ],
};

await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ review: path.relative(root, outputPath).replaceAll("\\", "/"), catalogRecords: catalogRecords.length, sourceRowsChecked: sourceRows.length, familyConflictRows: sourceRows.filter((row) => row.sourceFamilyExactTextMatch === false).length, sourceBinomialsIndependentlyChecked: independentlyCheckedSourceNames.size, remainingBinomialsNotIndependentlyChecked: parentCrosswalk.matchCounts.uniqueBinomialsQueried - independentlyCheckedSourceNames.size }, null, 2));
