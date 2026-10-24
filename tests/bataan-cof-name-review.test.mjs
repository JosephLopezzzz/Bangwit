import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const dataDir = new URL("../data/research/philippines/", import.meta.url);
const [review, sourceTable, registry] = await Promise.all([
  "central-luzon-bataan-cof-name-review-20261024.json",
  "central-luzon-bataan-river-table-review-20261024.json",
  "sources.json",
].map((name) => readFile(new URL(name, dataDir), "utf8").then(JSON.parse)));

test("selected Catalog of Fishes checks preserve source rows and keep publication blocked", () => {
  const rows = new Map(sourceTable.sourceTableReview.records.map((row) => [row.sourceName, row]));
  assert.equal(review.status, "selected-name-review-complete-remaining-binomial-review-pending");
  assert.equal(review.coverage.selectedRowsReviewed, review.records.length);
  assert.equal(review.coverage.sourceBinomialsTotal, 42);
  assert.equal(review.coverage.sourceBinomialsRemainingForCatalogReview, 30);
  assert.equal(review.coverage.genusOnlyOrHybridRowsHeld, 10);
  assert.equal(review.coverage.allRowsPendingOverallIdentityReview, true);
  assert.equal(review.coverage.acceptedTaxa, 0);
  assert.equal(review.coverage.publicationEligible, 0);

  for (const record of review.records) {
    const source = rows.get(record.sourceNameVerbatim);
    assert.ok(source, `missing source transcription for ${record.sourceNameVerbatim}`);
    assert.equal(source.familyAsPrinted, record.sourceFamilyVerbatim);
    assert.ok(record.evidenceUrl || record.evidenceUrls?.length > 0);
    assert.match(record.disposition, /pending|proposal|hold|keep (?:the )?source|identity review/i);
  }

  const sourceRecord = registry.sources.find((source) => source.id === "calacademy-catalog-bataan-taxonomy-review-20261024");
  assert.ok(sourceRecord);
  assert.ok(sourceRecord.access.reviewFiles.includes("central-luzon-bataan-cof-name-review-20261024.json"));
  assert.equal(sourceRecord.publicationApproval, false);
  assert.equal(registry.sourceCount, registry.sources.length);
});

test("family conflicts, catalog combinations, and unresolved flatfish naming stay explicit", () => {
  const byId = new Map(review.records.map((record) => [record.candidateId, record]));
  assert.equal(byId.get("bataan-table-row-003").catalogFamily, "Anguillidae");
  assert.equal(byId.get("bataan-table-row-025").catalogFamily, "Platycephalidae");
  assert.equal(byId.get("bataan-table-row-040").catalogFamily, "Poeciliidae");
  assert.equal(byId.get("bataan-table-row-041").catalogFamily, "Poeciliidae");
  assert.equal(byId.get("bataan-table-row-042").catalogFamily, "Poeciliidae");
  assert.equal(byId.get("bataan-table-row-029").catalogName, "Leiognathus equula");
  assert.equal(byId.get("bataan-table-row-050").catalogName, "Terapon jarbua");
  assert.equal(byId.get("bataan-table-row-016").catalogName, null);
});
