import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import registry from "../src/data/species-explorer-release-registry.json" with { type: "json" };
import { EXPLORER_ASSERTIONS } from "../src/lib/species-explorer/adapters.ts";
import { DEFAULT_EXPLORER_FILTERS, groupExplorerSpecies, selectExplorerResults, selectReviewedFishingGuide, UNAVAILABLE_FISHING_GUIDE } from "../src/lib/species-explorer/selectors.ts";
import { createExplorerState, getExplorerSelectedScope, reconcileExplorerSelection, selectExplorerLocation, setExplorerFilters } from "../src/lib/species-explorer/state.ts";

const country = { kind: "country", id: "philippines" };
const region = { kind: "region", id: "map-region:iv-a" };
const cavite = { kind: "province", id: "2640588B43067672764099" };
const batangas = { kind: "province", id: "2640588B63294043497895" };
const taal = { kind: "waterbody", id: "ph-wb-taal-lake" };
const palico = { kind: "waterbody", id: "ph-wb-palico-lian-river" };
const query = (scope, filters = DEFAULT_EXPLORER_FILTERS, assertions = EXPLORER_ASSERTIONS) => selectExplorerResults(assertions, scope, filters);

test("only the exact existing public projection snapshots and rows are enabled", async () => {
  assert.equal(EXPLORER_ASSERTIONS.length, 28);
  for (const batch of registry.batches) {
    const bytes = await readFile(new URL(`../${batch.file}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), batch.sha256, `Re-review changed source projection ${batch.file}`);
    const rows = EXPLORER_ASSERTIONS.filter((row) => row.batchId === batch.batchId);
    assert.equal(rows.length, batch.records.length);
    assert.ok(rows.every((row) => row.currentPresence === false && row.coordinates === null));
  }
  assert.ok(!EXPLORER_ASSERTIONS.some((row) => /pasig|ncr-manila-bay|laguna-de-bay/.test(row.batchId)));
});

test("source-scoped record counts are partial and never include unavailable bays", () => {
  assert.equal(query(country).count, 28);
  assert.equal(query(region).count, 28);
  assert.equal(query(cavite).count, 12);
  assert.equal(query(batangas).count, 16);
  assert.equal(query(taal).count, 4);
  assert.equal(query(palico).count, 12);
  assert.equal(query({ kind: "waterbody", id: "ph-wb-limbones-cove" }).count, 5);
  assert.equal(query({ kind: "waterbody", id: "ph-wb-manila-bay" }).count, 4);
  for (const id of ["ph-wb-bacoor-bay", "ph-wb-canacao-bay", "unsupported-place"]) {
    const result = query({ kind: "waterbody", id });
    assert.equal(result.count, null);
    assert.equal(result.coverage, "unavailable");
    assert.equal(result.state, "unavailable");
  }
  assert.equal(query(country).coverage, "partial");
});

test("union counts deduplicate canonical authority-qualified concepts without summing provinces", () => {
  const first = EXPLORER_ASSERTIONS[0];
  const duplicate = { ...structuredClone(first), id: `${first.id}:another-source`, eligibleScopes: [...first.eligibleScopes, batangas] };
  const rows = [first, duplicate];
  assert.equal(groupExplorerSpecies(rows).length, 1);
  assert.equal(groupExplorerSpecies(rows)[0].assertions.length, 2);
  assert.equal(query(region, DEFAULT_EXPLORER_FILTERS, rows).count, 1);
  assert.equal(query(region, DEFAULT_EXPLORER_FILTERS, rows).assertionCount, 1, "a fabricated second source record is not admitted");
  assert.equal(query(batangas, DEFAULT_EXPLORER_FILTERS, rows).count, null, "changing scopes on a known row does not expand its publication eligibility");
  const otherAuthority = { ...structuredClone(duplicate), id: "other-authority", taxon: { ...first.taxon, authority: "gbif", id: `gbif:${first.taxon.authorityId}` } };
  assert.equal(groupExplorerSpecies([first, otherAuthority]).length, 2, "matching names or numbers do not create an approved cross-authority synonym mapping");
  assert.equal(query(region, DEFAULT_EXPLORER_FILTERS, [first, otherAuthority]).count, 1, "unreviewed cross-authority substitutions are not admitted");
});

test("held, unlisted, rights-blocked and nonspecies assertions cannot enter counts", () => {
  const first = EXPLORER_ASSERTIONS[0];
  const variants = [
    { ...first, batchId: "unlisted-new-batch" },
    { ...first, id: "unlisted-row-in-known-batch" },
    { ...first, source: { ...first.source, id: "unreviewed-source" } },
    { ...first, currentPresence: true },
    { ...first, coordinates: [120.8, 14.5] },
    { ...first, releaseStatus: "held" },
    { ...first, rightsStatus: "held" },
    { ...first, taxon: { ...first.taxon, rank: "genus" } },
    { ...first, taxon: { ...first.taxon, reviewStatus: "unreviewed" } },
    { ...first, taxon: { ...first.taxon, id: first.taxon.authorityId } },
  ];
  for (const row of variants) assert.equal(query(country, DEFAULT_EXPLORER_FILTERS, [row]).count, null);
  assert.equal(query(batangas, DEFAULT_EXPLORER_FILTERS, [{ ...first, eligibleScopes: [...first.eligibleScopes, batangas] }]).count, null);
});

test("unknown habitat stays unknown and filter-empty differs from missing coverage", () => {
  assert.ok(EXPLORER_ASSERTIONS.every((row) => row.waterTypes.length === 0));
  const before = structuredClone(EXPLORER_ASSERTIONS);
  const fresh = query(palico, { ...DEFAULT_EXPLORER_FILTERS, waterType: "freshwater" });
  assert.equal(fresh.count, 0);
  assert.equal(fresh.unfilteredCount, 12);
  assert.equal(fresh.unknownWaterTypeCount, 12);
  assert.equal(fresh.state, "filtered-empty");
  assert.equal(fresh.coverage, "partial");
  assert.equal(query(palico, { ...DEFAULT_EXPLORER_FILTERS, waterType: "unknown" }).count, 12);
  assert.equal(query(country, { ...DEFAULT_EXPLORER_FILTERS, group: "mollusk" }).count, 0);
  assert.deepEqual(EXPLORER_ASSERTIONS, before);
});

test("name search uses grounded names and retains source dates, permissions and marked-site limits", () => {
  const tilapia = query(palico, { ...DEFAULT_EXPLORER_FILTERS, query: "  NÍLE TILAPIA  " });
  assert.equal(tilapia.count, 1);
  assert.equal(tilapia.species[0].id, "worms:293639");
  assert.equal(tilapia.species[0].fishingGuide.status, "unreviewed");
  assert.equal(tilapia.species[0].fishingGuide.bait, null);
  const assertion = tilapia.species[0].assertions[0];
  assert.equal(assertion.source.license, null);
  assert.equal(assertion.source.permissionType, "custom-publisher-copy-distribution-grant");
  assert.equal(assertion.observedOn, null);
  assert.deepEqual(assertion.siteLabels, ["Site 1", "Site 2", "Site 3"]);
  assert.equal(query(cavite).species.find((item) => item.scientificName === "Mirolabrichthys tuka").id, "worms:312510");
  assert.ok(EXPLORER_ASSERTIONS.some((row) => row.observedOn === "1947-10"));
});

test("guide publication requires independently reviewed fields, applicable scope and fresh rule review", () => {
  const guide = {
    ...structuredClone(UNAVAILABLE_FISHING_GUIDE), status: "partial", reviewedOn: "2026-11-08", applicableScopes: [palico],
    method: { en: "Reviewed method fixture", fil: "Sinuring paraan sa fixture" }, bait: { en: "Unreviewed bait must not appear", fil: "Hindi dapat lumabas ang hindi sinuring pain" },
    reviewedFields: ["method"], sources: [EXPLORER_ASSERTIONS[0].source],
    rulesReview: { status: "reviewed", jurisdiction: "Fixture jurisdiction", validFrom: "2026-11-01", validUntil: "2026-11-30" },
  };
  const result = selectReviewedFishingGuide(guide, palico, "2026-11-08");
  assert.equal(result.method.en, "Reviewed method fixture");
  assert.equal(result.bait, null);
  assert.equal(selectReviewedFishingGuide(guide, taal, "2026-11-08").status, "unreviewed");
  assert.equal(selectReviewedFishingGuide(guide, palico, "2026-12-01").status, "unreviewed");
  assert.equal(selectReviewedFishingGuide({ ...guide, rulesReview: { ...guide.rulesReview, status: "unreviewed" } }, palico, "2026-11-08").method, null);
  assert.equal(selectReviewedFishingGuide({ ...guide, reviewedOn: "2026-11-09" }, palico, "2026-11-08").method, null);
});

test("navigation reconciles children, keeps shared-waterbody precision and does not mutate prior state", () => {
  const geography = { regions: [{ id: region.id, provinceIds: [cavite.id, batangas.id] }], waterbodies: [{ id: taal.id, provinceIds: [batangas.id] }, { id: "ph-wb-manila-bay", provinceIds: [cavite.id, "other-region-province"] }] };
  const state = createExplorerState({ regionId: region.id, provinceId: cavite.id });
  const original = structuredClone(state);
  const next = selectExplorerLocation({ ...state, selectedSpeciesId: "worms:123", expanded: true }, taal, geography);
  assert.equal(next.selection.provinceId, batangas.id);
  assert.equal(next.selectedSpeciesId, null);
  assert.equal(next.expanded, false);
  assert.deepEqual(state, original);
  assert.deepEqual(getExplorerSelectedScope(next.selection), taal);
  const shared = selectExplorerLocation(createExplorerState(), { kind: "waterbody", id: "ph-wb-manila-bay" }, geography);
  assert.equal(shared.selection.provinceId, null);
  assert.equal(shared.selection.waterbodyId, "ph-wb-manila-bay");
  assert.deepEqual(reconcileExplorerSelection(shared.selection, geography), shared.selection);
  assert.equal(reconcileExplorerSelection({ regionId: region.id, provinceId: cavite.id, waterbodyId: taal.id }, geography).waterbodyId, null);
  assert.equal(setExplorerFilters({ ...state, selectedSpeciesId: "worms:123", expanded: true }, { query: "tilapia" }).selectedSpeciesId, null);
});
