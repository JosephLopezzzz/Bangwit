import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const outputPath = resolve(root, "data/research/philippines/administrative-registry.json");
const defaultInput = resolve(root, "data/research/philippines/raw/psa-directory-capture-20261022.json");
const rollout = [
  ["04", "luzon", "L1", 5],
  ["13", "luzon", "L2", 0],
  ["03", "luzon", "L3", 7],
  ["01", "luzon", "L4", 4],
  ["02", "luzon", "L5", 5],
  ["14", "luzon", "L6", 6],
  ["05", "luzon", "L7", 6],
  ["17", "luzon", "L8", 5],
  ["06", "visayas", "V1", 5],
  ["18", "visayas", "V2", 3],
  ["07", "visayas", "V3", 2],
  ["08", "visayas", "V4", 6],
  ["10", "mindanao", "M1", 5],
  ["11", "mindanao", "M2", 5],
  ["16", "mindanao", "M3", 5],
  ["12", "mindanao", "M4", 4],
  ["09", "mindanao", "M5", 4],
  ["19", "mindanao", "M6", 5],
];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function tableRows(document) {
  return document.lines.flatMap(({ line, text }) => {
    const row = /^【\d+†([^】]+)】\s+\|\s+(\d{10})\s+\|\s*(\d{9})?\s*\|/.exec(text);
    return row
      ? [{ name: row[1].normalize("NFC"), code: row[2], correspondenceCode: row[3] || null, sourceLine: line }]
      : [];
  });
}

/** Builds only the research inventory, never application geography or species assertions. */
export function buildAdministrativeRegistry(capture, captureSha256) {
  assert.equal(capture.schemaVersion, 1);
  const documents = new Map(capture.documents.map((document) => [document.id, document]));
  const document = (id) => {
    assert.ok(documents.has(id), `Missing official directory capture: ${id}`);
    return documents.get(id);
  };
  const regionText = document("regions")
    .lines.map(({ text }) => text)
    .join("\n");
  const sourceRegions = new Map(
    [
      ...regionText.matchAll(
        /^([^\n]+?)\s+\|\s+10 Digit Code:\n(\d{10})\s+\|\s+Correspondence Code:\n(?:(\d{9})\n)?/gm,
      ),
    ].map((match) => [match[2], { name: match[1], correspondenceCode: match[3] || null }]),
  );
  assert.equal(sourceRegions.size, 18, "The capture must contain all 18 official region identities");
  const regions = rollout.map(([prefix, rolloutGroup, rolloutKey, expectedProvinceCount], index) => {
    const id = `${prefix}00000000`;
    assert.ok(sourceRegions.has(id), `Missing region ${id}`);
    return {
      id,
      ...sourceRegions.get(id),
      rolloutGroup,
      rolloutOrder: index + 1,
      rolloutKey,
      expectedProvinceCount,
      sourceId: "regions",
    };
  });

  const makeUnits = (id, level, cityClass = null) =>
    tableRows(document(id)).map((row) => ({
      ...row,
      level,
      regionId: `${row.code.slice(0, 2)}00000000`,
      cityClass,
      provinceCode: null,
      sourceId: id,
    }));
  const provinces = makeUnits("provinces", "province");
  const cities = [...makeUnits("hucs", "city", "HUC"), ...makeUnits("iccs", "city", "ICC")];
  const isabela = makeUnits("component-cities", "city", "CC").find(({ code }) => code === "0990101000");
  assert.ok(isabela, "The separately assigned City of Isabela must be present");
  isabela.notes =
    "PSGC regional assignment is Region IX. Kept separately from the BARMM Basilan province coverage unit; CC is the source classification, not an independence claim.";
  const specialMunicipalities = makeUnits("special-area-municipalities", "municipality").map((unit) => ({
    ...unit,
    statisticalGroupingCode: "1999900000",
  }));
  const administrativeUnits = [
    ...provinces,
    ...cities,
    isabela,
    ...makeUnits("ncr-municipality", "municipality"),
    ...specialMunicipalities,
  ];
  const provinceCodes = new Set(provinces.map(({ code }) => code));
  for (const unit of administrativeUnits) {
    // A code-encoded province is a source association, not an administrative parent for an ICC/HUC.
    const encodedProvince = `${unit.code.slice(0, 5)}00000`;
    unit.sourceEncodedProvinceCode =
      unit.level !== "province" && provinceCodes.has(encodedProvince) ? encodedProvince : null;
    unit.coverageParentCode = unit.regionId;
    if (unit.code === "0431200000")
      unit.notes =
        "PSA 3Q 2026 treats Lucena as HUC for statistical purposes, pending applicable RA 7160 requirements. This is not a legal ruling on HUC status.";
  }
  const regionOrder = new Map(regions.map(({ id, rolloutOrder }) => [id, rolloutOrder]));
  administrativeUnits.sort(
    (a, b) => regionOrder.get(a.regionId) - regionOrder.get(b.regionId) || a.code.localeCompare(b.code, "en"),
  );

  const registry = {
    schemaVersion: 1,
    status: "research-only-directory-baseline",
    snapshotDate: "2026-09-30",
    source: {
      publisher: "Philippine Statistics Authority",
      releaseTitle: "Third Quarter 2026 PSGC Updates: Correction of the Name of One Barangay",
      releaseDate: "2026-10-12",
      releaseUrl: "https://psa.gov.ph/classification/psgc/node/1684084314",
      capturedOn: capture.capturedOn,
      captureMethod: capture.captureMethod,
      captureSha256,
      hashScope:
        "SHA-256 of the local JSON capture bytes; document hashes cover serialized extracted lines, not original HTML or XLSX bytes.",
      workbookVerification: "pending",
      workbook: capture.blockedWorkbook,
      directoryHeadingDate: "2025-07-31",
      temporalNotes:
        "The intended control snapshot is PSA 3Q 2026. Identities/classifications are from official directory tables captured on the stated date; several table headings still say 31 July 2025, while their footer links to the 30 September 2026 publication. Exact masterlist row verification remains pending because the XLSX request returned 403. Do not treat this as a fully audited 3Q 2026 workbook import or apply current assignments retroactively to historical evidence.",
      license: "CC-BY-4.0",
      licenseEvidence:
        "Official PSA directory/release footer: all data and content are CC BY 4.0 unless otherwise stated.",
      documents: capture.documents.map(({ id, url, extraction, lines }) => ({
        id,
        url,
        extraction,
        capturedOn: capture.capturedOn,
        contentSha256: sha256(JSON.stringify(lines)),
        capturedLineCount: lines.length,
      })),
    },
    scope: {
      included:
        "All 82 provinces; all 33 source-listed HUCs and 5 ICCs; NCR's 16 cities and Pateros (cities overlap the HUC count); separately assigned Isabela City; and the eight BARMM SGA municipalities.",
      excluded:
        "Ordinary component cities, province-contained municipalities, barangays and map geometries are outside this first coverage-unit registry.",
      parentSemantics:
        "coverageParentCode and regionId are the current regional coverage assignment. provinceCode is null for these province/outside-province coverage units. sourceEncodedProvinceCode preserves an association encoded in a city PSGC, not a legal parent or a polygon-containment result. SGA is a statistical grouping, not an 83rd province.",
      rolloutGrouping:
        "Luzon then Visayas then Mindanao is the project delivery convention. MIMAROPA/Palawan is included in the Luzon phase; administrative membership, physical islands and ecological basins are distinct.",
    },
    counts: {
      regions: regions.length,
      provinces: provinces.length,
      highlyUrbanizedCities: cities.filter(({ cityClass }) => cityClass === "HUC").length,
      independentComponentCities: cities.filter(({ cityClass }) => cityClass === "ICC").length,
      separatelyAssignedComponentCities: 1,
      ncrCities: cities.filter(({ regionId }) => regionId === "1300000000").length,
      ncrMunicipalities: 1,
      specialGeographicAreaMunicipalities: specialMunicipalities.length,
      administrativeUnits: administrativeUnits.length,
    },
    regions,
    statisticalGroupings: [
      {
        code: "1999900000",
        name: "Special Geographic Area",
        regionId: "1900000000",
        provinceCode: null,
        sourceId: "special-area-summary",
        sourceLine: 485,
      },
    ],
    administrativeUnits,
  };
  validateAdministrativeRegistry(registry);
  return registry;
}

