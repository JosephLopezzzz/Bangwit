import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const reviewUrl = new URL("data/research/philippines/laguna-de-bay-specimen-source-review.json", root);
const outputUrl = new URL("src/data/laguna-de-bay-specimen-evidence.json", root);

export function buildLagunaDeBaySpecimenEvidence(review, reviewSha256) {
  assert.equal(review.schemaVersion, 1);
  assert.equal(review.status, "reviewed-one-corrected-historical-specimen-assertion");
  assert.equal(review.waterbody.id, "ph-wb-laguna-de-bay");
  assert.equal(review.source.id, "sorgon-2025-laguna-tinfoil-barb");
  assert.equal(review.source.corrigendum.correctedLocality, "Brgy. Calahan, Cardona, Rizal");
  assert.equal(review.specimen.reportedLocality.includes("Brgy. Calahan"), true);
  assert.equal(review.specimen.reportedLocality.includes("Brgy. Patunhay"), false);
  assert.equal(review.specimen.decimalLongitude, null);
  assert.equal(review.specimen.decimalLatitude, null);
  assert.equal(review.specimen.basisOfRecord, "PRESERVED_SPECIMEN");
  assert.equal(review.specimen.catalogNumber, "ADMU 300008");
  assert.equal(review.specimen.collectionDate, "2024-09-28");
  assert.equal(review.taxonomyReview.acceptedName, "Barbonymus schwanefeldii (Bleeker, 1854)");
  assert.match(review.taxonomyReview.independentStatus, /^Valid as /);
  assert.equal(review.source.license, "CC-BY-NC-3.0");
  assert.equal(review.decision.assertionCount, 1);
  assert.equal(review.heldLead.specimenRetained, false);
  assert.equal(review.decision.status, "admit-one-attributed-lake-level-specimen-assertion");

  return {
    schemaVersion: 1,
    batchId: review.batchId,
    reviewedOn: review.reviewedOn,
    status: "reviewed-historical-lake-level-specimen-evidence",
    waterbody: { ...review.waterbody },
    counts: { speciesAssertions: 1, specimenRecords: 1, heldUnvoucheredReports: 1 },
    taxonomy: { ...review.taxonomyReview },
    source: {
      id: review.source.id,
      title: review.source.title,
      citation: review.source.citation,
      doi: review.source.doi,
      articleUrl: review.source.articleUrl,
      corrigendum: { ...review.source.corrigendum },
      license: review.source.license,
      licenseUrl: review.source.licenseUrl,
      licenseEvidenceUrl: review.source.licenseEvidenceUrl,
      licenseScope: review.source.licenseScope,
    },
    assertion: {
      id: `${review.taxonomyReview.acceptedName}@${review.waterbody.id}:${review.specimen.catalogNumber}`,
      scientificName: review.taxonomyReview.acceptedName,
      family: review.taxonomyReview.family,
      reportedLocality: review.specimen.reportedLocality,
      evidenceKind: "preserved-specimen-lake-association",
      collectionDate: review.specimen.collectionDate,
      collectionContext: review.specimen.collectionContext,
      catalogNumber: review.specimen.catalogNumber,
      repository: review.specimen.repository,
      decimalLongitude: null,
      decimalLatitude: null,
      sourceId: review.source.id,
    },
    heldLead: { ...review.heldLead },
    caveats: [...review.decision.caveats],
    nonClaims: [...review.nonClaims],
    provenance: {
      reviewFile: "data/research/philippines/laguna-de-bay-specimen-source-review.json",
      reviewSha256,
    },
  };
}

export async function readLagunaDeBayReview() {
  const bytes = await readFile(reviewUrl);
  return {
    review: JSON.parse(bytes.toString("utf8")),
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

async function main() {
  const { review, sha256 } = await readLagunaDeBayReview();
  const evidence = buildLagunaDeBaySpecimenEvidence(review, sha256);
  const serialized = `${JSON.stringify(evidence, null, 2)}\n`;
  if (process.argv.includes("--check")) {
    assert.equal(
      await readFile(outputUrl, "utf8"),
      serialized,
      "Laguna de Bay specimen projection differs from its reviewed source ledger",
    );
    console.log("Laguna de Bay projection matches: one corrected, dated, lake-level specimen assertion.");
    return;
  }
  await writeFile(outputUrl, serialized);
  console.log("Laguna de Bay projection written: one corrected, dated, lake-level specimen assertion.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(`Laguna de Bay evidence projection failed: ${error.message}`);
    process.exitCode = 1;
  }
}
