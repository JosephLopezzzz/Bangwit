import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, checkpoint, registry] = await Promise.all([
  "central-luzon-bulacan-angat-janitor-fish-history-review-20261024.json",
  "central-luzon-discovery-checkpoint-20261024.json",
  "sources.json",
].map((name) => readFile(new URL(name, base), "utf8").then(JSON.parse)));

test("Angat's 2005 Pterygoplichthys value stays an introduction-year lead, not a current catch record", () => {
  assert.equal(review.localityLead.waterbodyAsReported, "Angat River");
  assert.equal(review.localityLead.yearOfIntroductionAsListed, 2005);
  assert.match(review.localityLead.tableMeaning, /not a collection\/survey date/);
  assert.equal(review.localityLead.coordinate, null);
  assert.equal(review.disposition.currentOccurrenceAssertionsAdded, 0);
  assert.equal(review.disposition.appProjectionRowsAdded, 0);
});

test("The historical Angat lead distinguishes the 2014 unavailable proceeding from the 2025 Naujan survey", () => {
  assert.equal(review.sources.dlsuProceedings.fullProceedingsAvailable, false);
  assert.match(review.sources.pjsSummary.publisherPageAccess, /403/);
  assert.match(review.sources.pjsSummary.title, /Lake Naujan/);
  assert.equal(review.rights.dlsuProceedingsLicense, null);
  assert.equal(review.rights.pjsArticleLicense, null);
  for (const id of [review.sources.dlsuProceedings.id, review.sources.pjsSummary.id]) {
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
