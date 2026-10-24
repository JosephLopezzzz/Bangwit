import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { buildPasigRiverSpeciesEvidence, readPasigRiverSpeciesReview } from "../scripts/species/build-pasig-river-species-evidence.mjs";

const registry = JSON.parse(await readFile(new URL("../data/research/philippines/sources.json", import.meta.url), "utf8"));

test("Pasig River evidence projects one sourced historic event and withholds its collection point", async () => {
  const { review, sha256 } = await readPasigRiverSpeciesReview();
  const projection = buildPasigRiverSpeciesEvidence(review, sha256);
  const source = registry.sources.find((item) => item.id === projection.source.id);

  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.equal(projection.counts.speciesAssertions, 1);
  assert.equal(projection.counts.individualsReported, 3);
  assert.equal(projection.assertion.decimalLatitude, null);
  assert.equal(projection.assertion.decimalLongitude, null);
  assert.match(projection.assertion.coordinateHandling, /withheld/i);
  assert.equal(projection.taxonomyReview.gbifTaxonKey, "GQWT");
  assert.equal(projection.taxonomyReview.gbifBackboneTaxonKey, 2345237);
  assert.match(projection.taxonomyReview.interpretation, /not independently re-identify/i);
  assert.ok(projection.caveats.some((claim) => /catchability/i.test(claim)));
  assert.ok(projection.nonClaims.some((claim) => /complete NCR fish checklist/i.test(claim)));
});
