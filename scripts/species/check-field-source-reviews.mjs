import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const research = new URL("data/research/philippines/", root);
const palicoId = "corpuz-2025-palico-lian";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

/** Verify the bounded research batch without promoting source names into accepted/public taxa. */
export function validateFieldSourceReviews({ river, brackish, independent, sourceRegistry, scope }) {
  assert.equal(river.schemaVersion, 1);
  assert.equal(brackish.schemaVersion, 1);
  assert.equal(independent.schemaVersion, 1);
  assert.equal(river.regionId, "0400000000");
  assert.equal(river.publicAdmission, false);
  assert.equal(brackish.publicationApproval, false);
  assert.equal(river.counts.approvedRows, 0);
  assert.equal(brackish.counts.publicRecordsAdmitted, 0);
  assert.equal(brackish.counts.extractedSpeciesAssertions, 0);
  assert.deepEqual(brackish.records, []);
  assert.equal(river.counts.sourcesReviewed, river.sources.length);
  assert.equal(
    river.counts.fullPrimarySurveysAcquired,
    river.sources.filter((source) => source.access.status === "full-pdf-acquired").length,
  );
  assert.equal(brackish.counts.primarySourceLeadsReviewed, brackish.sources.length);
  assert.equal(river.counts.candidateRows, river.candidates.length);
  assert.equal(river.counts.pendingCandidateRows, river.candidates.length);
  assert.equal(river.counts.heldSources, river.sources.filter((source) => source.decision === "hold").length);
  const registered = new Map(sourceRegistry.sources.map((source) => [source.id, source]));
  const allSources = [...river.sources, ...brackish.sources];
  assert.equal(new Set(river.sources.map((source) => source.id)).size, river.sources.length, "Duplicate river source");
  assert.equal(
    new Set(brackish.sources.map((source) => source.id)).size,
    brackish.sources.length,
    "Duplicate brackish source",
  );
  for (const source of allSources) {
    const entry = registered.get(source.id);
    assert.ok(entry, `Unregistered source: ${source.id}`);
    assert.ok(
      [entry.url, ...(entry.additionalUrls ?? [])].includes(source.sourceUrl ?? source.url),
      "Source ID/URL mismatch",
    );
    if (source.doi) assert.equal(source.doi, entry.doi, "Source ID/DOI mismatch");
  }
  for (const source of brackish.sources) {
    assert.ok(source.decision.startsWith("hold-"), "Brackish source needs an explicit hold");
    assert.equal(source.publicRecordsAdmitted, 0);
    assert.equal(source.salinityReview.brackishQualification, "hold");
    assert.ok(source.salinityReview.reason);
  }
  const source = river.sources.find((item) => item.id === palicoId);
  assert.ok(source, "Missing acquired Palico survey");
  assert.equal(source.access.status, "full-pdf-acquired");
  assert.equal(source.access.httpStatus, 200);
  assert.equal(source.access.tlsVerification, true);
  assert.equal(source.access.pages, 10);
  assert.match(source.access.rawPdfSha256, /^[a-f0-9]{64}$/);
  assert.equal(source.access.rawPdfSha256, independent.sourceEvidence.sourcePdfSha256);
  assert.equal(independent.sourceEvidence.sourceId, palicoId);
  assert.equal(source.sourceUrl, independent.sourceEvidence.pdfUrl);
  assert.equal(source.doi, independent.sourceEvidence.articleDoi);
  assert.equal(source.rights.termsSha256, independent.sourceEvidence.rightsSha256);
  assert.equal(source.rights.termsTextSha256, independent.sourceEvidence.rightsTextSha256);
  assert.equal(source.rights.license, null, "Custom publisher permission is not a Creative Commons license");
  assert.equal(source.rights.publicationApproval, false);
  assert.equal(source.reportedPublicationDate, "2025-11-14");
  assert.equal(source.sampling.observationDate, null);
  assert.equal(source.sampling.period.value, null);
  assert.equal(source.table3Context.salinityPsu, null, "Chloride cannot become measured salinity");
  assert.equal(independent.counts.publicRecordsAdmittedByThisReview, 0);
  const waterbody = scope.waterbodies.find((body) => body.id === "ph-wb-palico-lian-river");
  assert.equal(waterbody?.kind, "river");
  assert.equal(waterbody.salinity.classification, "unknown");
  assert.ok(waterbody.sourceRefs.includes(palicoId));
  assert.equal(waterbody.publicAdmission, false);
  const ids = new Set();
  const names = new Set();
  const presenceTotals = { site1: 0, site2: 0, site3: 0 };
  for (const row of river.candidates) {
    assert.ok(row.id && !ids.has(row.id), "Missing/duplicate survey candidate ID");
    assert.ok(row.recordedName && !names.has(row.recordedName), "Missing/duplicate recorded name");
    ids.add(row.id);
    names.add(row.recordedName);
    assert.equal(row.sourceId, palicoId);
    assert.equal(row.sourceUrl, source.sourceUrl);
    assert.equal(row.evidenceKind, "published-survey-table-assertion");
    assert.equal(row.sourcePage, 584);
    assert.equal(row.pdfPage, 6);
    assert.equal(row.sourceTable, 1);
    assert.ok(
      row.recordedAuthority && !row.recordedAuthority.includes("?"),
      "Unresolved authority transcription placeholder",
    );
    assert.equal(row.reviewStatus, "pending");
    assert.equal(row.publicationEligible, false);
    assert.equal(row.acceptedTaxonId, null);
    assert.equal(row.observationDate, null);
    assert.equal(row.samplingPeriod.value, null);
    assert.equal(row.samplingPeriod.precision, "not-reported");
    assert.equal(row.reportedPublicationDate, source.reportedPublicationDate);
    assert.equal(row.waterbodyName, source.coverage.waterbodyName);
    assert.equal(row.waterbodyKind, "river");
    assert.equal(row.province, "Batangas");
    assert.equal(row.regionId, river.regionId);
    assert.equal(row.stationCounts, null, "Plus marks are not specimen counts");
    assert.ok(row.blankCellMeaning && row.recordedFamily);
    for (const site of Object.keys(presenceTotals)) {
      assert.equal(typeof row.stationPresence[site], "boolean");
      presenceTotals[site] += Number(row.stationPresence[site]);
    }
    const checked = independent.tableRows.find((item) => item.recordedName === row.recordedName);
    assert.ok(checked, "Missing independent source-table row");
    assert.equal(checked.recordedFamily, row.recordedFamily, "Recorded family was silently changed");
    assert.deepEqual(checked.stationPresence, row.stationPresence, "Station marks disagree with independent review");
  }
  assert.equal(independent.tableRows.length, river.candidates.length);
  assert.equal(river.candidates.length, independent.counts.recordedBinomials);
  assert.equal(
    new Set(river.candidates.map((row) => row.recordedFamily)).size,
    independent.counts.distinctRecordedFamilies,
  );
  assert.deepEqual(presenceTotals, river.counts.tablePresenceTotals);
  assert.deepEqual(presenceTotals, source.access.tableVerified.presenceTotals);
  assert.deepEqual(Object.values(presenceTotals), independent.counts.siteRichnessFromTable1);
  assert.deepEqual(Object.values(presenceTotals), independent.counts.siteRichnessReportedTable2);
  assert.equal(independent.counts.independentTaxonomyChecks, independent.taxonomyChecks.length);
  for (const check of independent.taxonomyChecks) {
    const row = river.candidates.find((candidate) => candidate.recordedName === check.scientificName);
    assert.ok(row, "Unknown independent taxonomy candidate");
    assert.equal(check.recordedFamily, row.recordedFamily);
    assert.equal(check.publicEligibility, false);
    assert.equal(check.worms.scientificName, row.recordedName);
    assert.equal(check.worms.validScientificName, row.recordedName);
    assert.equal(check.worms.status, "accepted");
    assert.ok(Number.isInteger(check.worms.aphiaId) && check.worms.aphiaId > 0);
    assert.match(check.worms.responseSha256, /^[a-f0-9]{64}$/);
    assert.ok(["identity-agreement-only", "hold-source-family-conflict"].includes(check.recommendedDecision));
    const agrees = row.recordedFamily.toLowerCase() === check.worms.family.toLowerCase();
    assert.equal(
      agrees,
      check.recommendedDecision === "identity-agreement-only",
      "Taxonomy conflict cannot be silently cleared",
    );
  }
  const agreements = independent.taxonomyChecks.filter(
    (check) => check.recommendedDecision === "identity-agreement-only",
  ).length;
  assert.equal(agreements, independent.counts.identityFamilyAgreements);
  assert.equal(independent.taxonomyChecks.length - agreements, independent.counts.familyConflicts);
  return {
    fieldSourceLeadsReviewed: new Set(allSources.map((item) => item.id)).size,
    acquiredRiverSurveys: river.counts.fullPrimarySurveysAcquired,
    pendingRiverCandidates: river.candidates.length,
    riverTableSiteRichness: presenceTotals,
    brackishSourceLeadsReviewed: brackish.sources.length,
    preparedBrackishAssertions: 0,
    independentRiverIdentityChecks: independent.taxonomyChecks.length,
    independentRiverFamilyConflicts: independent.counts.familyConflicts,
    newFieldSurveyPublicAdmissions: 0,
  };
}

