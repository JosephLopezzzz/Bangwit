import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const review = JSON.parse(await readFile(new URL("central-luzon-paitan-vaca-source-review-20261024.json", base), "utf8"));
const checkpoint = JSON.parse(await readFile(new URL("central-luzon-discovery-checkpoint-20261024.json", base), "utf8"));
const sourceRegistry = JSON.parse(await readFile(new URL("sources.json", base), "utf8"));

test("Paitan and Vaca preserve the joint stocking allocation and evidence limits", () => {
  assert.equal(review.status, "source-reconciliation-research-only-not-app-ready");
  assert.deepEqual(review.waterbodies.map(({ name }) => name), ["Paitan Lake", "Vaca Dam Reservoir"]);

  const stocking = review.sources.find(({ id }) => id === "clsu-paitan-vaca-stock-enhancement-2021");
  assert.equal(stocking.eventDate, "2021-08-12");
  assert.deepEqual(stocking.sourceReportedStocking.map(({ count }) => count), [40000, 12000, 42000]);
  assert.ok(stocking.allocationAndIdentityLimits.some((item) => /does not allocate any count/.test(item)));
  assert.ok(stocking.allocationAndIdentityLimits.some((item) => /not silently resolved to taxa/.test(item)));

  const news = review.sources.find(({ id }) => id === "punto-paitan-janitor-fish-report-2009");
  assert.equal(news.conflictingStatements.length, 2);
  assert.match(news.disposition, /do not admit/);

  assert.equal(review.gbifQueryAudit.legacyLocalityQueries.legacyTaxonKey, 204);
  assert.match(review.gbifQueryAudit.legacyLocalityQueries.decision, /invalidated/);
  assert.equal(review.gbifQueryAudit.currentTaxonSelection.taxonKey, "8VR36");
  assert.equal(review.gbifQueryAudit.currentTaxonSelection.correctedLocalitySearchStatus, "not-run-in-this-batch");

  assert.equal(review.appUse.speciesAssertionsAdded, 0);
  assert.equal(review.appUse.dietClaimsAdded, 0);
  assert.equal(review.appUse.geometryAdded, false);
  assert.equal(review.appUse.publicChecklistChanged, false);
  assert.equal(review.appUse.regionalReleaseApproved, false);
});

test("Central Luzon checkpoint lists Paitan and Vaca separately without claiming coverage", () => {
  assert.equal(checkpoint.paitanVacaSourceReviewFile, "central-luzon-paitan-vaca-source-review-20261024.json");
  const leads = checkpoint.waterbodyLeads.inlandAndBrackish;
  const paitan = leads.find(({ name }) => name === "Paitan Lake / Libsong Lake");
  const vaca = leads.find(({ name }) => name === "Vaca Dam Reservoir");
  assert.ok(paitan);
  assert.ok(vaca);
  assert.match(paitan.status, /no rights-cleared species-by-waterbody table/);
  assert.match(vaca.status, /no separate stocking allocation/);
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
});

test("historical references remain pinned while new sources stay inside the research review", () => {
  assert.equal(sourceRegistry.sourceCount, sourceRegistry.sources.length);
  assert.ok(sourceRegistry.sources.some((item) => item.id === "silliman-nueva-ecija-pampanga-freshwater-study"));
  assert.ok(review.sources.some(({ id, url }) => id === "clsu-paitan-vaca-stock-enhancement-2021" && url.startsWith("https://")));
  assert.ok(review.sources.some(({ id, url }) => id === "punto-paitan-janitor-fish-report-2009" && url.startsWith("https://")));
});
