import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);
const detailsUrl = new URL("data/research/philippines/calabarzon-laguna-gbif-record-details-20261025.json", root);
const taxonomyUrl = new URL("data/research/philippines/calabarzon-laguna-cof-taxonomy-20261025.json", root);
const casArchiveCrosswalkUrl = new URL(
  "data/research/philippines/calabarzon-laguna-cas-archive-crosswalk-20261025.json",
  root,
);
const casTaxonomyFollowupUrl = new URL(
  "data/research/philippines/calabarzon-laguna-cas-taxonomy-followup-20261025.json",
  root,
);
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
  const [detailsBytes, taxonomyBytes, casArchiveBytes, casTaxonomyFollowupBytes, existingReviewBytes] = await Promise.all([
    readFile(detailsUrl),
    readFile(taxonomyUrl),
    readFile(casArchiveCrosswalkUrl),
    readFile(casTaxonomyFollowupUrl),
    readFile(reviewUrl),
  ]);
  const details = JSON.parse(detailsBytes.toString("utf8"));
  const taxonomy = JSON.parse(taxonomyBytes.toString("utf8"));
  const casArchiveCrosswalk = JSON.parse(casArchiveBytes.toString("utf8"));
  const existingReview = JSON.parse(existingReviewBytes.toString("utf8"));
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
    const sourceTaxonRank = sourceClassification?.taxonRank ?? null;
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
        taxonRank: sourceTaxonRank,
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
      sourceRecordHasSpeciesRank: ["species", "espécie"].includes(sourceTaxonRank?.toLocaleLowerCase("pt-BR")),
    });
  }

  const uniqueOccurrenceIds = [...new Set(retrievedRows.map((row) => row.sourceIdentity.occurrenceId))];
  assert.deepEqual(uniqueOccurrenceIds, [expectedOccurrenceId]);
  const casRecords = existingReview.records.filter((row) => row.institutionCode === "CAS");
  assert.equal(casRecords.length, 17);
  assert.ok(casRecords.every((record) => record.decision === "admit-historical-source-locality-evidence"));
  const record = details.records.find((row) => row.occurrenceId === expectedOccurrenceId);
  assert.ok(record, "Expected MZUSP occurrence must remain in the GBIF detail batch");
  const sourceRows = retrievedRows;
  const first = sourceRows[0];
  const sourceRanks = [...new Set(sourceRows.map((row) => row.recordEraFields.taxonRank).filter(Boolean))];
  const sourceRecordHasSpeciesRank = sourceRows.some((row) => row.sourceRecordHasSpeciesRank);
  const portalMissingGeospatialLocationDespiteLocalityText =
    Boolean(first.recordEraFields.locality) &&
    first.portalInterpretation.assertions.includes("LOCATION_NOT_SUPPLIED");
  const sourcePortalRankConflict = sourceRecordHasSpeciesRank && first.portalInterpretation.taxonRank !== "species";
  const mzuspRecord = {
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
    sourceLocalityTextPresent: Boolean(first.recordEraFields.locality),
    sourceLocality: first.recordEraFields.locality,
    sourceWaterBodyField: first.recordEraFields.waterBody,
    sourceRecordTaxon: first.recordEraFields.scientificName,
    sourceClassificationTaxonRanks: sourceRanks,
    sourceClassificationRankMetadataDisagrees: sourceRanks.length > 1 || sourceRows.some(
      (row) => !row.recordEraFields.taxonRank,
    ),
    portalInterpretedRank: first.portalInterpretation.taxonRank,
    sourcePortalRankConflict,
    portalAssertions: first.portalInterpretation.assertions,
    sourceRecordHasSpeciesRank,
    portalMissingGeospatialLocationDespiteLocalityText,
    gbifLicense: record.license,
    sourcePortalLicense: first.reuse.portalRecordLicense,
    detailLicense: first.reuse.detailLicense,
    useRightsDisposition: sourceRows.some((row) => row.licenseConflictWithGbif)
      ? "hold-conflicting-gbif-and-source-record-licenses;collection-profile-use-terms-unspecified"
      : "hold-pending-item-specific-use-review",
    decision: "hold-no-public-assertion",
    holdReasons: [
      "The source-linked copies disagree on raw rank metadata: one records Espécie and the other omits rank; both SiBBr portal interpretations resolve only to family Ariidae. The current Catalog of Fishes cross-check supports Arius dispar as a valid name but does not independently identify this specimen.",
      "The source record includes the locality string Laguna de Bay, while the portal reports that a geospatial location was not supplied and the source has no waterBody field. Preserve the text locality only; do not infer a precise point or map location.",
      "The source record reports CC BY-NC while GBIF reports CC BY; keep the candidate out of public app projections until the provider-specific reuse terms are clarified.",
    ],
    sourceRecords: sourceRows,
  };
  const records = [...casRecords, mzuspRecord];
  const casRecordCount = casRecords.length;

  const review = {
    schemaVersion: 1,
    batchId: "calabarzon-laguna-museum-catalog-verification-20261025",
    reviewedOn: "2026-10-25",
    phaseId: "L1",
    regionId: "0400000000",
    waterbody: { id: "ph-wb-laguna-de-bay", name: "Laguna de Bay", kind: "lake" },
    status: "17-CAS-archive-identities-verified;17-CAS-historical-assertions-admitted-research-only;one-MZUSP-rank-and-rights-hold",
    inputs: [
      {
        file: "calabarzon-laguna-gbif-record-details-20261025.json",
        sha256: sha256(detailsBytes),
      },
      {
        file: "calabarzon-laguna-cof-taxonomy-20261025.json",
        sha256: sha256(taxonomyBytes),
      },
      {
        file: "calabarzon-laguna-cas-archive-crosswalk-20261025.json",
        sha256: sha256(casArchiveBytes),
      },
      {
        file: "calabarzon-laguna-cas-taxonomy-followup-20261025.json",
        sha256: sha256(casTaxonomyFollowupBytes),
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
          "The CAS Monarch portal displayed an offline notice stating it had been taken offline on 2026-10-21 while rebuilt. The official CAS IPT archive release 150.545 independently matched 17 exact collection-qualified source records; the portal outage is retained as an access note and is not a specimen-absence finding.",
      },
      casArchive: {
        url: "http://ipt.calacademy.org:8080/archive.do?r=ich",
        resourceUrl: "http://ipt.calacademy.org:8080/resource?r=ich&v=150.545",
        datasetVersion: casArchiveCrosswalk.archive.datasetVersion,
        publishedDate: casArchiveCrosswalk.archive.publishedDate,
        reviewFile: "calabarzon-laguna-cas-archive-crosswalk-20261025.json",
        archiveSha256: casArchiveCrosswalk.archive.sha256,
        archiveBytes: casArchiveCrosswalk.archive.bytes,
        exactCandidateMatches: casRecords.length,
        sourceLocalityAndDateMatches: casRecords.length,
        sourceCc0Rows: casRecords.length,
        historicalLedgerAdmissions: casRecords.filter(
          (row) => row.decision === "admit-historical-source-locality-evidence",
        ).length,
        taxonomicHolds: casRecords.filter((row) => row.decision === "hold-for-taxonomic-review").length,
        trackedCoordinates: false,
      },
      limitations: [
        "A portal record match does not establish that a specimen was re-identified by an expert or that the reported locality is geographically precise.",
        "The MZUSP source linked record reports CC BY-NC while GBIF reports CC BY; keep its content out of public projections pending provider-specific reuse clarification.",
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
      casSourceItemsDirectlyVerified: casRecordCount,
      casHistoricalAssertionsAdmitted: casRecords.filter(
        (row) => row.decision === "admit-historical-source-locality-evidence",
      ).length,
      casTaxonomyHolds: casRecords.filter((row) => row.decision === "hold-for-taxonomic-review").length,
      mzuspPortalRows: retrievedRows.length,
      mzuspUniqueSourceOccurrences: uniqueOccurrenceIds.length,
      mzuspSourceIdentityMatches: records.filter(
        (record) => record.sourceInstitutionCode === "MZUSP" && record.sourceRecordIdentityMatches,
      ).length,
      mzuspRankConflicts: records.filter(
        (row) => row.sourceInstitutionCode === "MZUSP" && row.sourcePortalRankConflict,
      ).length,
      mzuspLicenseConflicts: records.filter(
        (record) =>
          record.sourceInstitutionCode === "MZUSP" && record.useRightsDisposition.startsWith("hold-conflicting"),
      ).length,
      mzuspMissingGeospatialLocationAssertions: records.filter(
        (row) => row.sourceInstitutionCode === "MZUSP" && row.portalMissingGeospatialLocationDespiteLocalityText,
      ).length,
      historicalAssertionsAdmitted: casRecords.filter(
        (row) => row.decision === "admit-historical-source-locality-evidence",
      ).length,
      publicRecordsAdded: 0,
    },
    decision: {
      occurrenceAssertionsAdmitted: casRecords.filter(
        (row) => row.decision === "admit-historical-source-locality-evidence",
      ).length,
      publicRecordsAdded: 0,
      publicAdmission: false,
      coordinatesIncluded: false,
      currentPresenceInferred: false,
      completeSpeciesInventoryClaimed: false,
      interpretation:
        "The official CAS archive supports 17 exact historical source-locality assertions, admitted only to the non-public research ledger. One distinct MZUSP source item is matched by collection, catalog number and occurrence ID; its duplicate source-linked copies disagree on rank metadata, and both portal interpretations resolve to family Ariidae despite one raw source classification marking Espécie. The source locality string Laguna de Bay is present, but a geospatial location was not supplied and no waterBody field exists. The source-level CC BY-NC label conflicts with GBIF's CC BY label, so the MZUSP item remains held from public projections pending provider-specific rights clarification. No coordinates, current-presence claim or complete checklist are added.",
    },
  };
  await writeFile(reviewUrl, `${JSON.stringify(review, null, 2)}\n`);
  console.log(
    `Checked ${retrievedRows.length} MZUSP portal rows for one unique source occurrence; ${casRecordCount} CAS source items remain verified. ${review.summary.historicalAssertionsAdmitted} CAS assertions stay research-only; no public occurrence rows admitted.`,
  );
}

await main();
