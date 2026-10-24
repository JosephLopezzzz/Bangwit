import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { buildManilaBaySharedGbifEvidence, readManilaBayGbifReview } from "../scripts/species/build-manila-bay-shared-gbif-evidence.mjs";

const base = new URL("../data/research/philippines/", import.meta.url);
const [registry, ncr] = await Promise.all([
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("ncr-species-coverage-review-20261024.json", base), "utf8").then(JSON.parse),
]);

test("projects two old Manila Bay specimens without assigning the shared bay to NCR", async () => {
  const { review, sha256 } = await readManilaBayGbifReview();
  const projection = buildManilaBaySharedGbifEvidence(review, sha256);
  assert.equal(projection.waterbody.id, "ph-wb-manila-bay");
  assert.equal(projection.counts.historicalSpeciesAssertions, 2);
  assert.deepEqual(projection.records.map((record) => record.gbifId), [1319034597, 2284279207]);
  assert.ok(projection.records.every((record) => record.decimalLatitude === null && record.decimalLongitude === null));
  assert.equal(ncr.coverage.baselineReviewed, false);
  assert.equal(ncr.coverage.fishRecordsPubliclyAdmitted, 0);
  assert.equal(review.decision.publicAdmission, false);
  for (const record of projection.records) {
    assert.ok(review.caveats.some((caveat) => /not assigned to NCR/i.test(caveat)));
    assert.equal(record.license, "CC0-1.0");
    assert.match(record.independentTaxonomyUrl, /researcharchive\.calacademy\.org/);
  }
  assert.ok(registry.sources.some((source) => source.id === "gbif-nmnh-usnm-extant-specimens"));
  assert.ok(registry.sources.some((source) => source.id === "catalog-fishes-rastrelliger-kanagurta"));
  assert.ok(registry.sources.some((source) => source.id === "catalog-fishes-encrasicholina-heteroloba"));
});
