import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const raw = new URL("raw/calabarzon-tayabas-gbif-specimen-20261026/", base);
const [review, occurrenceBytes, verbatimBytes, datasetBytes, rdfBytes, queryBytes, registry, report, scope, sourceBytes, scopeBytes] = await Promise.all([
  readFile(new URL("calabarzon-tayabas-gbif-specimen-review-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("occurrence.json", raw)),
  readFile(new URL("verbatim.json", raw)),
  readFile(new URL("dataset.json", raw)),
  readFile(new URL("specimen-rdf.xml", raw)),
  readFile(new URL("raw/gbif-calabarzon-colxr-actinopterygii-rerun-20261024/tayabas.json", base)),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-scope.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base)),
  readFile(new URL("calabarzon-scope.json", base)),
]);

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("Tayabas-only Naturalis specimen remains held without waterbody or species assertion", () => {
  const occurrence = JSON.parse(occurrenceBytes);
  const verbatim = JSON.parse(verbatimBytes);
  const dataset = JSON.parse(datasetBytes);
  const occurrenceId = "2432779620";

  assert.equal(review.candidate.gbifId, occurrenceId);
  assert.equal(review.discoveryQuery.returnedRecords, 1);
  assert.equal(hash(queryBytes), review.discoveryQuery.sha256);
  assert.equal(occurrence.gbifID, occurrenceId);
  assert.equal(occurrence.scientificName, review.candidate.scientificName);
  assert.equal(occurrence.locality, "Tayabas");
  assert.equal(occurrence.decimalLatitude, undefined);
  assert.equal(occurrence.decimalLongitude, undefined);
  assert.equal(occurrence.waterBody, undefined);
  assert.equal(occurrence.eventDate, undefined);
  assert.equal(verbatim["http://rs.tdwg.org/dwc/terms/locality"], "Tayabas");
  assert.equal(verbatim["http://rs.tdwg.org/dwc/terms/country"], "Phillipines");
  assert.equal(verbatim["http://rs.tdwg.org/dwc/terms/eventDate"], undefined);
  assert.equal(verbatim["http://rs.tdwg.org/dwc/terms/decimalLatitude"], undefined);
  assert.equal(dataset.key, review.dataset.key);
  assert.match(dataset.license, /publicdomain\/zero/);
  assert.match(rdfBytes.toString("utf8"), /ZMA\.PISC\.135570/);
  assert.deepEqual(occurrence.issues, review.qualityIssues);

  assert.equal(review.decision.status, "held-unassigned-locality-only");
  assert.equal(review.decision.waterbodyAssignment, false);
  assert.equal(review.decision.speciesAssertionsAdmitted, 0);
  assert.equal(review.decision.publicProjection, false);
  assert.equal(review.decision.currentPresenceInferred, false);
  assert.equal(review.decision.coordinatesPublished, false);
  assert.deepEqual(review.receipts, {
    occurrence: { path: "raw/calabarzon-tayabas-gbif-specimen-20261026/occurrence.json", bytes: occurrenceBytes.length, sha256: hash(occurrenceBytes) },
    verbatim: { path: "raw/calabarzon-tayabas-gbif-specimen-20261026/verbatim.json", bytes: verbatimBytes.length, sha256: hash(verbatimBytes) },
    dataset: { path: "raw/calabarzon-tayabas-gbif-specimen-20261026/dataset.json", bytes: datasetBytes.length, sha256: hash(datasetBytes) },
    naturalisRecord: { path: "raw/calabarzon-tayabas-gbif-specimen-20261026/specimen-rdf.xml", bytes: rdfBytes.length, sha256: hash(rdfBytes) },
  });

  const tayabasWaterbodies = scope.waterbodies.filter((waterbody) => /tayabas/i.test(`${waterbody.id} ${waterbody.name}`));
  assert.ok(tayabasWaterbodies.length > 0);
  assert.ok(tayabasWaterbodies.every((waterbody) => !waterbody.sourceRefs.includes("gbif-occurrence-downloads")));
  assert.ok(tayabasWaterbodies.every((waterbody) => !waterbody.sourceRefs.includes(occurrenceId)));
});

test("GBIF source context matches the unchanged incomplete CALABARZON checkpoint", () => {
  const gbif = registry.sources.find((source) => source.id === review.sourceRegistryId);
  assert.ok(gbif);
  assert.ok(gbif.access.reviewFiles.includes("calabarzon-tayabas-gbif-specimen-review-20261026.json"));
  assert.ok(gbif.access.additionalRawPaths.includes("raw/calabarzon-tayabas-gbif-specimen-20261026/"));
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(report.inputHashes.sourcesSha256, hash(sourceBytes));
  assert.equal(report.coverageSummary.registeredSources, registry.sourceCount);
  assert.equal(report.coverageSummary.admittedPublicRecords, 0);
  assert.equal(report.coverageSummary.publicAdmission, false);
  assert.equal(report.coverageSummary.regionalBaselineComplete, false);
  assert.equal(report.inputHashes.scopeSha256, hash(scopeBytes));
});
