import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);
const detailsUrl = new URL("data/research/philippines/calabarzon-laguna-gbif-record-details-20261025.json", root);
const taxonomyUrl = new URL("data/research/philippines/calabarzon-laguna-cof-taxonomy-20261025.json", root);
const reviewUrl = new URL(
  "data/research/philippines/calabarzon-laguna-museum-catalog-verification-20261025.json",
  root,
);
const searchBaseUrl = "https://ala-hub.sibbr.gov.br/ala-hub/proxy/occurrences/search";
const detailBaseUrl = "https://ala-hub.sibbr.gov.br/ala-hub/proxy/occurrences";
const collectionUid = "co119";
const expectedOccurrenceId = "9d743c1c-b99b-4d99-bde2-8d65a9370534";
const expectedCatalogNumber = "118522";
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function fetchJson(url, label) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "Bangwit research/1.0 (Laguna historical catalog verification)",
    },
    signal: AbortSignal.timeout(30000),
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(response.ok, true, `${label}: HTTP ${response.status}`);
  return { body: JSON.parse(bytes.toString("utf8")), bytes };
}

function eventDate(event) {
  if (!event.year) return null;
  return [event.year, String(event.month ?? "01").padStart(2, "0"), String(event.day ?? "01").padStart(2, "0")].join(
    "-",
  );
}

