import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CHECKLIST_KEY } from "./match-freshwater-taxonomy.mjs";

const root = new URL("../../", import.meta.url);
const research = new URL("data/research/philippines/", root);
const target = new URL("src/data/taal-checklist-evidence.json", root);
const batchId = "taal-checklist-20261022";
const waterbodyId = "ph-wb-taal-lake";
const sourceId = "jamandre-2023-plazi-freshwater";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

function keyed(rows, key, label) {
  assert.ok(
    rows.every((row) => typeof row[key] === "string" && row[key].trim()),
    `Missing ${label}`,
  );
  const map = new Map(rows.map((row) => [row[key], row]));
  assert.equal(map.size, rows.length, `Duplicate ${label}`);
  return map;
}

/** A bounded, independently reviewed checklist projection; never an occurrence or current-presence feed. */
export function buildTaalChecklistEvidence({
  candidates,
  locality,
  taxonomy,
  independent,
  scope,
  sources,
  decisions,
  hashes,
}) {
  assert.equal(decisions.schemaVersion, 1);
  assert.equal(decisions.batchId, batchId);
  assert.equal(decisions.evidenceKind, "literature-checklist-assertion");
  for (const key of ["candidates", "locality", "taxonomy", "independent"]) {
    assert.equal(decisions.snapshotHashes[key], hashes[key], `Changed ${key} snapshot requires batch review`);
  }
  assert.equal(candidates.source.id, sourceId);
  assert.equal(candidates.source.license, "CC0-1.0");
  assert.equal(decisions.sourceApproval.sourceId, sourceId);
  assert.equal(decisions.sourceApproval.sourceArchiveSha256, candidates.source.archiveSha256);
  assert.equal(decisions.sourceApproval.metadataSha256, candidates.source.metadataSha256);
  assert.equal(decisions.sourceApproval.license, "CC0-1.0");
  assert.equal(decisions.sourceApproval.scope, "this-batch-only");
  const registeredSource = sources.sources.find((source) => source.id === sourceId);
  assert.ok(registeredSource?.approvedProjectionBatches?.includes(batchId), "No scoped source approval for this batch");
  assert.equal(taxonomy.source.checklistKey, CHECKLIST_KEY);
  assert.equal(taxonomy.source.candidateArtifactSha256, hashes.candidates);
  assert.equal(locality.candidateArtifactSha256, hashes.candidates);
  assert.equal(taxonomy.source.metadataSha256, decisions.taxonomyIndexSha256);
  assert.equal(taxonomy.source.indexStableDuringRun, true);
  assert.equal(independent.sourceEvidence.sourceId, sourceId);
  assert.equal(independent.sourceEvidence.candidateArtifactSha256, hashes.candidates);
  assert.equal(independent.sourceEvidence.localityReviewSha256, hashes.locality);
  assert.equal(independent.sourceEvidence.taxonomyProposalArtifactSha256, hashes.taxonomy);
  assert.equal(independent.sourceEvidence.sourceArchiveSha256, candidates.source.archiveSha256);
  assert.equal(independent.sourceEvidence.taxonomyChecklistKey, CHECKLIST_KEY);
  const body = scope.waterbodies.find((waterbody) => waterbody.id === waterbodyId);
  assert.equal(body?.kind, "lake");
  assert.ok([body.name, ...body.aliases].includes("Lake Taal"));
  assert.ok(
    body.administrativeAssociations.some(
      (association) => association.regionId === "0400000000" && association.provinceId === "0401000000",
    ),
  );
  const byCandidate = keyed(candidates.candidates, "id", "candidate ID");
  const byLocality = keyed(locality.proposals, "candidateId", "locality candidate ID");
  const byTaxonomy = keyed(taxonomy.proposals, "candidateId", "taxonomy candidate ID");
  const byIndependent = keyed(independent.reviews, "candidateId", "independent review candidate ID");
  const byDecision = keyed(decisions.records, "candidateId", "batch decision candidate ID");
  assert.deepEqual(
    [...byDecision.keys()].sort(),
    [...byLocality.keys()].sort(),
    "Every scoped locality lead needs an explicit decision",
  );
  assert.equal(independent.checkedOn, decisions.reviewedOn);
  const records = [];
  for (const decision of decisions.records) {
    assert.ok(decision.reason?.trim(), "Missing review rationale");
    const candidate = byCandidate.get(decision.candidateId);
    const location = byLocality.get(decision.candidateId);
    const proposal = byTaxonomy.get(decision.candidateId);
    const identity = byIndependent.get(decision.candidateId);
    assert.ok(candidate && location && proposal && identity, "Missing batch evidence join");
    assert.equal(candidate.candidateName, identity.scientificName);
    assert.equal(candidate.recordedName, identity.recordedName, "Independent recorded-name review mismatch");
    assert.equal(
      hash(candidate.verbatimEntry),
      identity.sourceEvidence.sourceEntrySha256,
      "Independent source-entry review mismatch",
    );
    assert.equal(
      identity.taxonomyProposalReference.responseSha256,
      proposal.responseSha256,
      "Independent taxonomy response mismatch",
    );
    assert.equal(identity.sourceEvidence.sourceParagraph, candidate.sourceParagraph);
    assert.equal(identity.sourceEvidence.reportedLocality, location.reportedLocality);
    if (decision.decision === "hold") {
      continue;
    }
    assert.equal(decision.decision, "admit-checklist-assertion", "Unknown batch decision");
    assert.equal(
      identity.recommendedDecision,
      "admit-checklist-identity",
      "Independent taxonomy/locality hold cannot enter public projection",
    );
    assert.equal(location.proposedWaterbodyId, waterbodyId);
    assert.equal(location.localityReview, "explicit-named-lake-wording");
    assert.equal(location.reportedLocality, "Lake Taal, Luzon Island");
    assert.equal(location.sourcePublicationDate, "2023-06-09");
    assert.equal(location.observationDate, null);
    assert.equal(location.sourceUrl, candidate.sourceUrl);
    assert.equal(location.sourceParagraph, candidate.sourceParagraph);
    assert.ok(candidate.verbatimEntry.includes(location.reportedLocality));
    assert.equal(proposal.queryStatus, "success");
    assert.equal(proposal.classification, "exact-species");
    assert.equal(proposal.proposedUsage.status, "ACCEPTED");
    assert.equal(proposal.proposedUsage.rank, "SPECIES");
    assert.equal(proposal.proposedUsage.checklistKey, CHECKLIST_KEY);
    assert.equal(proposal.proposedUsage.canonicalName, candidate.candidateName);
    assert.equal(proposal.proposedUsage.usageKey, decision.reviewedUsageKey);
    assert.equal(identity.worms.status, "accepted");
    assert.equal(identity.worms.validScientificName, candidate.candidateName);
    assert.equal(identity.worms.aphiaId, decision.independentAphiaId);
    assert.match(identity.worms.responseSha256, /^[0-9a-f]{64}$/);
    assert.equal(decision.sourceUrl, candidate.sourceUrl);
    assert.equal(decision.reportedLocality, location.reportedLocality);
    assert.equal(decision.sourceParagraph, candidate.sourceParagraph);
    assert.equal(decision.observationDate, null);
    assert.match(candidate.sourceUrl, /^https:\/\/treatment\.plazi\.org\/id\/[0-9A-F]{32}$/);
    records.push({
      id: candidate.id,
      scientificName: candidate.candidateName,
      recordedName: candidate.recordedName,
      reportedLocality: location.reportedLocality,
      evidenceKind: "literature-checklist-assertion",
      observationDate: null,
      sourceUrl: candidate.sourceUrl,
      taxonomyUrl: `https://www.gbif.org/taxon/${encodeURIComponent(decision.reviewedUsageKey)}`,
      independentTaxonomyUrl: `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${identity.worms.aphiaId}`,
      taxonUsageKey: decision.reviewedUsageKey,
    });
  }
  assert.ok(records.length > 0, "No eligible checklist assertions");
  assert.equal(records.length, decisions.counts.admittedAssertions);
  assert.equal(decisions.records.length - records.length, decisions.counts.heldLeads);
  assert.equal(decisions.records.length, decisions.counts.reviewedLeads);
  assert.ok(
    decisions.reviewer && decisions.reviewedOn && candidates.source.citation,
    "Missing review/citation provenance",
  );
  records.sort((a, b) => a.scientificName.localeCompare(b.scientificName, "en"));
  return {
    schemaVersion: 1,
    batchId,
    reviewedOn: decisions.reviewedOn,
    waterbody: { id: waterbodyId, name: "Taal Lake", kind: "lake", province: "Batangas", region: "CALABARZON" },
    source: {
      id: sourceId,
      title: candidates.source.title,
      citation: candidates.source.citation,
      datasetUrl: `https://www.gbif.org/dataset/${candidates.source.datasetKey}`,
      articleUrl: `https://doi.org/${candidates.source.articleDoi}`,
      license: "CC0-1.0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      publicationDate: "2023-06-09",
    },
    taxonomy: {
      authority: taxonomy.source.authority,
      checklistKey: CHECKLIST_KEY,
      indexAlias: taxonomy.source.matchingIndex.datasetAlias,
    },
    provenance: {
      batchReviewFile: "data/research/philippines/taal-checklist-decisions.json",
      inputHashes: decisions.snapshotHashes,
      sourceArchiveSha256: candidates.source.archiveSha256,
      taxonomyIndexSha256: decisions.taxonomyIndexSha256,
    },
    records,
  };
}

