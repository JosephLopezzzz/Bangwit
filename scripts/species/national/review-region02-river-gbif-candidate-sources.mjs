import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../../", import.meta.url);
const inputPath = new URL("data/research/philippines/raw/national/gbif-region02-river-record-candidate-review-col-filtered-20261109.jsonl", root);
const rawDirectory = new URL("data/research/philippines/raw/national/gbif-region02-river-source-metadata-col-filtered-20261109/", root);
const boldRawDirectory = new URL("data/research/philippines/raw/national/bold-region02-cagayan-river-catfish-records-20261109/", root);
const reportPath = new URL("data/research/philippines/national/reviews/gbif-region02-river-candidate-source-review-20261109.json", root);
const gbifDatasetEndpoint = "https://api.gbif.org/v1/dataset/";
const boldPortal = "https://portal.boldsystems.org";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function get(url, userAgent) {
  let response;
  let bytes;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    response = await fetch(url, {
      headers: { accept: "application/json", "user-agent": userAgent },
      signal: AbortSignal.timeout(30000),
    });
    bytes = Buffer.from(await response.arrayBuffer());
    if (response.status !== 429 && response.status < 500) break;
    if (attempt === 4) break;
    await wait((attempt + 1) * 1200);
  }
  const text = bytes.toString("utf8");
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { response, bytes, text, json };
}

