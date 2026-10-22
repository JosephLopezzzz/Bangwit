import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { validateAdministrativeRegistry } from "../scripts/species/build-administrative-registry.mjs";

const registry = JSON.parse(
  await readFile(new URL("../data/research/philippines/administrative-registry.json", import.meta.url), "utf8"),
);
const units = new Map(registry.administrativeUnits.map((unit) => [unit.code, unit]));

test("accounts for the 18 rollout regions, 82 provinces and outside-province coverage units", () => {
  validateAdministrativeRegistry(registry);
  assert.deepEqual(
    registry.regions.map(({ id }) => id.slice(0, 2)),
    ["04", "13", "03", "01", "02", "14", "05", "17", "06", "18", "07", "08", "10", "11", "16", "12", "09", "19"],
  );
  assert.deepEqual(
    ["luzon", "visayas", "mindanao"].map((group) => {
      const ids = registry.regions.filter(({ rolloutGroup }) => rolloutGroup === group).map(({ id }) => id);
      return [
        ids.length,
        registry.administrativeUnits.filter(({ level, regionId }) => level === "province" && ids.includes(regionId))
          .length,
      ];
    }),
    [
      [8, 38],
      [4, 16],
      [6, 28],
    ],
  );
  assert.equal(registry.counts.administrativeUnits, 130);
  assert.equal(registry.counts.highlyUrbanizedCities, 33);
  assert.equal(registry.counts.independentComponentCities, 5);
});

test("uses current NIR and Sulu assignments while preserving correspondence codes", () => {
  assert.deepEqual(
    registry.administrativeUnits
      .filter(({ level, regionId }) => level === "province" && regionId === "1800000000")
      .map(({ name }) => name)
      .sort(),
    ["Negros Occidental", "Negros Oriental", "Siquijor"],
  );
  assert.equal(units.get("1830200000").name, "City of Bacolod");
  assert.equal(units.get("1830200000").regionId, "1800000000");
  assert.equal(units.get("1804500000").correspondenceCode, "064500000");
  assert.equal(units.get("0906600000").name, "Sulu");
  assert.equal(units.get("0906600000").regionId, "0900000000");
  assert.equal(units.get("0906600000").correspondenceCode, "156600000");
  assert.equal(units.has("1906600000"), false);
  assert.equal(units.get("1705300000").name, "Palawan");
  assert.equal(units.get("1705300000").regionId, "1700000000");
});

test("keeps Isabela City separate from Basilan and Cotabato City separate from province parenting", () => {
  assert.equal(units.get("1900700000").name, "Basilan");
  assert.equal(units.get("1900700000").regionId, "1900000000");
  const isabela = units.get("0990101000");
  assert.equal(isabela.name, "City of Isabela");
  assert.equal(isabela.cityClass, "CC");
  assert.equal(isabela.regionId, "0900000000");
  assert.equal(isabela.provinceCode, null);
  const cotabato = units.get("1908703000");
  assert.equal(cotabato.name, "City of Cotabato");
  assert.equal(cotabato.cityClass, "ICC");
  assert.equal(cotabato.regionId, "1900000000");
  assert.equal(cotabato.correspondenceCode, "129804000");
  assert.equal(cotabato.provinceCode, null);
  assert.equal(cotabato.sourceEncodedProvinceCode, "1908700000");
  assert.equal(cotabato.coverageParentCode, "1900000000");
  assert.ok(units.has("1908700000"));
  assert.ok(units.has("1908800000"));
  assert.match(units.get("0431200000").notes, /statistical purposes/);
});

test("includes all 17 NCR LGUs and eight SGA municipalities without inventing a province", () => {
  const ncr = registry.administrativeUnits.filter(({ regionId }) => regionId === "1300000000");
  assert.equal(ncr.length, 17);
  assert.equal(ncr.filter(({ level }) => level === "city").length, 16);
  assert.equal(units.get("1381701000").name, "Pateros");
  assert.equal(units.get("1381701000").level, "municipality");
  const sga = registry.administrativeUnits.filter(
    ({ statisticalGroupingCode }) => statisticalGroupingCode === "1999900000",
  );
  assert.equal(sga.length, 8);
  assert.deepEqual(sga.map(({ name }) => name).sort(), [
    "Kadayangan",
    "Kapalawan",
    "Ligawasan",
    "Malidegao",
    "Nabalawag",
    "Old Kaabakan",
    "Pahamuddin",
    "Tugunan",
  ]);
  assert.ok(sga.every(({ regionId, provinceCode }) => regionId === "1900000000" && provinceCode === null));
  assert.equal(units.has("1999900000"), false);
});

test("records capture provenance and does not claim the blocked workbook was imported", () => {
  assert.equal(registry.snapshotDate, "2026-09-30");
  assert.equal(registry.source.releaseDate, "2026-10-12");
  assert.equal(registry.source.capturedOn, "2026-10-22");
  assert.equal(registry.source.workbookVerification, "pending");
  assert.equal(registry.source.workbook.status, 403);
  assert.match(registry.source.captureSha256, /^[a-f0-9]{64}$/);
  assert.ok(
    registry.source.documents.every(
      ({ url, contentSha256 }) => new URL(url).hostname === "psa.gov.ph" && /^[a-f0-9]{64}$/.test(contentSha256),
    ),
  );
  assert.match(registry.source.temporalNotes, /31 July 2025/);
  assert.match(registry.source.hashScope, /not original HTML or XLSX bytes/);
});

test("rejects duplicate units and a region-assignment regression", () => {
  const duplicate = structuredClone(registry);
  duplicate.administrativeUnits[0] = structuredClone(duplicate.administrativeUnits[1]);
  assert.throws(() => validateAdministrativeRegistry(duplicate));
  const staleSulu = structuredClone(registry);
  staleSulu.administrativeUnits.find(({ code }) => code === "0906600000").regionId = "1900000000";
  assert.throws(() => validateAdministrativeRegistry(staleSulu), /Province count/);
});
