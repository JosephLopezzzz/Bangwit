import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const reviewUrl = new URL("data/research/philippines/pasig-river-arius-manillensis-source-review.json", root);
const outputUrl = new URL("src/data/pasig-river-species-evidence.json", root);

export function buildPasigRiverSpeciesEvidence(review, reviewSha256) {
  assert.equal(review.schemaVersion, 1);
  assert.equal(review.status, "reviewed-one-dated-published-collection-event");
  assert.equal(review.decision.status, "prepare-one-attributed-historical-river-assertion");
  assert.equal(review.decision.assertionCount, 1);
  assert.equal(review.decision.individualCount, 3);
  assert.equal(review.decision.waterbody.id, "ph-wb-pasig-river");
  assert.equal(review.decision.waterbody.kind, "river");
  assert.equal(review.assertion.reportedScientificName, "Arius manillensis");
  assert.equal(review.assertion.acceptedScientificName, "Arius manillensis Valenciennes, 1840");
  assert.equal(review.assertion.reportedLocality, "Pasig River");
  assert.equal(review.assertion.collectionDate, "2025-10-29");
  assert.equal(review.assertion.individualsReported, 3);
  assert.equal(review.assertion.basisOfRecord, "MATERIAL_SAMPLE");
  assert.equal(review.assertion.decimalLatitude, null);
  assert.equal(review.assertion.decimalLongitude, null);
  assert.equal(review.taxonomyReview.checklistKey, "7ddf754f-d193-4cc9-b351-99906754a03b");
  assert.equal(review.taxonomyReview.gbifTaxonKey, "GQWT");
  assert.equal(review.taxonomyReview.gbifBackboneTaxonKey, 2345237);
  assert.equal(review.taxonomyReview.matchType, "EXACT");
  assert.match(review.taxonomyReview.interpretation, /does not independently re-identify/i);
  assert.equal(review.source.id, "lirio-2026-arius-manillensis-pasig-river");
  assert.equal(review.source.license, "CC-BY-4.0");
  assert.equal(review.source.doi, "10.1128/mra.00370-26");
  assert.ok(review.nonClaims.some((claim) => /complete NCR fish checklist/i.test(claim)));

  return {
    schemaVersion: 1,
    batchId: review.batchId,
    reviewedOn: review.reviewedOn,
    status: "historical-source-evidence-projection-not-release-approval",
    waterbody: { ...review.decision.waterbody },
    counts: { speciesAssertions: 1, collectionEvents: 1, individualsReported: 3 },
    assertion: { ...review.assertion },
    taxonomyReview: { ...review.taxonomyReview },
    source: { ...review.source },
    caveats: [...review.decision.caveats],
    nonClaims: [...review.nonClaims],
    provenance: {
      reviewFile: "data/research/philippines/pasig-river-arius-manillensis-source-review.json",
      reviewSha256,
    },
  };
}

export async function readPasigRiverSpeciesReview() {
  const bytes = await readFile(reviewUrl);
  return {
    review: JSON.parse(bytes.toString("utf8")),
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

async function main() {
  const { review, sha256 } = await readPasigRiverSpeciesReview();
  const projection = `${JSON.stringify(buildPasigRiverSpeciesEvidence(review, sha256), null, 2)}\n`;
  if (process.argv.includes("--check")) {
    assert.equal(await readFile(outputUrl, "utf8"), projection, "Pasig River projection differs from its reviewed source ledger");
    console.log("Pasig River projection matches one dated, attributed historical collection event; coordinates remain withheld.");
    return;
  }
  await writeFile(outputUrl, projection);
  console.log("Pasig River projection written with one dated, attributed historical collection event; coordinates remain withheld.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(`Pasig River species projection failed: ${error.message}`);
    process.exitCode = 1;
  }
}
