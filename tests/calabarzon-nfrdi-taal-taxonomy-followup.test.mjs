import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const reviewUrl = new URL("../data/research/philippines/calabarzon-nfrdi-taal-taxonomy-followup-20261024.json", import.meta.url);
const guideUrl = new URL("../data/research/philippines/calabarzon-nfrdi-taal-guide-review-20261024.json", import.meta.url);
const sourcesUrl = new URL("../data/research/philippines/sources.json", import.meta.url);
const sweepUrl = new URL("../data/research/philippines/calabarzon-coverage-source-sweep.json", import.meta.url);

const [review, guide, sourceRegistry, coverageSweep] = await Promise.all([
  readFile(reviewUrl, "utf8").then(JSON.parse),
  readFile(guideUrl, "utf8").then(JSON.parse),
  readFile(sourcesUrl, "utf8").then(JSON.parse),
  readFile(sweepUrl, "utf8").then(JSON.parse),
]);

test("Catalog of Fishes cross-checks all Taal names and holds both family differences out of the app", () => {
  assert.equal(review.source.id, "calacademy-catalog-taal-taxonomy-followup");
  assert.equal(review.upstreamReview.sourceId, "nfrdi-2023-taal-field-identification-guide");
  assert.equal(review.counts.namesChecked, 45);
  assert.equal(review.counts.catalogNameStatusesSupported, 45);
  assert.equal(review.counts.priorFamilyConflictRows, 1);
  assert.equal(review.counts.catalogFamilyDisagreements, 2);
  assert.equal(review.counts.appAssertionsAdmitted, 0);
  assert.equal(review.counts.publicProjection, false);
  assert.equal(review.records.length, 45);
  assert.deepEqual(
    review.records.map((row) => row.sourceReportedName).sort(),
    guide.records.map((row) => row.sourceReportedName).sort(),
  );
  assert.ok(review.records.every((row) => row.catalogAcceptedName === row.sourceReportedName));
  assert.ok(review.records.every((row) => row.decision.includes("app admission remain pending")));
  assert.equal(review.source.access.rawSnapshots.length, 45);
  assert.ok(review.source.access.rawSnapshots.every((row) => /^[a-f0-9]{64}$/.test(row.sha256)));

  assert.deepEqual(
    review.familyDisagreements.map((row) => row.sourceReportedName).sort(),
    ["Hypophthalmichthys nobilis", "Oligolepis acutipennis"],
  );

  const bighead = review.records.find((row) => row.sourceReportedName === "Hypophthalmichthys nobilis");
  assert.equal(bighead.catalogFamily, "Xenocyprididae");
  assert.equal(bighead.frozenCandidateFamily, "Xenocyprididae");
  assert.equal(bighead.frozenMatchingServiceFamily, "Cyprinidae");
  const oligolepis = review.records.find((row) => row.sourceReportedName === "Oligolepis acutipennis");
  assert.equal(oligolepis.catalogFamily, "Oxudercidae");
  assert.equal(oligolepis.frozenMatchingServiceFamily, "Gobiidae");

  const source = sourceRegistry.sources.find((row) => row.id === review.source.id);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  const followUp = coverageSweep.additionalPrimarySourceFollowUps.find((row) => row.sourceId === review.source.id);
  assert.ok(followUp);
  assert.equal(followUp.admittedSpeciesAssertions, 0);
});
