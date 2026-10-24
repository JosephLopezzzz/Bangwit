import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [ledger, table, taxonomy, checkpoint] = await Promise.all([
  readFile(new URL("central-luzon-bataan-historical-evidence-ledger-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("central-luzon-bataan-river-table-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("central-luzon-bataan-cof-name-review-20261024.json", base), "utf8").then(JSON.parse),
  readFile(new URL("central-luzon-discovery-checkpoint-20261024.json", base), "utf8").then(JSON.parse),
]);

test("Bataan historical ledger preserves the paper matrix without claiming verified identity or app admission", () => {
  const sourceRows = table.sourceTableReview.records;
  assert.equal(ledger.status, "source-scoped-historical-assertions-prepared-identity-and-geometry-held");
  assert.equal(ledger.source.id, table.source.id);
  assert.equal(ledger.source.license, "CC-BY-4.0");
  assert.equal(ledger.coverage.sourceRows, 52);
  assert.equal(ledger.records.length, sourceRows.length);
  assert.deepEqual(ledger.coverage.reportedRowsByRiver, { Almacen: 42, Bagac: 29, Talisay: 28 });
  assert.equal(ledger.coverage.presenceCells, 99);
  assert.equal(ledger.coverage.nomenclatureProposalRows, 42);
  assert.equal(ledger.coverage.unresolvedGenusOnlyRows, 9);
  assert.equal(ledger.coverage.heldHybridRows, 1);
  assert.equal(ledger.coverage.independentlyVerifiedIdentities, 0);
  assert.equal(ledger.coverage.publicAssertions, 0);
  assert.equal(ledger.coverage.appProjections, 0);
  assert.equal(checkpoint.candidateFishEvidence.evidenceLedgerFile, "central-luzon-bataan-historical-evidence-ledger-20261024.json");
  assert.equal(checkpoint.candidateFishEvidence.appProjections, 0);
  assert.match(checkpoint.nextStep.action, /independent fish-identification evidence/i);
  assert.equal(ledger.records.filter((record) => record.publicAssertion || record.appProjection).length, 0);
  assert.deepEqual(ledger.records.map((record) => record.sourceNameVerbatim), sourceRows.map((record) => record.sourceName));
  assert.deepEqual(ledger.records.map((record) => record.sourcePresence), sourceRows.map((record) => record.presence));
  assert.ok(ledger.records.every((record) => record.evidenceInterpretation.includes("does not independently verify")));
  const proposalByName = new Map(taxonomy.records.map((record) => [record.sourceNameVerbatim, record]));
  for (const record of ledger.records) {
    const proposal = proposalByName.get(record.sourceNameVerbatim);
    if (proposal) assert.equal(record.taxonomicReview.proposedCurrentName, proposal.catalogName);
    else assert.ok(["genus-only-identity-unresolved", "hybrid-identity-held"].includes(record.taxonomicReview.status));
  }
});
