import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import guides from "../src/data/feeding-guides.json" with { type: "json" };
import taal from "../src/data/taal-checklist-evidence.json" with { type: "json" };
import {
  countEvidenceSpecies,
  filterFeedingGuides,
  filterHistoricalEvidence,
  filterTaalChecklist,
  normaliseSpeciesSearch,
} from "../src/lib/species-research.ts";

const records = [
  {
    acceptedName: "Channa striata",
    recordedName: "Ophicephalus striatus",
    acceptedTaxonId: "280130",
    localityGroup: "limbones-cove",
    collectedOn: null,
  },
  {
    acceptedName: "Channa striata",
    recordedName: "Channa striata",
    acceptedTaxonId: "280130",
    localityGroup: "cavite-manila-bay",
    collectedOn: "1947-10",
  },
  {
    acceptedName: "Oreochromis niloticus",
    recordedName: "Oreochromis niloticus",
    acceptedTaxonId: "293639",
    localityGroup: "limbones-cove",
    collectedOn: "2001-01-01",
  },
];

test("Taal name search uses only its reviewed package and preserves original records on clear", () => {
  const original = structuredClone(taal.records);
  assert.deepEqual(
    filterTaalChecklist(taal.records, "  TAWILIS  ").map((row) => row.scientificName),
    ["Sardinella tawilis"],
  );
  assert.equal(filterTaalChecklist(taal.records, "forsskal").length, 1);
  assert.equal(filterTaalChecklist(taal.records, "Caranx").length, 3);
  assert.deepEqual(filterTaalChecklist(taal.records, "not in this package"), []);
  assert.deepEqual(filterTaalChecklist(taal.records, ""), original);
  assert.deepEqual(taal.records, original);
  assert.equal(filterHistoricalEvidence(records, { query: "", locality: "all", date: "all" }).length, 3);
});

test("historical search handles case and diacritics and matches accepted or recorded names", () => {
  assert.equal(normaliseSpeciesSearch("  CÁVIte "), "cavite");
  assert.equal(filterHistoricalEvidence(records, { query: "ophicephalus", locality: "all", date: "all" }).length, 1);
  assert.equal(filterHistoricalEvidence(records, { query: "CHanna", locality: "all", date: "all" }).length, 2);
});

test("historical locality and dated/undated filters combine and count accepted taxa", () => {
  const result = filterHistoricalEvidence(records, { query: "", locality: "limbones-cove", date: "dated" });
  assert.equal(result.length, 1);
  assert.equal(result[0].acceptedName, "Oreochromis niloticus");
  assert.equal(countEvidenceSpecies(records.slice(0, 2)), 1);
  assert.deepEqual(filterHistoricalEvidence(records, { query: "missing", locality: "all", date: "all" }), []);
});

test("feeding guides filter by documented food group and searchable name or prey", () => {
  assert.deepEqual(
    filterFeedingGuides(guides.taxa, { query: "dalag", foodCategory: "all" }).map((guide) => guide.scientificName),
    ["Channa striata"],
  );
  assert.deepEqual(
    filterFeedingGuides(guides.taxa, { query: "", foodCategory: "fish" }).map((guide) => guide.scientificName),
    ["Channa striata"],
  );
  assert.deepEqual(
    filterFeedingGuides(guides.taxa, { query: "", foodCategory: "zooplankton" }).map((guide) => guide.scientificName),
    ["Otolithes ruber", "Stolephorus commersonnii", "Stolephorus indicus"],
  );
  assert.deepEqual(
    filterFeedingGuides(guides.taxa, { query: "crustaceans", foodCategory: "all" }).map(
      (guide) => guide.scientificName,
    ),
    ["Otolithes ruber", "Stolephorus commersonnii", "Stolephorus indicus"],
  );
  assert.deepEqual(
    filterFeedingGuides(guides.taxa, { query: "detritus", foodCategory: "all" }).map((guide) => guide.scientificName),
    ["Channa striata", "Oreochromis niloticus"],
  );
  assert.deepEqual(filterFeedingGuides(guides.taxa, { query: "fish", foodCategory: "algae" }), []);
});

test("published diet guidance keeps sources, taxon IDs, scope caveats and no unsupported bait advice", async () => {
  assert.equal(guides.catchingAdviceStatus, "not-reviewed");
  assert.equal(new Set(guides.taxa.map((guide) => guide.aphiaId)).size, guides.taxa.length);
  for (const guide of guides.taxa) {
    assert.ok(guide.taxonUrl.includes(`id=${guide.aphiaId}`));
    assert.ok(guide.studyContext.en.includes("not a Cavite diet survey"));
    assert.ok(guide.sources.length >= 2);
    assert.ok(guide.sources.every((source) => source.url.startsWith("https://") && source.locator));
  }
  const review = await readFile(new URL("../data/research/feeding-guides-review.md", import.meta.url), "utf8");
  assert.match(review, /CC BY 4\.0/);
  assert.match(review, /Diet is not treated as bait evidence/);
  assert.match(review, /Contextual catching advice remains unavailable/);
});