async function main() {
  const [detailsBytes, taxonomyBytes] = await Promise.all([readFile(detailsUrl), readFile(taxonomyUrl)]);
  const details = JSON.parse(detailsBytes.toString("utf8"));
  const taxonomy = JSON.parse(taxonomyBytes.toString("utf8"));
  const gbifRecord = details.records.find((record) => record.occurrenceId === expectedOccurrenceId);
  assert.ok(gbifRecord, "Expected MZUSP occurrence must remain in the GBIF detail batch");
  const ariidaeCrosswalk = taxonomy.recordCrosswalk.find((record) => record.gbifId === gbifRecord.gbifId);
  assert.ok(ariidaeCrosswalk, "Expected Catalog of Fishes crosswalk must be present");

  const searchUrl = new URL(searchBaseUrl);
  searchUrl.searchParams.set("q", `collection_uid:${collectionUid} AND catalogNumber:${expectedCatalogNumber}`);
  searchUrl.searchParams.set("pageSize", "20");
  const searchResult = await fetchJson(searchUrl, "MZUSP collection search");
  const matchingRows = (searchResult.body.occurrences ?? [])
    .filter(
      (row) =>
        row.collectionUid === collectionUid &&
        row.raw_catalogNumber === expectedCatalogNumber &&
        row.occurrenceID === expectedOccurrenceId,
    )
    .sort((left, right) => left.uuid.localeCompare(right.uuid));
  assert.ok(matchingRows.length > 0, "MZUSP collection search must return the expected source identifier");

  const retrievedRows = [];
  for (const row of matchingRows) {
    const itemUrl = `${detailBaseUrl}/${encodeURIComponent(row.uuid)}`;
    const item = await fetchJson(itemUrl, `MZUSP catalog record ${row.uuid}`);
    const sourceOccurrence = item.body.raw?.occurrence;
    const sourceClassification = item.body.raw?.classification;
    const sourceLocation = item.body.raw?.location;
    const sourceEvent = item.body.raw?.event;
    const sourceAttribution = item.body.raw?.attribution;
    assert.equal(sourceOccurrence?.occurrenceID, expectedOccurrenceId);
    assert.equal(sourceOccurrence?.catalogNumber, expectedCatalogNumber);
    assert.equal(sourceOccurrence?.institutionCode, "MZUSP");
    assert.equal(sourceOccurrence?.collectionCode, "ICT");

    const itemTaxon = sourceClassification?.scientificName ?? null;
    const itemLocality = sourceLocation?.locality ?? null;
    retrievedRows.push({
      portalRecordId: row.uuid,
      dataResourceUid: row.dataResourceUid,
      sourceIdentity: {
        institutionCode: sourceOccurrence.institutionCode,
        collectionCode: sourceOccurrence.collectionCode,
        catalogNumber: sourceOccurrence.catalogNumber,
        occurrenceId: sourceOccurrence.occurrenceID,
        basisOfRecord: sourceOccurrence.basisOfRecord,
      },
      recordEraFields: {
        scientificName: itemTaxon,
        genus: sourceClassification?.genus ?? null,
        family: sourceClassification?.family ?? null,
        eventDate: eventDate(sourceEvent ?? {}),
        country: sourceLocation?.country ?? null,
        stateProvince: sourceLocation?.stateProvince ?? null,
        county: sourceLocation?.county ?? null,
        locality: itemLocality,
        waterBody: sourceLocation?.waterBody ?? null,
      },
      portalInterpretation: {
        scientificName: row.scientificName ?? null,
        taxonRank: row.taxonRank ?? null,
        taxonFamily: row.family ?? null,
        assertions: [...(row.assertions ?? [])].sort(),
      },
      reuse: {
        portalRecordLicense: row.license ?? null,
        detailLicense: sourceAttribution?.license ?? null,
      },
      recordUrl: `https://ala-hub.sibbr.gov.br/ala-hub/occurrence/index/${encodeURIComponent(row.uuid)}`,
      detailResponse: { bytes: item.bytes.length, sha256: sha256(item.bytes) },
      identityMatchesGbif: sourceOccurrence.occurrenceID === gbifRecord.occurrenceId,
      catalogNumberMatchesGbif: sourceOccurrence.catalogNumber === gbifRecord.catalogNumber,
      scientificNameMatchesGbif: itemTaxon === gbifRecord.scientificName.replace(/\s+[A-Z].*$/, ""),
      eventDateMatchesGbif: eventDate(sourceEvent ?? {}) === gbifRecord.eventDate,
      localityMatchesGbif: itemLocality === gbifRecord.locality,
      licenseConflictWithGbif:
        Boolean(row.license) &&
        Boolean(gbifRecord.license) &&
        !row.license
          .toLowerCase()
          .includes(
            gbifRecord.license.toLowerCase().replace(/^https?:\/\/(www\.)?creativecommons\.org\/licenses\//, ""),
          ),
      sourceRecordHasSpeciesRank: row.taxonRank === "species",
    });
  }

  const uniqueOccurrenceIds = [...new Set(retrievedRows.map((row) => row.sourceIdentity.occurrenceId))];
  assert.deepEqual(uniqueOccurrenceIds, [expectedOccurrenceId]);
  const casRecordCount = details.records.filter((record) => record.institutionCode === "CAS").length;
  assert.equal(casRecordCount, 17);
  const records = details.records.map((record) => {
    if (record.occurrenceId === expectedOccurrenceId) {
      const sourceRows = retrievedRows;
      const first = sourceRows[0];
      return {
        gbifId: record.gbifId,
        sourceInstitutionCode: "MZUSP",
        sourceCollectionCode: "ICT",
        institutionCode: record.institutionCode,
        collectionCode: record.collectionCode,
        catalogNumber: record.catalogNumber,
        occurrenceId: record.occurrenceId,
        taxonomyDisposition: ariidaeCrosswalk.taxonomyDisposition,
        sourceCatalogStatus:
          "institution-linked-catalog-record-retrieved;duplicate-portal-rows-share-one-occurrence-id",
        sourcePortalRecordIds: sourceRows.map((row) => row.portalRecordId),
        sourceRecordIdentityMatches: first.identityMatchesGbif,
        sourceCatalogNumberMatches: first.catalogNumberMatchesGbif,
        sourceNameMatches: first.scientificNameMatchesGbif,
        sourceEventDateMatches: first.eventDateMatchesGbif,
        sourceLocalityMatches: first.localityMatchesGbif,
        sourceLocality: first.recordEraFields.locality,
        sourceWaterBodyField: first.recordEraFields.waterBody,
        sourceRecordTaxon: first.recordEraFields.scientificName,
        portalInterpretedRank: first.portalInterpretation.taxonRank,
        portalAssertions: first.portalInterpretation.assertions,
        sourceRecordHasSpeciesRank: first.sourceRecordHasSpeciesRank,
        portalLocalityAssertionConflict:
          Boolean(first.recordEraFields.locality) &&
          first.portalInterpretation.assertions.includes("LOCATION_NOT_SUPPLIED"),
        gbifLicense: record.license,
        sourcePortalLicense: first.reuse.portalRecordLicense,
        detailLicense: first.reuse.detailLicense,
        useRightsDisposition: sourceRows.some((row) => row.licenseConflictWithGbif)
          ? "hold-conflicting-gbif-and-source-record-licenses;collection-profile-use-terms-unspecified"
          : "hold-pending-item-specific-use-review",
        decision: "hold-no-historical-assertion",
        holdReasons: [
          "The MZUSP portal indexes the original species name but interprets the occurrence only at family rank.",
          "The source detail contains locality text, but the portal also asserts LOCATION_NOT_SUPPLIED and has no waterBody field; treat locality precision as unresolved.",
          "The source portal record reports CC BY-NC while the GBIF detail record reports a different license; collection-level reuse conditions are not specified.",
        ],
        sourceRecords: sourceRows,
      };
    }
    return {
      gbifId: record.gbifId,
      institutionCode: record.institutionCode,
      collectionCode: record.collectionCode,
      catalogNumber: record.catalogNumber,
      occurrenceId: record.occurrenceId,
      taxonomyDisposition:
        taxonomy.recordCrosswalk.find((row) => row.gbifId === record.gbifId)?.taxonomyDisposition ?? null,
      sourceCatalogStatus: "not-independently-verified-cas-collection-search-offline",
      decision: "hold-no-historical-assertion",
      holdReasons: [
        "The current public CAS Monarch collection portal displays an offline notice; the legacy catalog URL returned a generic shell without item-level record content.",
        "No absence claim is made; the source item must be checked when CAS catalog access is restored or by another authorized source route.",
      ],
    };
  });

  const review = {
    schemaVersion: 1,
    batchId: "calabarzon-laguna-museum-catalog-verification-20261025",
    reviewedOn: "2026-10-25",
    phaseId: "L1",
    regionId: "0400000000",
    waterbody: { id: "ph-wb-laguna-de-bay", name: "Laguna de Bay", kind: "lake" },
    status: "partial-institution-linked-catalog-check;all-18-records-held",
    inputs: [
      {
        file: "calabarzon-laguna-gbif-record-details-20261025.json",
        sha256: sha256(detailsBytes),
      },
      {
        file: "calabarzon-laguna-cof-taxonomy-20261025.json",
        sha256: sha256(taxonomyBytes),
      },
    ],
    method: {
      mzuspOfficialCollectionPage: "https://mz.usp.br/pt/laboratorios/ictiologia/",
      mzuspCatalogPortal: "https://ala-hub.sibbr.gov.br/ala-hub/occurrence/search?q=collection_uid%3Aco119",
      mzuspSearchUrl: searchUrl.toString(),
      apiDocsUrl: "https://specieslink.net/ws/1.0/",
      speciesLinkApiAccess: "The public SpeciesLink API requires an API key; no key was used or included.",
      mzuspCollectionProfile: "https://specieslink.net/col/MZUSP/",
      mzuspMethod:
        "MZUSP's official ichthyology page links its online collection to the SiBBr-hosted occurrence catalog. Queried the MZUSP collection UID and source catalog number, then retrieved each portal record by UUID. Only allowlisted non-coordinate fields were retained; response hashes cover the full response bytes.",
      casPortal: {
        collectionSearchHelp: "https://researcharchive.calacademy.org/research/ichthyology/collection/help.asp",
        currentPortalUrl: "https://monarch.calacademy.org/collections/list.php?db=6&reset=1",
        checkedOn: "2026-10-25",
        result:
          "The CAS Monarch portal displayed an offline notice stating it had been taken offline on 2026-10-21 while rebuilt. One legacy CAS catalog-number query returned HTTP 200 generic portal shell HTML with no item-level record fields. Seventeen CAS occurrence items therefore remain unverified; this is an access limitation, not evidence that those items do not exist.",
      },
      limitations: [
        "A portal record match does not establish that a specimen was re-identified by an expert or that the reported locality is geographically precise.",
        "A source/GBIF license conflict is held for rights review; no permission is inferred from availability through a public portal.",
        "No record establishes present-day presence, abundance, catchability, safety, or a complete Laguna de Bay checklist.",
      ],
    },
    sourceCollectionSearch: {
      status: searchResult.body.status,
      totalRecords: searchResult.body.totalRecords,
      retrievedMatchingRows: retrievedRows.length,
      uniqueOccurrenceIds,
      searchResponse: { bytes: searchResult.bytes.length, sha256: sha256(searchResult.bytes) },
    },
    records,
    summary: {
      candidateRecords: records.length,
      casRowsNotIndependentlyVerified: records.filter((record) => record.institutionCode === "CAS").length,
      mzuspPortalRows: retrievedRows.length,
      mzuspUniqueSourceOccurrences: uniqueOccurrenceIds.length,
      mzuspSourceIdentityMatches: records.filter(
        (record) => record.sourceInstitutionCode === "MZUSP" && record.sourceRecordIdentityMatches,
      ).length,
      mzuspRankConflicts: records.filter(
        (record) => record.sourceInstitutionCode === "MZUSP" && !record.sourceRecordHasSpeciesRank,
      ).length,
      mzuspLicenseConflicts: records.filter(
        (record) =>
          record.sourceInstitutionCode === "MZUSP" && record.useRightsDisposition.startsWith("hold-conflicting"),
      ).length,
      mzuspLocalityAssertionConflicts: records.filter(
        (record) => record.sourceInstitutionCode === "MZUSP" && record.portalLocalityAssertionConflict,
      ).length,
      historicalAssertionsAdmitted: 0,
      publicRecordsAdded: 0,
    },
    decision: {
      occurrenceAssertionsAdmitted: 0,
      publicRecordsAdded: 0,
      publicAdmission: false,
      coordinatesIncluded: false,
      currentPresenceInferred: false,
      completeSpeciesInventoryClaimed: false,
      interpretation:
        "The MZUSP-linked portal identifies the exact source record but contains unresolved rank and reuse-license conflicts. CAS item records could not be retrieved while the public portal is offline. All 18 records remain research-only pending independent source identity, locality, taxonomy, and rights review.",
    },
  };
  await writeFile(reviewUrl, `${JSON.stringify(review, null, 2)}\n`);
  console.log(
    `Checked ${retrievedRows.length} MZUSP portal rows for one unique source occurrence; ${casRecordCount} CAS rows remain unverified. All ${records.length} records stay held; no occurrence assertions admitted.`,
  );
}

await main();
