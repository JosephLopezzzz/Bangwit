import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../../data/research/philippines/", import.meta.url);
const tableReview = JSON.parse(await readFile(new URL("central-luzon-bataan-river-table-review-20261024.json", root), "utf8"));
const taxonomyReview = JSON.parse(await readFile(new URL("central-luzon-bataan-cof-name-review-20261024.json", root), "utf8"));

const taxonomyByName = new Map(taxonomyReview.records.map((record) => [record.sourceNameVerbatim, record]));
const source = tableReview.source;
const records = tableReview.sourceTableReview.records.map((record, index) => {
  const taxon = taxonomyByName.get(record.sourceName) ?? null;
  const identityStatus = !taxon
    ? /\bsp\./i.test(record.sourceName)
      ? "genus-only-identity-unresolved"
      : "hybrid-identity-held"
    : "catalog-nomenclature-proposal-only";

  return {
    candidateId: `bataan-historical-table-${String(index + 1).padStart(3, "0")}`,
    sourceTableRowNumber: index + 1,
    sourceNameVerbatim: record.sourceName,
    sourceFamilyVerbatim: record.familyAsPrinted,
    sourcePresence: { ...record.presence },
    sourceCodes: {
      origin: record.sourceOriginCode,
      position: record.sourcePositionCode,
      reproduction: record.sourceReproductionText,
      interpretation: "Codes transcribed as printed; source attributes these classifications to FishBase. Not independently reviewed and excluded from app use.",
    },
    taxonomicReview: taxon
      ? {
          status: identityStatus,
          catalogStatus: taxon.catalogStatus,
          proposedCurrentName: taxon.catalogName,
          proposedFamily: taxon.catalogFamily,
          evidenceUrl: taxon.evidenceUrl,
          independentFishIdentificationVerified: false,
        }
      : {
          status: identityStatus,
          proposedCurrentName: null,
          proposedFamily: null,
          independentFishIdentificationVerified: false,
        },
    evidenceInterpretation: "The cited paper reports this row in the river presence matrix for a historical survey; this ledger does not independently verify the specimen identification, current presence, abundance, catchability, habitat class, or a precise reach.",
    publicAssertion: false,
    appProjection: false,
  };
});

const ledger = {
  schemaVersion: 1,
  reviewedOn: "2026-10-24",
  status: "source-scoped-historical-assertions-prepared-identity-and-geometry-held",
  regionId: "0300000000",
  regionName: "Region III (Central Luzon)",
  source: {
    id: source.id,
    citation: source.citation,
    url: source.articleUrl,
    license: source.license,
    licenseEvidence: source.licenseEvidence,
    studyPeriod: source.studyPeriod,
    siteDesign: source.siteDesign,
    sourceTable: "Table 2",
    localityLimits: source.localityLimits,
    salinityLimits: source.salinityLimits,
  },
  interpretation: "Research ledger only. Table 2 records historical presence for the three named river systems; it is not a current checklist or a validated river-reach map. The source's taxonomic names are preserved verbatim and Catalog of Fishes matches remain nomenclatural proposals, not proof that the authors identified each fish correctly.",
  coverage: {
    sourceRows: records.length,
    riverSystems: Object.keys(tableReview.sourceTableReview.perRiverRows),
    reportedRowsByRiver: tableReview.sourceTableReview.perRiverRows,
    presenceCells: records.reduce((count, record) => count + Object.values(record.sourcePresence).filter(Boolean).length, 0),
    nomenclatureProposalRows: records.filter((record) => record.taxonomicReview.status === "catalog-nomenclature-proposal-only").length,
    unresolvedGenusOnlyRows: records.filter((record) => record.taxonomicReview.status === "genus-only-identity-unresolved").length,
    heldHybridRows: records.filter((record) => record.taxonomicReview.status === "hybrid-identity-held").length,
    independentlyVerifiedIdentities: 0,
    publicAssertions: 0,
    appProjections: 0,
  },
  nextStep: "Review independent identification evidence and source-era river reach mapping. Keep all records research-only until identity, locality and regional rights checks pass.",
  records,
};

const outputUrl = new URL("central-luzon-bataan-historical-evidence-ledger-20261024.json", root);
const output = `${JSON.stringify(ledger, null, 2)}\n`;
if (process.argv.includes("--check")) {
  const existing = await readFile(outputUrl, "utf8");
  if (existing !== output) throw new Error("Bataan evidence ledger is stale; rebuild it and re-review the change");
} else {
  await writeFile(outputUrl, output);
}