export async function readFieldSourceReviews() {
  const files = {
    river: "calabarzon-river-source-review.json",
    brackish: "calabarzon-brackish-source-review.json",
    independent: "palico-independent-review.json",
    sourceRegistry: "sources.json",
    scope: "calabarzon-scope.json",
  };
  return Object.fromEntries(
    await Promise.all(
      Object.entries(files).map(async ([key, file]) => [
        key,
        JSON.parse(await readFile(new URL(file, research), "utf8")),
      ]),
    ),
  );
}

function rawTargets(river) {
  const source = river.sources.find((item) => item.id === palicoId);
  return [
    {
      file: "raw/river-source-review/palico-lian-pdf.pdf",
      url: source.sourceUrl,
      sha256: source.access.rawPdfSha256,
      limit: 6 * 1024 * 1024,
      pdf: true,
    },
    {
      file: "raw/river-source-review/palico-rights-current.html",
      historicalFile: "raw/river-source-review/palico-rights-node.html",
      url: source.rights.termsUrl,
      sha256: source.rights.termsSha256,
      textSha256: source.rights.termsTextSha256,
      limit: 256 * 1024,
    },
  ];
}

export async function checkPalicoRawCache(river) {
  for (const target of rawTargets(river)) {
    let historical;
    if (target.historicalFile) {
      try {
        historical = await readFile(new URL(target.historicalFile, research));
        assert.equal(hash(historical), target.sha256, "Historical policy snapshot changed");
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
    let bytes;
    try {
      bytes = await readFile(new URL(target.file, research));
    } catch (error) {
      if (error.code !== "ENOENT" || !historical) throw error;
      bytes = historical;
    }
    assert.equal(
      target.textSha256 ? policyTextHash(bytes) : hash(bytes),
      target.textSha256 ?? target.sha256,
      `Changed source content: ${target.file}`,
    );
  }
}

/** Full page text pin excludes per-request Joomla script tokens, not policy clauses. */
export function policyTextHash(bytes) {
  return hash(
    bytes
      .toString("utf8")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

export async function fetchPinnedSource(target, fetcher = fetch) {
  const url = new URL(target.url);
  assert.equal(url.origin, "https://www.biodiversityjournal.com");
  const response = await fetcher(url, { signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, 200, `Source fetch failed: ${url}`);
  assert.ok(response.body, "Source has no body");
  assert.ok(Number(response.headers.get("content-length") ?? 0) <= target.limit, "Source exceeds byte limit");
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    assert.ok(size <= target.limit, "Source exceeds byte limit");
    chunks.push(chunk);
  }
  const bytes = Buffer.concat(chunks);
  if (target.pdf) assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
  assert.equal(
    target.textSha256 ? policyTextHash(bytes) : hash(bytes),
    target.textSha256 ?? target.sha256,
    "Provider content changed; review source version before replacing the cache",
  );
  return bytes;
}

async function fetchPalicoRawCache(river) {
  const targets = rawTargets(river);
  // Verify both downloads before promoting either; a failed refresh retains the known-good files.
  const bodies = await Promise.all(targets.map((target) => fetchPinnedSource(target)));
  await mkdir(new URL("raw/river-source-review/", research), { recursive: true });
  for (const [index, target] of targets.entries()) {
    const file = new URL(target.file, research);
    const temp = new URL(`${target.file}.tmp`, research);
    await writeFile(temp, bodies[index]);
    await rename(temp, file);
  }
  await writeFile(
    new URL("raw/river-source-review/refetch-receipt.json", research),
    `${JSON.stringify({ checkedAtUtc: new Date().toISOString(), tlsVerification: "Node fetch default certificate validation", sources: targets.map(({ url, textSha256 }, index) => ({ url, sha256: hash(bodies[index]), ...(textSha256 ? { normalizedTextSha256: textSha256 } : {}) })) }, null, 2)}\n`,
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    assert.ok(
      process.argv.slice(2).every((arg) => ["--raw", "--fetch"].includes(arg)),
      "Use [--raw | --fetch]",
    );
    const inputs = await readFieldSourceReviews();
    const summary = validateFieldSourceReviews(inputs);
    if (process.argv.includes("--fetch")) await fetchPalicoRawCache(inputs.river);
    if (process.argv.includes("--raw") || process.argv.includes("--fetch")) await checkPalicoRawCache(inputs.river);
    console.log(JSON.stringify(summary, null, 2));
  } catch (error) {
    console.error(`Field source review failed: ${error.message}`);
    process.exitCode = 1;
  }
}