export async function readTaalChecklistInputs() {
  const files = {
    candidates: "freshwater-checklist-candidates.json",
    locality: "calabarzon-checklist-locality-review.json",
    taxonomy: "freshwater-taxonomy-matches.json",
    independent: "taal-taxonomy-review.json",
    scope: "calabarzon-scope.json",
    sources: "sources.json",
    decisions: "taal-checklist-decisions.json",
  };
  const entries = await Promise.all(
    Object.entries(files).map(async ([key, name]) => {
      const bytes = await readFile(new URL(name, research));
      return [key, { data: JSON.parse(bytes.toString("utf8")), sha256: hash(bytes) }];
    }),
  );
  return {
    ...Object.fromEntries(entries.map(([key, value]) => [key, value.data])),
    hashes: Object.fromEntries(entries.map(([key, value]) => [key, value.sha256])),
  };
}

export const taalChecklistJson = (artifact) => `${JSON.stringify(artifact, null, 2)}\n`;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const artifact = buildTaalChecklistEvidence(await readTaalChecklistInputs());
    const output = taalChecklistJson(artifact);
    if (process.argv.includes("--check"))
      assert.equal(
        await readFile(target, "utf8"),
        output,
        "Public Taal checklist projection differs from reviewed inputs",
      );
    else await writeFile(target, output);
    console.log(
      `Reviewed Taal projection: ${artifact.records.length} checklist assertions; observation dates unknown; held leads excluded.`,
    );
  } catch (error) {
    console.error(`Taal checklist projection failed: ${error.message}`);
    process.exitCode = 1;
  }
}
