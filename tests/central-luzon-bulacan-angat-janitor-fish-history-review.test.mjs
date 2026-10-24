import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, checkpoint, registry] = await Promise.all([
  "central-luzon-bulacan-angat-janitor-fish-history-review-20261024.json",
  "central-luzon-discovery-checkpoint-20261024.json",
  "sources.json",
].map((name) => readFile(new URL(name, base), "utf8").then(JSON.parse)));

test("Angat preprint evidence records a historical catch report without turning 2005 into a survey or introduction date", () => {
  assert.equal(review.localityLead.waterbodyAsReported, "Angat River");
  assert.equal(review.localityLead.reportedSinceYear, 2005);
  assert.equal(review.localityLead.surveyDate, null);
  assert.match(review.localityLead.primarySourceWording, /fishers interviewed/i);
  assert.match(review.localityLead.secondarySourceConflict, /year of introduction/);
  assert.equal(review.localityLead.authorIdentification, "Pterygoplichthys disjunctivus");
  assert.match(review.localityLead.coordinateAsPrinted, /Marungko|14|121/);
  assert.equal(review.localityLead.coordinate, null);
  assert.equal(review.disposition.currentOccurrenceAssertionsAdded, 0);
  assert.equal(review.disposition.appProjectionRowsAdded, 0);
});

test("The author-uploaded preprint stays distinct from the unavailable 2014 proceeding and 2025 Naujan survey", () => {
  assert.equal(review.sources.dlsuProceedings.fullProceedingsAvailable, false);
  assert.equal(review.sources.authorPreprint.fullTextReviewed, true);
  assert.equal(review.sources.authorPreprint.peerReviewStatus.includes("may not have been peer reviewed"), true);
  assert.equal(review.sources.authorPreprint.notProvenIdenticalTo2014Proceeding, true);
  assert.match(review.sources.pjsSummary.publisherPageAccess, /403/);
  assert.match(review.sources.pjsSummary.title, /Lake Naujan/);
  assert.equal(review.rights.dlsuProceedingsLicense, null);
  assert.equal(review.rights.authorPreprintLicense, null);
  assert.equal(review.rights.pjsArticleLicense, null);
  for (const id of [review.sources.dlsuProceedings.id, review.sources.authorPreprint.id, review.sources.pjsSummary.id]) {
    const source = registry.sources.find((row) => row.id === id);
    assert.ok(source); assert.equal(source.license, null); assert.equal(source.publicationApproval, false);
  }
});

test("Angat municipality remains separate from the Bustos study reach and regional completion stays blocked", () => {
  const lead = checkpoint.waterbodyLeads.inlandAndBrackish.find((row) => row.name.startsWith("Angat River, Angat municipality"));
  assert.ok(lead); assert.deepEqual(lead.administrativeUnits, ["Bulacan"]);
  assert.equal(checkpoint.bulacanAngatPterygoplichthysHistoryReviewFile, "central-luzon-bulacan-angat-janitor-fish-history-review-20261024.json");
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
  assert.equal(registry.sourceCount, registry.sources.length);
});
