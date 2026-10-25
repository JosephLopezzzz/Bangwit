import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parseCatalogResults, selectCatalogResult } from "./catalog-of-fishes-parser.mjs";

const root = new URL("../../", import.meta.url);
const detailsUrl = new URL("data/research/philippines/calabarzon-laguna-gbif-record-details-20261025.json", root);
const reviewUrl = new URL("data/research/philippines/calabarzon-laguna-cof-taxonomy-20261025.json", root);
const rawDirectory = new URL("data/research/philippines/raw/calabarzon-laguna-cof-taxonomy-20261025/", root);
const baseUrl = "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const binomial = (name) => name.split(/\s+/).slice(0, 2).join(" ");

async function fetchTaxon(name) {
  const [genus, species] = name.split(" ");
  const url = new URL(baseUrl);
  url.searchParams.set("genus", genus);
  url.searchParams.set("species", species);
  url.searchParams.set("tbl", "species");
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { accept: "text/html", "user-agent": "Bangwit research/1.0 (fish taxonomy cross-check)" },
        signal: AbortSignal.timeout(30000),
      });
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!response.ok) throw new Error(`Catalog of Fishes ${name}: HTTP ${response.status}`);
      const html = bytes.toString("utf8");
      const rows = parseCatalogResults(html);
      const selected = selectCatalogResult(name, rows);
      return { url: url.toString(), bytes, rows, ...selected };
    } catch (error) {
      lastError = error;
      if (attempt === 3) break;
      await wait(1000 * (attempt + 1));
    }
  }
  throw lastError;
}

async function main() {
  const detailsBytes = await readFile(detailsUrl);
  const details = JSON.parse(detailsBytes.toString("utf8"));
  assert.equal(details.status, "direct-occurrence-details-cross-checked;historical-assertion-decision-pending");
  assert.equal(details.summary.matchingTriageRecords, 18);
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });

  const binomials = [
    ...new Set(
      details.records.flatMap((record) => [record.scientificName, record.acceptedScientificName].map(binomial)),
    ),
  ].sort((left, right) => left.localeCompare(right));
  const taxonChecks = [];
  for (const name of binomials) {
    const result = await fetchTaxon(name);
    const rawName = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html`;
    await writeFile(new URL(rawName, rawDirectory), result.bytes);
    taxonChecks.push({
      queriedBinomial: name,
      url: result.url,
      classification: result.classification,
      catalogRowName: result.selected?.rowName ?? null,
      currentStatus: result.selected?.currentStatus ?? null,
      statusName: result.selected?.statusName ?? null,
      matchingRows: result.matchingRows,
      responseBytes: result.bytes.length,
      responseSha256: sha256(result.bytes),
      rawPath: `raw/calabarzon-laguna-cof-taxonomy-20261025/${rawName}`,
    });
    await wait(250);
  }
  const checksByName = new Map(taxonChecks.map((check) => [check.queriedBinomial, check]));
  const recordCrosswalk = details.records.map((record) => {
    const recordedBinomial = binomial(record.scientificName);
    const gbifAcceptedBinomial = binomial(record.acceptedScientificName ?? record.scientificName);
    const recorded = checksByName.get(recordedBinomial);
    const accepted = checksByName.get(gbifAcceptedBinomial);
    const recordedMapsToAccepted = Boolean(
      recorded?.statusName &&
        ["valid-name", "synonym"].includes(recorded.classification) &&
        binomial(recorded.statusName) === gbifAcceptedBinomial,
    );
    const acceptedNameConfirmed = Boolean(
      accepted?.classification === "valid-name" && binomial(accepted.statusName ?? "") === gbifAcceptedBinomial,
    );
    return {
      gbifId: record.gbifId,
      recordedName: record.scientificName,
      gbifAcceptedName: record.acceptedScientificName,
      recordedNameCatalogStatus: recorded?.currentStatus ?? null,
      acceptedNameCatalogStatus: accepted?.currentStatus ?? null,
      recordedNameMapsToGbifAccepted: recordedMapsToAccepted,
      gbifAcceptedNameConfirmed: acceptedNameConfirmed,
      taxonomyDisposition:
        recordedMapsToAccepted && acceptedNameConfirmed
          ? "independent-name-crosscheck-agrees"
          : "hold-for-taxonomic-review",
    };
  });
  const review = {
    schemaVersion: 1,
    batchId: "calabarzon-laguna-cof-taxonomy-20261025",
    reviewedOn: "2026-10-25",
    phaseId: "L1",
    regionId: "0400000000",
    waterbody: { id: "ph-wb-laguna-de-bay", name: "Laguna de Bay", kind: "lake" },
    status: "catalog-of-fishes-current-name-crosscheck-complete;occurrence-review-pending",
    authority: {
      name: "Eschmeyer's Catalog of Fishes",
      publisher: "California Academy of Sciences",
      homeUrl: "https://researcharchive.calacademy.org/research/ichthyology/catalog/",
      searchHelpUrl: "https://www.calacademy.org/scientists/catalog-of-fishes-help",
      sourcePageUrl: baseUrl,
      method:
        "Queried each recorded and GBIF-accepted genus/species binomial against the online species catalog; retained the displayed current-status text and response hashes.",
      limitation:
        "Nomenclature/status cross-check only. It does not identify the historical museum specimens, validate their collection localities, establish present-day occurrence, or grant reuse permission.",
    },
    input: {
      file: "calabarzon-laguna-gbif-record-details-20261025.json",
      sha256: sha256(detailsBytes),
      occurrenceRecordCount: details.records.length,
      distinctQueriedBinomials: binomials.length,
    },
    taxonChecks,
    recordCrosswalk,
    summary: {
      queriedBinomials: taxonChecks.length,
      statusesFound: taxonChecks.filter((check) => check.currentStatus).length,
      unresolvedStatuses: taxonChecks.filter((check) => !check.currentStatus).length,
      acceptedNameAgreements: recordCrosswalk.filter(
        (record) => record.taxonomyDisposition === "independent-name-crosscheck-agrees",
      ).length,
      taxonomicHolds: recordCrosswalk.filter(
        (record) => record.taxonomyDisposition !== "independent-name-crosscheck-agrees",
      ).length,
    },
    decision: {
      occurrenceAssertionsAdmitted: 0,
      publicRecordsAdded: 0,
      publicAdmission: false,
      localityInferredFromTypeLocality: false,
      currentPresenceInferred: false,
      completeSpeciesInventoryClaimed: false,
      interpretation:
        "This independent fish-name authority can confirm or challenge GBIF's name crosswalk only. Historical locality and specimen identity decisions remain separate, and no public occurrence row is admitted by this check.",
    },
  };
  await writeFile(reviewUrl, `${JSON.stringify(review, null, 2)}\n`);
  console.log(
    `Checked ${taxonChecks.length} Catalog of Fishes names; ${review.summary.acceptedNameAgreements}/${recordCrosswalk.length} occurrence rows agree with the GBIF accepted name. No occurrence assertions admitted.`,
  );
}

await main();