function parseJsonl(text) {
  return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function sanitizeBoldRecord(record, gbifRecordId) {
  return {
    gbifRecordId,
    processId: record.processid ?? null,
    sampleId: record.sampleid ?? null,
    binUri: record.bin_uri ?? null,
    class: record.class ?? null,
    family: record.family ?? null,
    genus: record.genus ?? null,
    scientificName: record.species ?? null,
    identification: record.identification ?? null,
    identificationMethod: record.identification_method ?? null,
    identificationRank: record.identification_rank ?? null,
    identifiedBy: record.identified_by ?? null,
    taxonomyNotes: record.taxonomy_notes ?? null,
    collectionDateStart: record.collection_date_start ?? null,
    site: record.site ?? null,
    province: record["province/state"] ?? null,
    country: record.country ?? null,
    coordinateAccuracy: record.coord_accuracy ?? null,
    coordinateIncludedInReview: false,
    sequenceAccession: record.insdc_acs ?? null,
    recordsets: Array.isArray(record.bold_recordset_code_arr) ? record.bold_recordset_code_arr : [],
    recordUrl: `${boldPortal}/record/${encodeURIComponent(record.processid ?? "")}`,
  };
}

async function fetchBoldRecords(records) {
  const unique = new Map();
  for (const row of records.filter((record) => record.datasetKey === "040c5662-da76-4782-a48e-cdea1892d14c")) {
    if (!row.occurrenceId) throw new Error(`BOLD-backed GBIF record ${row.gbifId} has no process ID.`);
    unique.set(row.occurrenceId, row.gbifId);
  }
  const ids = [...unique.keys()].sort();
  const results = [];
  const queries = [];
  for (let start = 0; start < ids.length; start += 5) {
    const batch = ids.slice(start, start + 5);
    const submittedQuery = batch.map((id) => `ids:processid:${id}`).join(";");
    const preprocessorUrl = new URL("/api/query/preprocessor", boldPortal);
    preprocessorUrl.searchParams.set("query", submittedQuery);
    const preprocessor = await get(preprocessorUrl, "Bangwit-research/1.0 (read-only public BOLD identifier crosswalk)");
    if (!preprocessor.response.ok || !Array.isArray(preprocessor.json?.successful_terms)) {
      throw new Error(`BOLD preprocessor ${preprocessor.response.status}: ${preprocessor.text.slice(0, 200)}`);
    }
    const matchedTerms = preprocessor.json.successful_terms.map((term) => term.matched).filter(Boolean);
    if (matchedTerms.length !== batch.length) throw new Error(`BOLD resolved ${matchedTerms.length}/${batch.length} process IDs.`);
    const normalizedQuery = matchedTerms.join(";");
    const queryUrl = new URL("/api/query", boldPortal);
    queryUrl.searchParams.set("query", normalizedQuery);
    queryUrl.searchParams.set("extent", "full");
    const query = await get(queryUrl, "Bangwit-research/1.0 (read-only public BOLD identifier crosswalk)");
    if (!query.response.ok || typeof query.json?.query_id !== "string") {
      throw new Error(`BOLD query ${query.response.status}: ${query.text.slice(0, 200)}`);
    }
    const documentsUrl = new URL(`/api/documents/${encodeURIComponent(query.json.query_id)}/download`, boldPortal);
    documentsUrl.searchParams.set("format", "json");
    const documents = await get(documentsUrl, "Bangwit-research/1.0 (read-only public BOLD identifier crosswalk)");
    if (!documents.response.ok || !documents.text.trim().startsWith("{")) {
      throw new Error(`BOLD documents ${documents.response.status}: ${documents.text.slice(0, 120)}`);
    }
    const decoded = parseJsonl(documents.text);
    const knownIds = new Set(batch);
    if (decoded.some((record) => !knownIds.has(record.processid))) throw new Error("BOLD batch returned an unrequested process ID.");
    results.push(...decoded.map((record) => sanitizeBoldRecord(record, unique.get(record.processid))));
    const sanitizedBytes = Buffer.from(`${JSON.stringify({ batchProcessIds: batch, records: decoded.map((record) => sanitizeBoldRecord(record, unique.get(record.processid))) }, null, 2)}\n`);
    const sanitizedName = `batch-${String(queries.length + 1).padStart(2, "0")}-metadata-only.json`;
    await writeFile(new URL(sanitizedName, boldRawDirectory), sanitizedBytes);
    queries.push({
      requestedProcessIds: batch,
      preprocessorUrl: preprocessorUrl.toString(),
      preprocessorHttpStatus: preprocessor.response.status,
      preprocessorResponseSha256: sha256(preprocessor.bytes),
      queryUrl: queryUrl.toString(),
      queryHttpStatus: query.response.status,
      queryResponseSha256: sha256(query.bytes),
      documentsUrl: documentsUrl.toString(),
      documentsHttpStatus: documents.response.status,
      documentsResponseBytes: documents.bytes.length,
      documentsResponseSha256: sha256(documents.bytes),
      returnedRecords: decoded.length,
      sanitizedMetadata: { path: `raw/national/bold-region02-cagayan-river-catfish-records-20261109/${sanitizedName}`, sha256: sha256(sanitizedBytes) },
      nucleotideSequenceRetained: false,
    });
    if (start + 5 < ids.length) await wait(1200);
  }
  const missing = ids.filter((id) => !results.some((record) => record.processId === id));
  if (missing.length) throw new Error(`BOLD records missing after query: ${missing.join(", ")}`);
  return { records: results.sort((a, b) => a.processId.localeCompare(b.processId)), queries };
}

async function fetchDatasetMetadata(datasetKeys) {
  await mkdir(fileURLToPath(rawDirectory), { recursive: true });
  const results = [];
  for (const datasetKey of datasetKeys) {
    const url = `${gbifDatasetEndpoint}${datasetKey}`;
    const fetched = await get(url, "Bangwit-research/1.0 (read-only public GBIF dataset metadata review)");
    if (!fetched.response.ok || !fetched.json?.key) throw new Error(`GBIF dataset metadata ${fetched.response.status} for ${datasetKey}`);
    const fileName = `${datasetKey}.json`;
    await writeFile(new URL(fileName, rawDirectory), fetched.bytes);
    results.push({
      datasetKey,
      title: fetched.json.title ?? null,
      doi: fetched.json.doi ?? null,
      license: fetched.json.license ?? null,
      type: fetched.json.type ?? null,
      homepage: fetched.json.homepage ?? null,
      citation: fetched.json.citation?.text ?? null,
      publisherKey: fetched.json.publishingOrganizationKey ?? null,
      apiUrl: url,
      httpStatus: fetched.response.status,
      rawResponse: { path: `raw/national/gbif-region02-river-source-metadata-col-filtered-20261109/${fileName}`, bytes: fetched.bytes.length, sha256: sha256(fetched.bytes) },
    });
    await wait(300);
  }
  return results;
}

function summaryRows(rows, ids) {
  const idSet = new Set(ids);
  return rows.filter((row) => idSet.has(row.gbifId)).map((row) => ({
    gbifId: row.gbifId,
    recordedName: row.scientificName,
    gbifAcceptedName: row.acceptedScientificName,
    rank: row.taxonRank,
    family: row.family,
    year: row.year,
    eventDate: row.eventDate,
    waterBody: row.waterBody,
    locality: row.locality,
    stateProvince: row.stateProvince,
    coordinateUncertaintyInMeters: row.coordinateUncertaintyInMeters,
    license: row.license,
    datasetKey: row.datasetKey,
    occurrenceId: row.occurrenceId,
    catalogNumber: row.catalogNumber,
    issues: row.issues,
  }));
}

async function main() {
  const inputBytes = await readFile(inputPath);
  const rows = parseJsonl(inputBytes.toString("utf8"));
  if (rows.length !== 31) throw new Error(`Expected corrected 31-row GBIF candidate set; found ${rows.length}.`);
  await mkdir(fileURLToPath(boldRawDirectory), { recursive: true });

  const datasetKeys = [...new Set(rows.map((row) => row.datasetKey).filter(Boolean))].sort();
  const datasets = await fetchDatasetMetadata(datasetKeys);
  const bold = await fetchBoldRecords(rows);
  await writeFile(new URL("bold-sanitized-records.json", boldRawDirectory), `${JSON.stringify(bold.records, null, 2)}\n`, "utf8");

  const boldIds = rows.filter((row) => row.datasetKey === "040c5662-da76-4782-a48e-cdea1892d14c").map((row) => row.gbifId);
  const magatIds = rows.filter((row) => row.datasetKey === "5d6c10bd-ea31-4363-8b79-58c96d859f5b"
    && /^Magat(?: River)?$/i.test(row.waterBody ?? "")
    && /^Bayombong\.?$/i.test(row.locality ?? "")
    && /Nueva Vizcaya/i.test(row.stateProvince ?? "")).map((row) => row.gbifId);
  const aparriHeldIds = rows.filter((row) => row.datasetKey === "5d6c10bd-ea31-4363-8b79-58c96d859f5b"
    && /Aparri/i.test(row.locality ?? "")
    && Number(row.coordinateUncertaintyInMeters) > 10000).map((row) => row.gbifId);
  const adjacentCarIds = rows.filter((row) => row.datasetKey === "d499aef2-b1d9-4890-aeb3-5f0d1237b513"
    && /(?:Ibulao River|Ambuwaya Lake)/i.test(row.locality ?? "")).map((row) => row.gbifId);
  const misamisHomonymIds = rows.filter((row) => /Misamis Oriental/i.test(row.stateProvince ?? "")
    && /Cagayan River/i.test(`${row.waterBody ?? ""} ${row.locality ?? ""}`)).map((row) => row.gbifId);
  const datasetByKey = new Map(datasets.map((dataset) => [dataset.datasetKey, dataset]));
  const boldNames = [...new Set(bold.records.map((record) => record.scientificName).filter(Boolean))].sort();
  const magatRows = rows.filter((row) => magatIds.includes(row.gbifId));
  const sourceConflictIds = rows.filter((row) => row.datasetKey === "d499aef2-b1d9-4890-aeb3-5f0d1237b513"
    && /Philippine Sea/i.test(row.waterBody ?? "")
    && /Cagayan River/i.test(row.locality ?? "")).map((row) => row.gbifId);
  const nhmGenusIds = rows.filter((row) => row.datasetKey === "7e380070-f762-11e1-a439-00145eb45e9a"
    && row.taxonRank === "GENUS").map((row) => row.gbifId);
  const accounted = new Set([...boldIds, ...magatIds, ...aparriHeldIds, ...adjacentCarIds, ...misamisHomonymIds, ...sourceConflictIds, ...nhmGenusIds]);
  const unclassified = rows.filter((row) => !accounted.has(row.gbifId));
  if (bold.records.length !== boldIds.length || boldNames.length !== 2 || magatIds.length !== 5 || aparriHeldIds.length !== 1
    || adjacentCarIds.length !== 2 || misamisHomonymIds.length !== 9 || sourceConflictIds.length !== 1 || nhmGenusIds.length !== 1 || unclassified.length !== 0) {
    throw new Error(`Unexpected crosswalk totals: BOLD ${bold.records.length}/${boldIds.length}, names ${boldNames.length}, Magat ${magatIds.length}, Aparri hold ${aparriHeldIds.length}, CAR ${adjacentCarIds.length}, Misamis homonyms ${misamisHomonymIds.length}, site conflict ${sourceConflictIds.length}, NHM genus ${nhmGenusIds.length}, unclassified ${unclassified.length}.`);
  }

  const report = {
    schemaVersion: 1,
    reviewId: "gbif-region02-river-candidate-source-review-20261109",
    generatedOn: new Date().toISOString().slice(0, 10),
    status: "corrected-gbif-candidates-source-crosswalked;two-published-cagayan-fish-taxa-with-primary-record-links;magat-vouchers-and-site-conflicts-held;research-only",
    purpose: "Cross-check the corrected GBIF Region II river candidate rows against their source dataset metadata, BOLD sample records, and a primary Philippine catfish study. This is a source-triage artifact, not a public occurrence dataset.",
    input: { path: "data/research/philippines/raw/national/gbif-region02-river-record-candidate-review-col-filtered-20261109.jsonl", rows: rows.length, sha256: sha256(inputBytes), coordinatesInInput: false },
    sources: {
      gbifDatasetMetadata: datasets,
      boldPortalApi: {
        documentationUrl: "https://www.boldsystems.org/data/api/",
        portalUrl: boldPortal,
        queryBatches: bold.queries,
        returnedRecords: bold.records.length,
        distinctSpeciesNames: boldNames,
        metadataOnlyRaw: { path: "raw/national/bold-region02-cagayan-river-catfish-records-20261109/bold-sanitized-records.json", sha256: sha256(await readFile(new URL("bold-sanitized-records.json", boldRawDirectory))) },
        records: bold.records,
        note: "Sequence strings and exact coordinates are not retained in the report or sanitized snapshot. BOLD supplied morphology-based species identification, identifier, collection date, site, province, and GenBank accession for each retrieved process ID.",
      },
      primaryStudy: {
        title: "Molecular Phylogeny of Catfishes (Teleostei: Siluriformes) in the Philippines Using the Mitochondrial Genes COI, Cyt b, 16S rRNA, and the Nuclear Genes Rag1 and Rag2",
        authors: ["Shiny Cathlynne S. Yu", "Jonas P. Quilang"],
        publication: "Philippine Journal of Science 143(2):187-198 (2014)",
        officialArticleUrl: "https://philjournalsci.dost.gov.ph/molecular-phylogeny-of-catfishes-teleostei-siluriformes-in-the-philippines-using-the-mitochondrial-genes-coi-cyt-b-16s-rrna-and-the-nuclear-genes-rag1-and-rag2/",
        officialPdfUrl: "https://philjournalsci.dost.gov.ph/images/pdf/pjs_pdf/vol143no2/pdf/Molecular_phylogency_of_catfishes.pdf",
        access: "Publisher article text was readable through indexed primary-source extraction; direct PDF download returned HTTP 403 during this review.",
        evidenceUsed: ["The methods state specimens were initially identified morphologically and molecular identification was performed; specimens were deposited in the UP Diliman Institute of Biology.", "Table 1 lists Philippine catfish taxa, collection-site labels, GenBank accessions, and voucher IDs, including Cagayan-related Clarias macrocephalus and Plicofollis magatensis entries."],
        rights: "No article-specific reuse license was verified. No article text, figures, tables, or sequences are reproduced in the app or this research report.",
      },
    },
    candidateGroups: {
      cagayanRiverBOLD: {
        disposition: "historical-specimen-and-barcode-candidates;retain-for-taxonomy-and-source-rights-review;no-map-point",
        recordCount: bold.records.length,
        taxa: boldNames,
        records: bold.records,
        evidenceAssessment: "Twelve unique BOLD process IDs report Cagayan River, Cagayan, collection dates in November-December 2011, morphology as identification method, Jonas P. Quilang as identifier, and sequence accessions. They resolve into two species names, seven Plicofollis magatensis samples and five Clarias macrocephalus samples. BOLD gives no coordinate accuracy, so do not map these samples; the BOLD place field is source-reported locality, not a reach geometry.",
        independentStudyContext: "The DOST-published 2014 Philippine Journal of Science paper includes both taxa in its catfish study and lists Cagayan-area specimen/voucher and sequence information. Its study's two-per-species phylogenetic subset should not be conflated with all 12 distinct BOLD process records.",
      },
      magatRiverCAS: {
        disposition: "historical-voucher-candidates;locality-supported-but-spatially-coarse;taxonomic-crosscheck-pending",
        recordCount: magatIds.length,
        distinctRecordedNames: [...new Set(magatRows.map((row) => row.scientificName))].sort(),
        records: summaryRows(rows, magatIds),
        evidenceAssessment: "Five CAS catalogue records give waterBody Magat River, locality Bayombong, Nueva Vizcaya, dates in 1931/1940, named collector Herre, and 3,257 m coordinate uncertainty. Retain the printed waterbody/locality as historical collection text; do not use the generalized point for reach placement or interpret these old vouchers as current presence.",
      },
      cagayanAparriCAS: {
        disposition: "held-for-spatial-uncertainty-review;no-river-point",
        records: summaryRows(rows, aparriHeldIds),
        evidenceAssessment: "One CAS record names Barrio Bisgu, Aparri and Cagayan River, but its coordinate uncertainty is 50,479 m and the original collection documentation has not been checked. Keep as a locality lead, not a validated river reach occurrence.",
      },
      adjacentIfugao: {
        disposition: "adjacent-CAR-not-Region-II;do-not-assign-to-Isabela-or-Magat",
        records: summaryRows(rows, adjacentCarIds),
        evidenceAssessment: "Auburn voucher rows have locality labels Ibulao River or Ambuwaya Lake near Lagawe/Kiangan in Ifugao despite GBIF waterBody=Cagayan River. These upstream/adjacent records are not Region II site assignments.",
      },
    },
    excludedOrHeld: {
      misamisCagayanRiverHomonyms: {
        disposition: "exclude-from-Region-II-Cagayan-River-crosswalk",
        records: summaryRows(rows, misamisHomonymIds),
        reason: "Nine records use Cagayan River text but identify Misamis Oriental as stateProvince. Treat this as a homonymous Cagayan/Cagayan de Oro locality conflict, not a Northern Luzon occurrence.",
      },
      cagayansourceWaterBodyConflict: {
        disposition: "hold-unresolved-source-fields",
        records: summaryRows(rows, sourceConflictIds),
        reason: "The Auburn record has locality=Cagayan River and stateProvince=Cagayan Province but waterBody=Philippine Sea, plus GBIF AMBIGUOUS_COLLECTION. It does not establish a river collection site.",
      },
      unresolvedNHMGenus: {
        disposition: "hold-genus-rank-and-taxonomic-conflict",
        records: summaryRows(rows, nhmGenusIds),
        reason: "The Natural History Museum record is genus-rank Hemirhamphus, interpreted by GBIF as Hemiramphus at higher rank, lacks a collection date, and has institution/taxonomic flags. It is not a species occurrence.",
      },
    },
    summary: {
      correctedGBIFRowsReviewed: rows.length,
      uniqueGBIFRecordIds: rows.length,
      cagayanBOLDRecords: bold.records.length,
      cagayanBOLDSpeciesCandidates: boldNames,
      magatRiverCASVoucherRows: magatIds.length,
      aparriUncertaintyHolds: aparriHeldIds.length,
      adjacentIfugaoRows: adjacentCarIds.length,
      MisamisOrientalCagayanHomonymRows: misamisHomonymIds.length,
      contradictoryWaterBodyRows: sourceConflictIds.length,
      unresolvedGenusOnlyRows: nhmGenusIds.length,
      researchOnly: true,
      publicSpeciesOrOccurrenceRowsAdded: 0,
      coordinatesInReport: false,
      publicGeometryAdded: false,
      publicationApproval: false,
    },
    limitations: [
      "The GBIF screen covers only the selected Catalogue of Life XR Actinopterygii taxon concept, not all fishes.",
      "All Cagayan BOLD collection dates are historical 2011 records. They do not indicate current presence, abundance, fishing access, or catchability.",
      "BOLD has no reported coordinate accuracy for these site records; no coordinate is retained or plotted.",
      "The paper's sample subset, site labels, voucher IDs and sequence-accession rows are not a complete Cagayan River species checklist. Do not infer totals from the 12 BOLD process records.",
      "Magat CAS coordinate uncertainty is coarse and GBIF includes coordinate/continent quality flags. The locality remains a candidate pending original collection record and taxonomy cross-check.",
      "Exact text-search zeroes remain coverage gaps only. No fish absence, habitat, salinity, diet, safety, legal access, or current status is inferred.",
      "The article's reuse terms were not established. GBIF/BOLD licenses describe dataset/record metadata but are not blanket approval for app use of article text, imagery, sequence data, or derived content.",
    ],
    nextAction: "Review the source-voucher and taxonomy crosswalk for the five Magat CAS specimens and the two Cagayan BOLD taxa. Verify source collection provenance and item-level reuse, then continue Region II waterbody discovery across lakes, reservoirs, wetlands, brackish reaches, and rivers beyond the two named systems.",
  };

  const reportBytes = Buffer.from(`${JSON.stringify(report, null, 2)}\n`);
  await writeFile(reportPath, reportBytes);
  console.log(`Reviewed ${rows.length} corrected GBIF records across ${datasets.length} source datasets.`);
  console.log(`BOLD: ${bold.records.length} sample records, ${boldNames.join(" and ")}; CAS Magat vouchers: ${magatIds.length}; held Cagayan/Aparri rows: ${aparriHeldIds.length}.`);
  console.log(`Wrote data/research/philippines/national/reviews/gbif-region02-river-candidate-source-review-20261109.json`);
}

await main();
