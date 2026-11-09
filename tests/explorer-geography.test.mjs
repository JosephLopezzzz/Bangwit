import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  EXPLORER_COUNTRY_ID,
  EXPLORER_GEOGRAPHY_SOURCE,
  EXPLORER_PROVINCES,
  EXPLORER_REGIONS,
  EXPLORER_WATERBODIES,
  getExplorerProvinces,
  getExplorerRegionForProvince,
  getExplorerWaterbodies,
} from "../src/data/explorer-geography.ts";
import { PHILIPPINE_PROVINCES } from "../src/data/phl-provinces.ts";

test("source-era navigation keeps every existing province ID exactly once", () => {
  assert.equal(EXPLORER_COUNTRY_ID, "philippines");
  assert.equal(EXPLORER_PROVINCES.length, 81);
  assert.equal(EXPLORER_GEOGRAPHY_SOURCE.outlineYear, 2020);
  assert.equal(EXPLORER_REGIONS.length, 17);
  assert.deepEqual(EXPLORER_PROVINCES.map(({ id }) => id), PHILIPPINE_PROVINCES.map(({ id }) => id));
  const assignedIds = EXPLORER_REGIONS.flatMap(({ provinceIds }) => provinceIds);
  assert.equal(new Set(assignedIds).size, 81);
  assert.equal(assignedIds.length, 81);
  for (const province of EXPLORER_PROVINCES) {
    assert.equal(getExplorerRegionForProvince(province.id)?.id, province.regionId);
    assert.ok(getExplorerProvinces(province.regionId).some(({ id }) => id === province.id));
  }
});

test("legacy exceptions stay explicit instead of inventing current outlines", () => {
  const province = (sourceName) => EXPLORER_PROVINCES.find((item) => item.sourceName === sourceName);
  assert.equal(province("Maguindanao")?.regionId, "map-region:barmm");
  assert.equal(province("Sulu")?.regionId, "map-region:barmm");
  assert.equal(province("Negros Occidental")?.regionId, "map-region:vi");
  assert.equal(province("Negros Oriental")?.regionId, "map-region:vii");
  assert.equal(province("Siquijor")?.regionId, "map-region:vii");
  assert.ok(province("Compostela Valley")?.aliases.includes("Davao de Oro"));
  assert.equal(EXPLORER_REGIONS.find(({ id }) => id === "map-region:ncr")?.bounds, null);
  assert.deepEqual(getExplorerProvinces("map-region:ncr"), []);
  assert.equal(getExplorerRegionForProvince("not-a-map-province"), null);
  assert.deepEqual(getExplorerWaterbodies("not-a-map-province"), []);
});

test("region framing contains its province bounds without altering polygon geometry", () => {
  for (const region of EXPLORER_REGIONS) {
    if (!region.bounds) continue;
    for (const province of getExplorerProvinces(region.id)) {
      assert.ok(province.bounds.x >= region.bounds.x);
      assert.ok(province.bounds.y >= region.bounds.y);
      assert.ok(province.bounds.x + province.bounds.width <= region.bounds.x + region.bounds.width + 1e-8);
      assert.ok(province.bounds.y + province.bounds.height <= region.bounds.y + region.bounds.height + 1e-8);
    }
  }
});

test("shared waterbody navigation is many-to-many and does not carry evidence permissions", () => {
  for (const id of ["ph-wb-manila-bay", "ph-wb-laguna-de-bay"]) {
    const body = EXPLORER_WATERBODIES.find((item) => item.id === id);
    assert.ok(body.provinceIds.length > 1);
    assert.ok(body.regionIds.length > 1);
    assert.equal(Object.hasOwn(body, "rollupEligible"), false);
    assert.equal(Object.hasOwn(body, "species"), false);
  }
  assert.equal(new Set(EXPLORER_WATERBODIES.map(({ id }) => id)).size, EXPLORER_WATERBODIES.length);
});

test("artwork derivatives match canonical IDs, checksums and bounded transfer budgets", async () => {
  const registry = JSON.parse(await readFile(new URL("../src/data/species-artwork.json", import.meta.url), "utf8"));
  assert.equal(registry.records.length, 8);
  assert.equal(new Set(registry.records.map(({ taxonId }) => taxonId)).size, registry.records.length);
  for (const artwork of registry.records) {
    assert.match(artwork.taxonId, /^worms:\d+$/);
    assert.equal(artwork.width, 384);
    assert.equal(artwork.height, 256);
    assert.ok(artwork.alt.en && artwork.alt.fil);
    assert.ok(artwork.habitat.en && artwork.habitat.fil);
    const bytes = await readFile(new URL(`../public${artwork.src}`, import.meta.url));
    const hash = createHash("sha256").update(bytes).digest("hex");
    assert.equal(hash, artwork.provenance.derivativeSha256);
    assert.ok(artwork.src.endsWith(`.${hash.slice(0, 12)}.webp`));
    assert.equal(bytes.length, artwork.provenance.bytes);
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    assert.ok(bytes.includes(Buffer.from("dc:source")), "embedded original provenance");
    assert.ok(bytes.includes(Buffer.from("dc:description")), "embedded generation prompt");
    const sidecar = JSON.parse(await readFile(new URL(`../public${artwork.src}.json`, import.meta.url), "utf8"));
    const normalizedPrompt = sidecar.prompt.replace(/\r\n/g, "\n");
    assert.equal(createHash("sha256").update(normalizedPrompt).digest("hex"), artwork.provenance.promptSha256);
  }
  const worstFourBytes = registry.records.map(({ provenance }) => provenance.bytes).sort((a, b) => b - a).slice(0, 4).reduce((sum, bytes) => sum + bytes, 0);
  assert.ok(worstFourBytes < 150_000);
});
