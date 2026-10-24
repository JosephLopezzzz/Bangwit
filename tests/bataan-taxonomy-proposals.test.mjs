import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { cacheKey, CHECKLIST_KEY, ENDPOINT } from "../scripts/species/match-freshwater-taxonomy.mjs";
import { buildProposalArtifact } from "../scripts/species/match-bataan-taxonomy-proposals.mjs";

const hash = (value) => createHash("sha256").update(value).digest("hex");
const metadata = {
  created: "2026-10-24T00:00:00Z",
  buildInfo: { sha: "fixture-build" },
  mainIndex: {
    datasetKey: CHECKLIST_KEY,
    clbDatasetKey: "fixture-index",
    datasetAlias: "Fixture COL XR",
    datasetTitle: "Fixture taxonomy index",
  },
};
const receipt = () => {
  const responseText = JSON.stringify(metadata);
  return {
    body: metadata,
    responseText,
    responseSha256: hash(responseText),
    retrievedAtUtc: "2026-10-24T01:00:00Z",
    indexStability: "verified",
    endMetadataSha256: hash(responseText),
    indexStabilityCheckedAtUtc: "2026-10-24T01:01:00Z",
  };
};

test("keeps Bataan automated matches pending and source-only rows unresolved", () => {
  const source = {
    source: { id: "fixture-paper", acquisition: { sha256: "fixture-pdf-sha" } },
    sourceTableReview: {
      rowCount: 3,
      records: [
        { familyAsPrinted: "Channidae", sourceName: "Channa striata", presence: { Almacen: true } },
        { familyAsPrinted: "Gobiidae", sourceName: "Rhinogobius sp.", presence: { Bagac: true } },
        { familyAsPrinted: "Cichlidae", sourceName: "O. niloticus x O. massambicus", presence: { Talisay: true } },
      ],
    },
  };
  const sourceText = JSON.stringify(source);
  const query = { checklistKey: CHECKLIST_KEY, scientificName: "Channa striata", kingdom: "Animalia" };
  const querySha256 = cacheKey(query, receipt().responseSha256);
  const response = {
    usage: { key: "XR-CHANNID", name: "Channa striata", canonicalName: "Channa striata", rank: "SPECIES", status: "ACCEPTED" },
    classification: [{ rank: "KINGDOM", name: "Animalia" }, { rank: "FAMILY", name: "Channidae" }],
    diagnostics: { matchType: "EXACT", confidence: 100 },
    synonym: false,
  };
  const responseText = JSON.stringify(response);
  const entry = {
    schemaVersion: 1,
    endpoint: ENDPOINT,
    query,
    querySha256,
    metadataSha256: receipt().responseSha256,
    retrievedAtUtc: "2026-10-24T02:00:00Z",
    status: "success",
    httpStatus: 200,
    responseText,
    responseSha256: hash(responseText),
  };
  const artifact = buildProposalArtifact(source, sourceText, receipt(), new Map([[querySha256, entry]]));

  assert.equal(artifact.status, "proposal-batch-complete-review-pending");
  assert.equal(artifact.counts.totalSourceRows, 3);
  assert.equal(artifact.counts.speciesBinomialQueries, 1);
  assert.equal(artifact.counts.heldNonBinomialRows, 2);
  assert.equal(artifact.counts.acceptedTaxa, 0);
  assert.equal(artifact.proposals[0].classification, "exact-species");
  assert.equal(artifact.proposals[0].reviewStatus, "pending");
  assert.equal(artifact.proposals[0].acceptedTaxonId, null);
  assert.equal(artifact.proposals[0].publicationEligible, false);
  assert.equal(artifact.proposals[1].sourceNameVerbatim, "Rhinogobius sp.");
  assert.equal(artifact.proposals[1].classification, "held-rank-or-hybrid-review");
  assert.equal(artifact.proposals[2].sourceNameVerbatim, "O. niloticus x O. massambicus");
  assert.equal(artifact.proposals[2].queryStatus, "not-queried-source-name-is-not-binomial");
});

test("does not label a changing taxonomy index as a complete stable proposal batch", () => {
  const source = { source: { id: "fixture-paper", acquisition: { sha256: "fixture-pdf-sha" } }, sourceTableReview: { rowCount: 0, records: [] } };
  const changingReceipt = { ...receipt(), indexStability: "changed", endMetadataSha256: "different" };
  const artifact = buildProposalArtifact(source, JSON.stringify(source), changingReceipt, new Map());
  assert.equal(artifact.status, "proposal-batch-incomplete");
  assert.equal(artifact.matchingService.indexStableDuringBatch, false);
});
