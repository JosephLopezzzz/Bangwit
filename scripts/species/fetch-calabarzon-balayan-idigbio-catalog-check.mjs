import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const detailPath = new URL("data/research/philippines/calabarzon-balayan-gbif-record-details-20261025.json", root);
const reviewPath = new URL("data/research/philippines/calabarzon-balayan-idigbio-catalog-check-20261025.json", root);
const rawDirectory = new URL("data/research/philippines/raw/calabarzon-balayan-idigbio-catalog-check-20261025/", root);
const apiBase = "https://search.idigbio.org/v2";
const apiDocs = "https://github.com/iDigBio/idigbio-search-api/wiki/Query-Format";
const wait = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const normalized = (value) =>
  String(value ?? "")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/\s+/g, " ");

async function getJson(url, label) {
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { accept: "application/json", "user-agent": "Bangwit-research/1.0 (catalog cross-check)" },
        signal: AbortSignal.timeout(30000),
      });
      const bytes = Buffer.from(await response.arrayBuffer());
      const body = JSON.parse(bytes.toString("utf8"));
      if (!response.ok) throw new Error(`${label}: HTTP ${response.status}: ${body.message ?? response.statusText}`);
      return { body, bytes };
    } catch (error) {
      lastError = error;
      if (attempt === 3) break;
      await wait(1000 * (attempt + 1));
    }
  }
  throw lastError;
}

function fields(record) {
  const data = record?.data ?? {};
  const index = record?.indexTerms ?? {};
  const get = (...keys) => {
    for (const key of keys) {
      const value =
        data[key] ??
        data[key.toLowerCase()] ??
        (key.includes(":") ? undefined : data[`dwc:${key}`]) ??
        index[key.toLowerCase()];
      if (value !== undefined && value !== null && value !== "") {
        return Array.isArray(value) ? value.join("; ") : value;
      }
    }
    return null;
  };
  return {
    uuid: record?.uuid ?? get("uuid"),
    scientificName: get("dwc:scientificName", "scientificName", "scientificname"),
    canonicalName: get("canonicalname", "canonicalName"),
    taxonRank: get("dwc:taxonRank", "taxonRank", "taxonrank"),
    eventDate: data["dwc:eventDate"] ?? data.eventDate ?? null,
    sourceDateComponents: {
      year: data["dwc:year"] ?? null,
      month: data["dwc:month"] ?? null,
      day: data["dwc:day"] ?? null,
      verbatimEventDate: data["dwc:verbatimEventDate"] ?? null,
    },
    indexedDateCollected: index.datecollected ?? null,
    country: get("country"),
    stateProvince: get("stateprovince", "stateProvince"),
    county: get("county"),
    municipality: get("municipality"),
    waterBody: get("dwc:waterBody", "waterBody", "waterbody"),
    locality: get("dwc:locality", "locality"),
    verbatimLocality: get("dwc:verbatimLocality", "verbatimLocality", "verbatimlocality"),
    institutionCode: get("dwc:institutionCode", "institutionCode", "institutioncode"),
    collectionCode: get("dwc:collectionCode", "collectionCode", "collectioncode"),
    catalogNumber: get("dwc:catalogNumber", "catalogNumber", "catalognumber"),
    occurrenceId: get("dwc:occurrenceID", "occurrenceID", "occurrenceid"),
    recordset: get("recordset"),
    license: get("dcterms:license", "license", "rights"),
  };
}

function recordsetFields(recordset) {
  const data = recordset?.data ?? {};
  const index = recordset?.indexTerms ?? {};
  const get = (...keys) => {
    for (const key of keys) {
      const value = data[key] ?? data[key.toLowerCase()] ?? index[key.toLowerCase()];
      if (value !== undefined && value !== null && value !== "") return Array.isArray(value) ? value.join("; ") : value;
    }
    return null;
  };
  return {
    uuid: recordset?.uuid ?? null,
    name: get("name", "collection_name", "collectionName", "datasetName"),
    institutionName: get("institution_name", "institutionName"),
    collectionName: get("collection_name", "collectionName"),
    dataRights: get("data_rights", "dataRights", "rights"),
    dataRightsUri: get("data_rights_uri", "dataRightsUri", "license"),
    recordsetUrl: recordset?.uuid ? `${apiBase}/view/recordsets/${recordset.uuid}` : null,
  };
}

