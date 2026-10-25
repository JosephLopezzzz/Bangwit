import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import details from "../data/research/philippines/calabarzon-laguna-gbif-record-details-20261025.json" with {
  type: "json",
};
import sources from "../data/research/philippines/sources.json" with { type: "json" };

test("cross-checks all preliminary Laguna records against direct GBIF occurrence details", async () => {
  const triageBytes = await readFile(
    new URL("../data/research/philippines/calabarzon-laguna-gbif-triage-20261025.json", import.meta.url),
  );
  assert.equal(details.status, "direct-occurrence-details-cross-checked;historical-assertion-decision-pending");
  assert.equal(details.input.sha256, createHash("sha256").update(triageBytes).digest("hex"));
  assert.equal(details.input.candidateRecordCount, 18);
  assert.equal(details.summary.detailResponses, 18);
  assert.equal(details.summary.matchingTriageRecords, 18);
  assert.equal(details.summary.recordsWithMismatches, 0);
  assert.equal(details.summary.recordsWithSourceCatalogIdentifiers, 18);
  assert.equal(details.records.length, 18);

  for (const record of details.records) {
    assert.equal(record.matchingTriageFields, true);
    assert.equal(record.triageStatus, "candidate-for-independent-locality-review");
    assert.equal(record.basisOfRecord, "PRESERVED_SPECIMEN");
    assert.match(record.locality, /laguna\s+de\s+bay/i);
    assert.ok(record.eventDate);
    assert.ok(record.catalogNumber || record.occurrenceId);
    assert.ok(Array.isArray(record.qualityFlags));
    assert.match(record.rawResponse.sha256, /^[a-f0-9]{64}$/);
    assert.ok(!("decimalLatitude" in record));
    assert.ok(!("decimalLongitude" in record));
    assert.ok(!("coordinateUncertaintyInMeters" in record));
  }

  assert.deepEqual(details.decision, {
    historicalAssertionsAdmitted: 0,
    publicRecordsAdded: 0,
    publicAdmission: false,
    coordinatesIncluded: false,
    currentPresenceInferred: false,
    completeSpeciesInventoryClaimed: false,
    interpretation:
      "This direct-detail pass verifies GBIF's indexed fields and preserves catalog identifiers and flags for each candidate. It does not independently inspect the institution's catalog; all rows remain research-only pending source-level identity and explicit product-use review.",
  });

  const occurrenceSource = sources.sources.find((source) => source.id === "gbif-occurrence-downloads");
  assert.ok(occurrenceSource.access.reviewFiles.includes("calabarzon-laguna-gbif-record-details-20261025.json"));
  assert.ok(occurrenceSource.access.additionalRawPaths.includes("raw/calabarzon-laguna-gbif-record-details-20261025/"));
});

test("preserves documented GBIF warning fields while withholding their coordinates", () => {
  assert.equal(details.method.issueDocsUrl, "https://techdocs.gbif.org/en/data-use/occurrence-issues-and-flags");
  assert.equal(details.method.apiDocsUrl, "https://techdocs.gbif.org/en/openapi/v1/occurrence");
  assert.ok(details.summary.issueCodeCounts.some(({ issue }) => issue === "CONTINENT_INVALID"));
  assert.ok(
    details.summary.issueCodeCounts.some(({ issue }) => issue === "OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT"),
  );
  assert.match(details.method.flagInterpretation, /coordinates and current-presence claims are excluded/i);
});
