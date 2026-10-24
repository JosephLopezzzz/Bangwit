import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../data/research/philippines/", import.meta.url);
const review = JSON.parse(
  await readFile(new URL("central-luzon-angat-bustos-2015-taxonomy-followup-20261024.json", root), "utf8"),
);
const registry = JSON.parse(await readFile(new URL("sources.json", root), "utf8"));

test("Angat-Bustos taxonomic cross-check retains conflicts and does not create unverified occurrences", () => {
  assert.equal(review.nameReviews.length, 6);
  assert.equal(review.disposition.sourceNameRowsReviewed, 6);
  assert.equal(review.disposition.nameCrosswalkAgreements, 4);
  assert.equal(review.disposition.taxonomyConflictHolds, 1);
  assert.equal(review.disposition.sourceIdentificationsNotIndependentlyVerified, 6);
  assert.equal(review.disposition.siteResolvedFishAssertionsAdded, 0);
  assert.equal(review.disposition.appProjectionRowsAdded, 0);
  assert.equal(review.disposition.foodSafetyClaimsAdded, 0);
  assert.equal(review.disposition.geometryAdded, false);

  const gourami = review.nameReviews.find((row) => row.sourceName === "Trichogaster lalius");
  assert.match(gourami.disposition, /taxonomy-conflict-hold/);
  assert.match(gourami.catalogOfFishes, /synonym of Trichogaster fasciata/);
  assert.match(gourami.itis, /Colisa lalia/);
  assert.match(gourami.gbif, /accepted species match/);

  const loach = review.nameReviews.find((row) => row.sourceName === "Misgurnus fossilis");
  assert.equal(loach.sourceVariantInAbstract, "Misgurnus fossils");
  assert.match(loach.disposition, /source-identification-hold/);

  for (const sourceId of [
    "calacademy-catalog-angat-bustos-taxonomy-followup-20261024",
    "itis-angat-bustos-taxonomy-followup-20261024",
    "gbif-backbone-angat-bustos-name-match-20261024",
  ]) {
    assert.ok(
      registry.sources.some((source) => source.id === sourceId),
      `Unregistered source: ${sourceId}`,
    );
  }
});
