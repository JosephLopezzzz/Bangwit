import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import {
  fetchPinnedSource,
  policyTextHash,
  readFieldSourceReviews,
  validateFieldSourceReviews,
} from "../scripts/species/check-field-source-reviews.mjs";

const inputs = await readFieldSourceReviews();

test("reconciles the independent river table while retaining brackish gaps and zero new public admissions", () => {
  const summary = validateFieldSourceReviews(inputs);
  assert.equal(summary.fieldSourceLeadsReviewed, 7);
  assert.equal(summary.acquiredRiverSurveys, 1);
  assert.equal(summary.pendingRiverCandidates, 15);
  assert.deepEqual(summary.riverTableSiteRichness, { site1: 9, site2: 7, site3: 13 });
  assert.equal(summary.independentRiverIdentityChecks, 5);
  assert.equal(summary.independentRiverFamilyConflicts, 1);
  assert.equal(summary.brackishSourceLeadsReviewed, 5);
  assert.equal(summary.preparedBrackishAssertions, 0);
  assert.equal(summary.newFieldSurveyPublicAdmissions, 0);
  assert.equal(
    inputs.river.candidates.find((row) => row.recordedName === "Sarotherodon melanotheron").recordedAuthority,
    "(Rüppell, 1852)",
  );
  assert.equal(
    inputs.river.candidates.find((row) => row.recordedName === "Leiognathus equula").recordedAuthority,
    "(Forsskål, 1775)",
  );
});

test("unknown dates, table marks, recorded families and custom permission cannot silently become stronger claims", () => {
  for (const mutate of [
    (data) => {
      data.river.candidates[0].observationDate = "2025-11-14";
    },
    (data) => {
      data.river.candidates[0].publicationEligible = true;
    },
    (data) => {
      data.river.candidates[0].acceptedTaxonId = "unreviewed";
    },
    (data) => {
      data.river.candidates[0].stationCounts = { site3: 1 };
    },
    (data) => {
      data.river.candidates[0].stationPresence.site1 = true;
    },
    (data) => {
      data.river.candidates.find((row) => row.recordedName === "Megalops cyprinoides").recordedFamily = "MEGALOPIDAE";
    },
    (data) => {
      data.river.sources[0].rights.license = "CC0-1.0";
    },
    (data) => {
      data.river.sources[0].table3Context.salinityPsu = 6.482;
    },
    (data) => {
      data.brackish.sources[0].salinityReview.brackishQualification = "approved";
    },
    (data) => {
      data.independent.taxonomyChecks.find(
        (row) => row.recommendedDecision === "hold-source-family-conflict",
      ).recommendedDecision = "identity-agreement-only";
    },
  ]) {
    const changed = structuredClone(inputs);
    mutate(changed);
    assert.throws(() => validateFieldSourceReviews(changed));
  }
});

test("review references and source-table counts reject stale, missing or duplicated evidence", () => {
  for (const mutate of [
    (data) => {
      data.river.sources[0].access.rawPdfSha256 = "0".repeat(64);
    },
    (data) => {
      data.river.sources[0].rights.termsSha256 = "0".repeat(64);
    },
    (data) => {
      data.brackish.sources[0].id = "corpuz-2025-palico-lian";
    },
    (data) => {
      data.independent.sourceEvidence.sourceId = "unrelated-source";
    },
    (data) => {
      data.independent.taxonomyChecks[0].worms.validScientificName = "Unrelated species";
    },
    (data) => {
      data.independent.taxonomyChecks[0].worms.status = "unaccepted";
    },
    (data) => {
      data.river.candidates.pop();
    },
    (data) => {
      data.river.candidates[0] = structuredClone(data.river.candidates[1]);
    },
    (data) => {
      data.sourceRegistry.sources = data.sourceRegistry.sources.filter(
        (source) => source.id !== "corpuz-2025-palico-lian",
      );
    },
    (data) => {
      data.scope.waterbodies.find((body) => body.id === "ph-wb-palico-lian-river").salinity.classification = "brackish";
    },
  ]) {
    const changed = structuredClone(inputs);
    mutate(changed);
    assert.throws(() => validateFieldSourceReviews(changed));
  }
});

test("pinned source acquisition rejects changed bytes, oversized responses and non-PDF error pages", async () => {
  const bytes = Buffer.from("%PDF-test-source");
  const target = {
    url: "https://www.biodiversityjournal.com/test.pdf",
    sha256: createHash("sha256").update(bytes).digest("hex"),
    limit: 100,
    pdf: true,
  };
  assert.deepEqual(await fetchPinnedSource(target, async () => new Response(bytes)), bytes);
  await assert.rejects(
    fetchPinnedSource(target, async () => new Response("%PDF-changed")),
    /Provider content changed/,
  );
  await assert.rejects(
    fetchPinnedSource({ ...target, limit: 5 }, async () => new Response(bytes)),
    /byte limit/,
  );
  await assert.rejects(fetchPinnedSource(target, async () => new Response("<html>error</html>")));
  await assert.rejects(
    fetchPinnedSource(target, async () => new Response("error", { status: 503 })),
    /Source fetch failed/,
  );
});

test("policy text pin ignores dynamic script tokens but fails when a policy clause changes", async () => {
  const before = Buffer.from('<p>All papers may be distributed.</p><script>{"token":"old"}</script>');
  const tokenChange = Buffer.from('<p>All papers may be distributed.</p><script>{"token":"new"}</script>');
  const clauseChange = Buffer.from('<p>No papers may be distributed.</p><script>{"token":"new"}</script>');
  const target = {
    url: "https://www.biodiversityjournal.com/about.html",
    textSha256: policyTextHash(before),
    limit: 500,
  };
  assert.deepEqual(await fetchPinnedSource(target, async () => new Response(tokenChange)), tokenChange);
  await assert.rejects(
    fetchPinnedSource(target, async () => new Response(clauseChange)),
    /Provider content changed/,
  );
});
