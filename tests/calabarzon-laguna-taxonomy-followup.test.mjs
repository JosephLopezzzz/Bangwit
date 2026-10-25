import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import followup from "../data/research/philippines/calabarzon-laguna-cas-taxonomy-followup-20261025.json" with { type: "json" };
import museum from "../data/research/philippines/calabarzon-laguna-museum-catalog-verification-20261025.json" with { type: "json" };
import registry from "../data/research/philippines/sources.json" with { type: "json" };

const base = new URL("../data/research/philippines/", import.meta.url);
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const hasCoordinates = (value) => {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, nested]) =>
      ["decimalLatitude", "decimalLongitude", "coordinateUncertaintyInMeters", "coordinates", "geometry"].includes(key) ||
      hasCoordinates(nested),
  );
};

test("current fish-name sources resolve four Laguna CAS historical mappings and preserve one author-year hold", async () => {
  const bytes = await readFile(new URL("calabarzon-laguna-cas-taxonomy-followup-20261025.json", base));
  const crosswalkBytes = await readFile(new URL("calabarzon-laguna-cas-archive-crosswalk-20261025.json", base));
  const initialTaxonomyBytes = await readFile(new URL("calabarzon-laguna-cof-taxonomy-20261025.json", base));

  assert.deepEqual(followup.inputs, [
    {
      file: "calabarzon-laguna-cas-archive-crosswalk-20261025.json",
      sha256: digest(crosswalkBytes),
    },
    {
      file: "calabarzon-laguna-cof-taxonomy-20261025.json",
      sha256: digest(initialTaxonomyBytes),
    },
  ]);
  assert.equal(museum.inputs.find((input) => input.file === "calabarzon-laguna-cas-taxonomy-followup-20261025.json")?.sha256, digest(bytes));
  assert.equal(followup.records.length, 5);
  assert.equal(followup.summary.currentCatalogMappingsResolvedForHistoricalLedger, 4);
  assert.equal(followup.summary.recordsStillHeldForTaxonomicReview, 1);
  assert.equal(followup.summary.publicAppRowsAdded, 0);
  assert.equal(followup.summary.mapPointsAdded, 0);
  assert.equal(followup.summary.currentPresenceInferred, false);
  assert.equal(hasCoordinates(followup), false);

  const admitted = followup.records.filter((record) => record.decision === "admit-historical-source-locality-evidence");
  assert.deepEqual(admitted.map((record) => record.gbifId).sort(), [
    "3426423630",
    "3426462603",
    "3426464611",
    "3426465616",
  ]);
  assert.ok(admitted.every((record) => record.acceptedName && record.sourcePage && /^[a-f0-9]{64}$/.test(record.rawSha256)));
  assert.equal(admitted.find((record) => record.gbifId === "3426465616").gbifAcceptedNameMatchesCurrentCatalog, false);
  assert.equal(admitted.find((record) => record.gbifId === "3426423630").acceptedName, "Giuris margaritaceus");
  assert.equal(admitted.find((record) => record.gbifId === "3426462603").acceptedName, "Ophiocara porocephalum");

  const held = followup.records.find((record) => record.decision === "hold-for-taxonomic-review");
  assert.equal(held.gbifId, "3426462605");
  assert.equal(held.acceptedName, null);
  assert.match(held.reason, /1837.*1801.*unresolved/i);
  assert.equal(held.authorities.length, 2);

  const casRecords = museum.records.filter((record) => record.institutionCode === "CAS");
  assert.equal(casRecords.filter((record) => record.decision === "admit-historical-source-locality-evidence").length, 16);
  assert.equal(casRecords.filter((record) => record.decision === "hold-for-taxonomic-review").length, 1);
  assert.equal(museum.summary.publicRecordsAdded, 0);
  assert.equal(museum.decision.publicAdmission, false);
  assert.equal(museum.decision.currentPresenceInferred, false);
  assert.equal(museum.decision.completeSpeciesInventoryClaimed, false);

  const taxonomySource = registry.sources.find((source) => source.id === "calabarzon-laguna-cof-taxonomy-crosscheck");
  assert.ok(taxonomySource.access.reviewFiles.includes("calabarzon-laguna-cas-taxonomy-followup-20261025.json"));
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.ok(/16-CAS-historical-source-name-mappings-supported/.test(taxonomySource.researchStatus));
});
