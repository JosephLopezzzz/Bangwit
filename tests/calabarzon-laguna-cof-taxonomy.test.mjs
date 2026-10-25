import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { parseCatalogResults, selectCatalogResult } from "../scripts/species/catalog-of-fishes-parser.mjs";

const reviewUrl = new URL("../data/research/philippines/calabarzon-laguna-cof-taxonomy-20261025.json", import.meta.url);
const detailsUrl = new URL(
  "../data/research/philippines/calabarzon-laguna-gbif-record-details-20261025.json",
  import.meta.url,
);
const sourcesUrl = new URL("../data/research/philippines/sources.json", import.meta.url);

const [review, detailsBytes, sourceRegistry] = await Promise.all([
  readFile(reviewUrl, "utf8").then(JSON.parse),
  readFile(detailsUrl),
  readFile(sourcesUrl, "utf8").then(JSON.parse),
]);

test("Catalog of Fishes parser selects the queried result row, not an unrelated status", () => {
  const html = `
    <p class="result" spid="1"><b><i>mauritiana</i>, <i>Anguilla</i></b>
      <b>Current status:</b> Synonym of <i>Anguilla marmorata</i> Quoy &amp; Gaimard 1824. Anguillidae. Habitat: freshwater.
    </p>
    <p class="result" spid="2"><b><i>marmorata</i>, <i>Anguilla</i></b>
      <b>Current status:</b> Valid as <i>Anguilla marmorata</i> Quoy &amp; Gaimard 1824. Anguillidae. Distribution: Indo-Pacific.
    </p>`;
  const rows = parseCatalogResults(html);
  const synonym = selectCatalogResult("Anguilla mauritiana", rows);
  const accepted = selectCatalogResult("Anguilla marmorata", rows);

  assert.equal(rows.length, 2);
  assert.equal(synonym.selected.rowName, "Anguilla mauritiana");
  assert.equal(synonym.selected.statusName, "Anguilla marmorata");
  assert.equal(synonym.classification, "synonym");
  assert.equal(accepted.selected.rowName, "Anguilla marmorata");
  assert.equal(accepted.classification, "valid-name");
});

test("Laguna name crosswalk is bounded, hashed, and admits no occurrence records", () => {
  assert.equal(review.input.sha256, createHash("sha256").update(detailsBytes).digest("hex"));
  assert.equal(review.input.occurrenceRecordCount, 18);
  assert.equal(review.input.distinctQueriedBinomials, 21);
  assert.equal(review.summary.acceptedNameAgreements, 13);
  assert.equal(review.summary.taxonomicHolds, 5);
  assert.equal(review.decision.occurrenceAssertionsAdmitted, 0);
  assert.equal(review.decision.publicRecordsAdded, 0);
  assert.equal(review.decision.publicAdmission, false);
  assert.equal(review.decision.localityInferredFromTypeLocality, false);
  assert.ok(review.taxonChecks.every((row) => /^[a-f0-9]{64}$/.test(row.responseSha256)));
  assert.ok(
    review.recordCrosswalk.every((row) =>
      ["independent-name-crosscheck-agrees", "hold-for-taxonomic-review"].includes(row.taxonomyDisposition),
    ),
  );
  assert.equal(JSON.stringify(review).includes("decimalLongitude"), false);
  assert.equal(JSON.stringify(review).includes("decimalLatitude"), false);

  const mauritiana = review.recordCrosswalk.find((row) => row.recordedName.startsWith("Anguilla mauritiana"));
  assert.equal(mauritiana.recordedNameMapsToGbifAccepted, true);
  const hypseleotris = review.recordCrosswalk.find((row) => row.recordedName.startsWith("Hypseleotris agilis"));
  assert.equal(hypseleotris.taxonomyDisposition, "hold-for-taxonomic-review");

  const source = sourceRegistry.sources.find((row) => row.id === "calabarzon-laguna-cof-taxonomy-crosscheck");
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.equal(source.license, null);
});