function identityKey(value) {
  return [value.institutionCode, value.collectionCode, value.catalogNumber, value.scientificName]
    .map(normalized)
    .join("|");
}

function sourceDateValue(record) {
  if (record.eventDate) return record.eventDate;
  const { year, month, day } = record.sourceDateComponents;
  if (!year) return null;
  return `${year}${month ? `-${String(month).padStart(2, "0")}` : ""}${day ? `-${String(day).padStart(2, "0")}` : ""}`;
}

function indexedDateAddsPrecision(record) {
  const sourceDate = sourceDateValue(record);
  const indexedDate = record.indexedDateCollected?.slice(0, 10);
  return Boolean(sourceDate && indexedDate?.startsWith(sourceDate) && indexedDate.length > sourceDate.length);
}

async function main() {
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });
  const detailsBytes = await readFile(detailPath);
  const detailReview = JSON.parse(detailsBytes.toString("utf8"));
  assert.equal(detailReview.summary.searchCandidates, 14);
  const identities = new Map();
  for (const record of detailReview.records) {
    const identity = {
      institutionCode: record.institutionCode,
      collectionCode: record.collectionCode,
      catalogNumber: record.catalogNumber,
      scientificName: record.scientificName,
      acceptedScientificName: record.acceptedScientificName ?? record.scientificName,
      gbifScientificName: record.scientificName,
      gbifIds: [],
      gbifIssues: [],
      queryVariants: [],
    };
    const key = identityKey(identity);
    const existing = identities.get(key) ?? identity;
    existing.gbifIds.push(record.gbifId);
    existing.gbifIssues = [...new Set([...existing.gbifIssues, ...record.issues])].sort();
    identities.set(key, existing);
  }

  const searches = [];
  const uniqueRecords = new Map();
  for (const identity of identities.values()) {
    const base = { institutioncode: identity.institutionCode, catalognumber: identity.catalogNumber };
    const variants =
      identity.institutionCode === "USNM"
        ? [
            { ...base, scientificname: identity.scientificName.split(/\s+/).slice(0, 2).join(" ") },
            {
              ...base,
              catalognumber: identity.catalogNumber.replace(/^USNM\s+/i, ""),
              scientificname: identity.scientificName.split(/\s+/).slice(0, 2).join(" "),
            },
          ]
        : [identity.collectionCode ? { ...base, collectioncode: identity.collectionCode } : base];
    if (identity.institutionCode === "UMMZ") variants.push(base);
    const uniqueVariants = [...new Map(variants.map((query) => [JSON.stringify(query), query])).values()];
    identity.queryVariants = uniqueVariants;

    for (const [variantIndex, query] of uniqueVariants.entries()) {
      const queryText = JSON.stringify(query);
      const url = `${apiBase}/search/records/?rq=${encodeURIComponent(queryText)}&limit=100`;
      const { body, bytes } = await getJson(url, `iDigBio search ${identity.catalogNumber}`);
      assert.ok(Array.isArray(body.items), "iDigBio search response must have an items array.");
      const rawName = `search-${identity.gbifIds[0]}-${variantIndex + 1}.json`;
      await writeFile(new URL(rawName, rawDirectory), bytes);
      const search = {
        gbifIds: identity.gbifIds,
        identity: {
          institutionCode: identity.institutionCode,
          collectionCode: identity.collectionCode,
          catalogNumber: identity.catalogNumber,
          scientificName: identity.scientificName,
        },
        query,
        count: body.itemCount ?? body.count ?? body.items.length,
        returned: body.items.length,
        rawResponse: {
          path: `raw/calabarzon-balayan-idigbio-catalog-check-20261025/${rawName}`,
          bytes: bytes.length,
          sha256: sha256(bytes),
        },
      };
      searches.push(search);
      for (const item of body.items) {
        const value = fields(item);
        const sameInstitution = normalized(value.institutionCode) === normalized(identity.institutionCode);
        const stripInstitution = (value) => normalized(value).replace(/^[a-z0-9]+\s+/, "");
        const sameCatalog = stripInstitution(value.catalogNumber) === stripInstitution(identity.catalogNumber);
        const sameCollection =
          !identity.collectionCode || normalized(value.collectionCode) === normalized(identity.collectionCode);
        if (value.uuid && sameInstitution && sameCatalog && sameCollection) {
          const existing = uniqueRecords.get(value.uuid) ?? { record: item, identities: [] };
          existing.identities.push(identity);
          uniqueRecords.set(value.uuid, existing);
        }
      }
      await wait(120);
    }
  }

  const records = [];
  const recordsets = new Map();
  for (const { record: searchRecord, identities: matchedIdentities } of uniqueRecords.values()) {
    const { body, bytes } = await getJson(
      `${apiBase}/view/records/${searchRecord.uuid}`,
      `iDigBio record ${searchRecord.uuid}`,
    );
    const record = fields(body);
    assert.equal(record.uuid, searchRecord.uuid);
    const identitiesForRecord = [
      ...new Map(matchedIdentities.map((identity) => [identityKey(identity), identity])).values(),
    ];
    const linkedIdentity =
      identitiesForRecord.find(
        (identity) =>
          normalized(record.institutionCode) === normalized(identity.institutionCode) &&
          normalized(record.catalogNumber).replace(/^[a-z0-9]+\s+/, "") ===
            normalized(identity.catalogNumber).replace(/^[a-z0-9]+\s+/, "") &&
          (!identity.collectionCode || normalized(record.collectionCode) === normalized(identity.collectionCode)),
      ) ?? null;
    const binomial = (name) => normalized(name).split(/\s+/).slice(0, 2).join(" ");
    const nameMatch = linkedIdentity
      ? binomial(record.scientificName) === binomial(linkedIdentity.scientificName) ||
        binomial(record.canonicalName) === binomial(linkedIdentity.scientificName)
      : false;
    const rawName = `record-${record.uuid}.json`;
    await writeFile(new URL(rawName, rawDirectory), bytes);

    if (record.recordset && !recordsets.has(record.recordset)) {
      try {
        const result = await getJson(
          `${apiBase}/view/recordsets/${record.recordset}`,
          `iDigBio recordset ${record.recordset}`,
        );
        const recordsetRawName = `recordset-${record.recordset}.json`;
        await writeFile(new URL(recordsetRawName, rawDirectory), result.bytes);
        const metadata = recordsetFields(result.body);
        recordsets.set(record.recordset, {
          ...metadata,
          rawResponse: {
            path: `raw/calabarzon-balayan-idigbio-catalog-check-20261025/${recordsetRawName}`,
            bytes: result.bytes.length,
            sha256: sha256(result.bytes),
          },
        });
      } catch (error) {
        recordsets.set(record.recordset, { uuid: record.recordset, retrievalError: error.message });
      }
    }

    records.push({
      ...record,
      recordUrl: `${apiBase}/view/records/${record.uuid}`,
      matchedGbifCatalogIdentity: linkedIdentity
        ? {
            institutionCode: linkedIdentity.institutionCode,
            collectionCode: linkedIdentity.collectionCode,
            catalogNumber: linkedIdentity.catalogNumber,
            gbifIds: linkedIdentity.gbifIds,
            gbifIssues: linkedIdentity.gbifIssues,
          }
        : null,
      binomialMatchesGbifName: nameMatch,
      localityMentionsBalayanBay: /balayan\s+bay/i.test(
        `${record.waterBody ?? ""} ${record.locality ?? ""} ${record.verbatimLocality ?? ""}`,
      ),
      rawResponse: {
        path: `raw/calabarzon-balayan-idigbio-catalog-check-20261025/${rawName}`,
        bytes: bytes.length,
        sha256: sha256(bytes),
      },
    });
    await wait(120);
  }

  const exactSourceIdentityMatches = new Set(
    records
      .filter((record) => record.matchedGbifCatalogIdentity)
      .map(
        (record) =>
          `${record.matchedGbifCatalogIdentity.institutionCode}|${record.matchedGbifCatalogIdentity.collectionCode}|${record.matchedGbifCatalogIdentity.catalogNumber}`,
      ),
  ).size;
  const recordsWithBalayanLocality = records.filter((record) => record.localityMentionsBalayanBay).length;
  const usnm = records.filter((record) => normalized(record.institutionCode) === "usnm");
  const usnmLocalitiesAmbiguous = usnm.some((record) =>
    /sombrero|verde island passage/i.test(
      `${record.waterBody ?? ""} ${record.locality ?? ""} ${record.verbatimLocality ?? ""}`,
    ),
  );
  const unresolvedIdentities = [...identities.values()].filter(
    (identity) =>
      !records.some(
        (record) =>
          record.matchedGbifCatalogIdentity?.catalogNumber === identity.catalogNumber &&
          record.matchedGbifCatalogIdentity?.institutionCode === identity.institutionCode,
      ),
  );

  const report = {
    schemaVersion: 1,
    title: "Balayan Bay GBIF museum catalog identities cross-checked against iDigBio",
    reviewedOn: "2026-10-25",
    provider: "iDigBio Search API v2; indexed source records contributed by natural history collections",
    apiBase,
    queryDocumentation: apiDocs,
    input: {
      file: "calabarzon-balayan-gbif-record-details-20261025.json",
      sha256: sha256(detailsBytes),
      gbifCandidates: detailReview.summary.searchCandidates,
      uniqueGbifCatalogIdentities: identities.size,
    },
    searches: searches.map(({ identity, query, count, returned, rawResponse, gbifIds }) => ({
      gbifIds,
      identity,
      query,
      count,
      returned,
      rawResponse,
    })),
    records: records.sort((a, b) => String(a.uuid).localeCompare(String(b.uuid))),
    recordsets: [...recordsets.values()].sort((a, b) => String(a.uuid).localeCompare(String(b.uuid))),
    unresolvedIdentities: unresolvedIdentities.map((identity) => ({
      institutionCode: identity.institutionCode,
      collectionCode: identity.collectionCode,
      catalogNumber: identity.catalogNumber,
      scientificName: identity.scientificName,
      gbifIds: identity.gbifIds,
      gbifIssues: identity.gbifIssues,
    })),
    summary: {
      uniqueGbifCatalogIdentities: identities.size,
      iDigBioCatalogRecords: records.length,
      exactSourceIdentityMatches,
      recordsWithBalayanBayLocalityText: recordsWithBalayanLocality,
      matchedRecordsets: recordsets.size,
      unresolvedGbifCatalogIdentities: unresolvedIdentities.length,
      usnmMaterialCitationRows: usnm.reduce(
        (sum, record) => sum + (record.matchedGbifCatalogIdentity?.gbifIds.length ?? 0),
        0,
      ),
      usnmCatalogIdentityCount: usnm.length,
      usnmLocalityScopeAmbiguous: usnmLocalitiesAmbiguous,
      recordsetRights: [
        ...new Set(
          [...recordsets.values()].map((recordset) => recordset.dataRightsUri ?? recordset.dataRights).filter(Boolean),
        ),
      ].sort(),
      recordRights: [...new Set(records.map((record) => record.license).filter(Boolean))].sort(),
      recordsWithSourceEventDate: records.filter((record) => record.eventDate).length,
      recordsWithYearOnlySourceDate: records.filter(
        (record) =>
          record.sourceDateComponents.year &&
          !record.sourceDateComponents.month &&
          !record.sourceDateComponents.day &&
          !record.eventDate,
      ).length,
      recordsWithIndexedDateMorePreciseThanSourceFields: records.filter(indexedDateAddsPrecision).length,
    },
    decision: {
      sourceType: "aggregated-museum-record-crosswalk; not independent specimen evidence",
      historicalAssertionsAdmitted: 0,
      publicRecordsAdded: 0,
      publicAdmission: false,
      coordinatesIncluded: false,
      currentPresenceInferred: false,
      completeSpeciesInventoryClaimed: false,
      interpretation:
        "iDigBio's indexed records help resolve catalog identifiers and source-reported context, but remain copies of provider records rather than independent confirmations. Raw provider eventDate and date components are kept separate from iDigBio's normalized dateCollected index; do not promote inferred day precision into a source date. Keep every candidate research-only pending source-item, locality, taxonomy, quality and item-level reuse review. The USNM catalog identity is shared by five GBIF material-citation rows and has a multi-locality scope; do not count them as five independent occurrences.",
    },
  };

  await writeFile(reviewPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Cross-checked ${identities.size} GBIF catalog identities against iDigBio.`);
  console.log(
    `iDigBio source records: ${records.length}; Balayan Bay locality text: ${recordsWithBalayanLocality}; unresolved identities: ${unresolvedIdentities.length}.`,
  );
  console.log("All candidates remain research-only; coordinates are excluded from the review file.");
}

await main();