export function validateAdministrativeRegistry(registry) {
  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.regions.length, 18);
  assert.equal(new Set(registry.regions.map(({ id }) => id)).size, 18);
  assert.equal(new Set(registry.administrativeUnits.map(({ code }) => code)).size, registry.administrativeUnits.length);
  assert.equal(registry.administrativeUnits.length, 130);
  const regionIds = new Set(registry.regions.map(({ id }) => id));
  for (const unit of registry.administrativeUnits) {
    assert.match(unit.code, /^\d{10}$/);
    assert.ok(regionIds.has(unit.regionId), `Unknown region for ${unit.code}`);
    assert.ok(["province", "city", "municipality"].includes(unit.level));
  }
  for (const region of registry.regions)
    assert.equal(
      registry.administrativeUnits.filter(({ level, regionId }) => level === "province" && regionId === region.id)
        .length,
      region.expectedProvinceCount,
      `Province count for ${region.name}`,
    );
  assert.equal(registry.administrativeUnits.filter(({ level }) => level === "province").length, 82);
  assert.equal(registry.administrativeUnits.filter(({ cityClass }) => cityClass === "HUC").length, 33);
  assert.equal(registry.administrativeUnits.filter(({ cityClass }) => cityClass === "ICC").length, 5);
  assert.equal(registry.source.workbookVerification, "pending");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv[2] === "--check") {
    validateAdministrativeRegistry(JSON.parse(await readFile(outputPath, "utf8")));
    console.log(
      "Administrative registry validated: 18 regions, 82 provinces, 130 coverage units; workbook verification pending.",
    );
  } else {
    const bytes = await readFile(process.argv[2] ? resolve(process.argv[2]) : defaultInput);
    const registry = buildAdministrativeRegistry(JSON.parse(bytes.toString("utf8")), sha256(bytes));
    await writeFile(outputPath, `${JSON.stringify(registry, null, 2)}\n`);
    console.log(`Wrote ${registry.counts.administrativeUnits} research coverage units; no public/map data changed.`);
  }
}
