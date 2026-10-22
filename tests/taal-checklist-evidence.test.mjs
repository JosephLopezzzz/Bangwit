import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  buildTaalChecklistEvidence,
  readTaalChecklistInputs,
  taalChecklistJson,
} from "../scripts/species/build-taal-checklist-evidence.mjs";

const inputs = await readTaalChecklistInputs();

test("generates only four independently reviewed, dated Taal checklist assertions with deterministic provenance", async () => {
  const projection = buildTaalChecklistEvidence(inputs);
  assert.deepEqual(
    projection.records.map((record) => record.scientificName),
    ["Caranx ignobilis", "Caranx papuensis", "Caranx sexfasciatus", "Sardinella tawilis"],
  );
  assert.equal(projection.waterbody.id, "ph-wb-taal-lake");
  assert.equal(projection.source.publicationDate, "2023-06-09");
  assert.equal(projection.source.license, "CC0-1.0");
  assert.equal(projection.taxonomy.indexAlias, "COL26.6 XR");
  assert.equal(taalChecklistJson(projection), taalChecklistJson(buildTaalChecklistEvidence(inputs)));
  assert.equal(
    taalChecklistJson(projection),
    await readFile(new URL("../src/data/taal-checklist-evidence.json", import.meta.url), "utf8"),
  );
  for (const record of projection.records) {
    assert.equal(record.evidenceKind, "literature-checklist-assertion");
    assert.equal(record.observationDate, null);
    assert.equal(record.reportedLocality, "Lake Taal, Luzon Island");
    assert.match(record.taxonomyUrl, /^https:\/\/www\.gbif\.org\/taxon\/[A-Z0-9]+$/);
    assert.match(record.independentTaxonomyUrl, /^https:\/\/www\.marinespecies\.org\/aphia\.php\?p=taxdetails&id=\d+$/);
    assert.deepEqual(
      Object.keys(record).sort(),
      [
        "id",
        "scientificName",
        "recordedName",
        "reportedLocality",
        "evidenceKind",
        "observationDate",
        "sourceUrl",
        "taxonomyUrl",
        "independentTaxonomyUrl",
        "taxonUsageKey",
      ].sort(),
    );
  }
});

test("independent uncertain/synonym and broad-basin holds cannot be admitted by changing a ledger flag", () => {
  for (const hold of inputs.decisions.records.filter((record) => record.decision === "hold")) {
    const changed = structuredClone(inputs);
    const row = changed.decisions.records.find((record) => record.candidateId === hold.candidateId);
    row.decision = "admit-checklist-assertion";
    assert.throws(() => buildTaalChecklistEvidence(changed), /hold cannot enter/);
  }
});

test("batch review pins the extraction, locality, taxonomy and independent-review snapshots", () => {
  for (const key of ["candidates", "locality", "taxonomy", "independent"]) {
    const changed = structuredClone(inputs);
    changed.hashes[key] = "a-new-unreviewed-snapshot";
    assert.throws(() => buildTaalChecklistEvidence(changed), /requires batch review/);
  }
});

test("missing scoped rights, license conflicts, altered taxonomic identities or source citations fail closed", () => {
  const admittedId = inputs.decisions.records.find((row) => row.decision === "admit-checklist-assertion").candidateId;
  const cases = [
    (data) => {
      data.sources.sources.find((source) => source.id === data.candidates.source.id).approvedProjectionBatches = [];
    },
    (data) => {
      data.candidates.source.license = "CC-BY-NC";
    },
    (data) => {
      data.decisions.sourceApproval.scope = "all-datasets";
    },
    (data) => {
      data.taxonomy.proposals.find((row) => row.candidateId === admittedId).proposedUsage.usageKey = "DIFFERENT";
    },
    (data) => {
      data.independent.reviews.find((row) => row.candidateId === admittedId).worms.status = "unaccepted";
    },
    (data) => {
      data.independent.reviews.find((row) => row.candidateId === admittedId).recordedName =
        "Caranx ignobilis (Wrong, 2000)";
    },
    (data) => {
      data.independent.reviews.find((row) => row.candidateId === admittedId).sourceEvidence.sourceEntrySha256 =
        "0".repeat(64);
    },
    (data) => {
      data.independent.reviews.find((row) => row.candidateId === admittedId).taxonomyProposalReference.responseSha256 =
        "0".repeat(64);
    },
    (data) => {
      data.decisions.records.find((row) => row.candidateId === admittedId).sourceUrl = "https://example.com/unreviewed";
    },
  ];
  for (const mutate of cases) {
    const changed = structuredClone(inputs);
    mutate(changed);
    assert.throws(() => buildTaalChecklistEvidence(changed));
  }
});

test("lake identity, source locality and unknown observation dates cannot be replaced by broader scope or publication dates", () => {
  const admittedId = inputs.decisions.records.find((row) => row.decision === "admit-checklist-assertion").candidateId;
  const cases = [
    (data) => {
      data.locality.proposals.find((row) => row.candidateId === admittedId).proposedWaterbodyId = "ph-wb-laguna-de-bay";
    },
    (data) => {
      data.locality.proposals.find((row) => row.candidateId === admittedId).reportedLocality = "Luzon Island";
    },
    (data) => {
      data.locality.proposals.find((row) => row.candidateId === admittedId).observationDate = "2023-06-09";
    },
    (data) => {
      data.scope.waterbodies.find((row) => row.id === "ph-wb-taal-lake").kind = "bay";
    },
  ];
  for (const mutate of cases) {
    const changed = structuredClone(inputs);
    mutate(changed);
    assert.throws(() => buildTaalChecklistEvidence(changed));
  }
});
