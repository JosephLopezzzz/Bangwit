import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  buildHistoricalEvidence,
  historicalEvidenceJson,
  readHistoricalEvidenceInputs,
} from "../scripts/build-cavite-historical-evidence.mjs";
import { parseCsv } from "../scripts/lib/csv.mjs";

const inputs = await readHistoricalEvidenceInputs();
const evidence = buildHistoricalEvidence(inputs);
const datasetId = "d6af0fac-8a21-4d77-8872-f10d471fc0cf";
function csv(rows) {
  const headers = Object.keys(rows[0]);
  return [headers, ...rows.map((row) => headers.map((key) => row[key]))]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}
function changedRows(key, mutate) {
  const rows = parseCsv(inputs[key].toString("utf8"));
  mutate(rows);
  return { ...inputs, [key]: csv(rows) };
}
test("strict CSV preserves quoted commas, quotes, multiline values, empty cells and CRLF", () => {
  assert.deepEqual(parseCsv('\uFEFFa,b,c\r\n"hello, ""bay""","line one\r\nline two",\r\n'), [
    { a: 'hello, "bay"', b: "line one\r\nline two", c: "" },
  ]);
});
test("strict CSV rejects malformed quotes, column mismatches and duplicate or empty headers", () => {
  for (const source of [
    'a,b\n"unterminated,b',
    'a,b\nun"quoted,b',
    'a,b\n"closed"x,b',
    "a,b\none",
    "a,b\none,two,three",
    "a,a\none,two",
    "a,\none,two",
    "",
  ])
    assert.throws(() => parseCsv(source), /CSV/i);
});
test("publishes only the 12 reviewed museum records and leaves the rejected source row intact", () => {
  assert.equal(parseCsv(inputs.shortlistCsv.toString("utf8")).length, 13);
  assert.equal(evidence.records.length, 12);
  assert.equal(new Set(evidence.records.map((record) => record.acceptedName)).size, 12);
  assert.equal(evidence.excludedCount, 1);
  assert.equal(evidence.records.filter((record) => record.localityGroup === "limbones-cove").length, 5);
  assert.equal(evidence.records.filter((record) => record.localityGroup === "cavite-manila-bay").length, 7);
  assert.ok(evidence.records.every((record) => record.recordedName !== "Bovichtus variegatus"));
  assert.equal(evidence.dataset.url, `https://obis.org/dataset/${datasetId}`);
  assert.equal(evidence.dataset.license, "CC0 1.0");
  assert.equal(evidence.snapshot.taxonomyReviewedAt, "2026-10-06T13:52:35.032Z");
  assert.equal(evidence.snapshot.licenseReviewedAt, "2026-10-06");
  const expectedKeys = [
    "id",
    "recordedName",
    "acceptedName",
    "collectedOn",
    "localityGroup",
    "reportedLocality",
    "georeferenceRemarks",
    "coordinateUncertaintyM",
    "sourceUrl",
    "taxonomyUrl",
    "taxonStatus",
    "acceptedTaxonId",
  ].sort();
  for (const record of evidence.records) assert.deepEqual(Object.keys(record).sort(), expectedKeys);
});
test("rejects unknown locality statuses and any attempt to include the rejected locality", () => {
  assert.throws(
    () =>
      buildHistoricalEvidence(
        changedRows("shortlistCsv", (rows) => {
          rows[0].locality_screen_status = "Manual locality review required";
        }),
      ),
    /Unreviewed locality/,
  );
  assert.throws(
    () =>
      buildHistoricalEvidence(
        changedRows("shortlistCsv", (rows) => {
          rows.find((row) => row.recorded_name === "Bovichtus variegatus").locality_screen_status =
            "Limbones Cove historical lead; approximate area only";
        }),
      ),
    /rejected Bovichtus/,
  );
});
test("requires both CC0 licenses and cross-checks the reviewed dataset metadata", () => {
  for (const field of ["record_license", "dataset_metadata_license"])
    assert.throws(
      () =>
        buildHistoricalEvidence(
          changedRows("shortlistCsv", (rows) => {
            rows[0][field] = "CC-BY-NC 4.0";
          }),
        ),
      /License/,
    );
  assert.throws(
    () =>
      buildHistoricalEvidence(
        changedRows("licenseReviewCsv", (rows) => {
          rows.find((row) => row.dataset_id === datasetId).dataset_metadata_license = "CC-BY 4.0";
        }),
      ),
    /license/,
  );
});
test("requires complete museum provenance and primary source links", () => {
  for (const field of [
    "recorded_name",
    "accepted_name",
    "obis_record_url",
    "obis_dataset_url",
    "dataset_citation",
    "worms_record_url",
    "reported_locality",
    "source_georeference_remarks",
    "coordinate_uncertainty_m",
  ])
    assert.throws(() =>
      buildHistoricalEvidence(
        changedRows("shortlistCsv", (rows) => {
          rows[0][field] = "";
        }),
      ),
    );
  for (const [field, value] of [
    ["basis_of_record", "HumanObservation"],
    ["obis_record_url", "https://example.com/occurrence/cf54df3e-fd15-463c-a923-b578dc1a88d7"],
    ["obis_dataset_url", "https://obis.org/dataset/another-dataset"],
    ["coordinate_uncertainty_m", "-1"],
  ])
    assert.throws(() =>
      buildHistoricalEvidence(
        changedRows("shortlistCsv", (rows) => {
          rows[0][field] = value;
        }),
      ),
    );
  assert.throws(() => buildHistoricalEvidence({ ...inputs, licenseReviewNotes: "" }), /review date/);
});
test("rejects empty and duplicate occurrence IDs", () => {
  assert.throws(
    () =>
      buildHistoricalEvidence(
        changedRows("shortlistCsv", (rows) => {
          rows[0].occurrence_id = "";
        }),
      ),
    /occurrence ID/,
  );
  assert.throws(
    () =>
      buildHistoricalEvidence(
        changedRows("shortlistCsv", (rows) => {
          rows.push({ ...rows[0] });
        }),
      ),
    /Duplicate occurrence ID/,
  );
});
test("preserves source date precision and unknown dates without filling from year", () => {
  assert.equal(evidence.records.filter((record) => record.collectedOn !== null).length, 9);
  assert.equal(evidence.records.filter((record) => record.collectedOn === null).length, 3);
  assert.equal(evidence.records.find((record) => record.recordedName === "Pseudanthias tuka").collectedOn, "1947-10");
  const unknown = buildHistoricalEvidence(
    changedRows("shortlistCsv", (rows) => {
      rows[0].year = "1947";
    }),
  );
  assert.equal(unknown.records[0].collectedOn, null);
  for (const [eventDate, year] of [
    ["1947-10-02", "1948"],
    ["2024-02-30", "2024"],
    ["1947-13", "1947"],
  ])
    assert.throws(
      () =>
        buildHistoricalEvidence(
          changedRows("shortlistCsv", (rows) => {
            rows[0].event_date = eventDate;
            rows[0].year = year;
          }),
        ),
      /collection date/i,
    );
});
test("keeps the reviewed accepted name and original WoRMS name-resolution record", () => {
  const renamed = evidence.records.find((record) => record.recordedName === "Pseudanthias tuka");
  assert.equal(renamed.acceptedName, "Mirolabrichthys tuka");
  assert.equal(renamed.acceptedTaxonId, "312510");
  assert.equal(renamed.taxonStatus, "superseded combination");
  assert.equal(new URL(renamed.taxonomyUrl).searchParams.get("id"), "218272");
  assert.throws(
    () =>
      buildHistoricalEvidence(
        changedRows("shortlistCsv", (rows) => {
          rows[0].accepted_name = "Unreviewed name";
        }),
      ),
    /taxonomy/,
  );
  assert.throws(
    () =>
      buildHistoricalEvidence(
        changedRows("crosswalkCsv", (rows) => {
          rows.find((row) => row.obis_species_name === "Ambassis urotaenia").worms_status = "unaccepted";
        }),
      ),
    /taxonomy/,
  );
  assert.throws(
    () =>
      buildHistoricalEvidence(
        changedRows("crosswalkCsv", (rows) => {
          rows.find((row) => row.obis_species_name === "Pseudanthias tuka").obis_aphia_id = "312510";
        }),
      ),
    /taxonomy|Aphia/,
  );
});
test("checked-in JSON exactly matches regeneration from every reviewed input and the source byte hash", async () => {
  const artifact = await readFile(new URL("../src/data/cavite-historical-evidence.json", import.meta.url), "utf8");
  assert.equal(artifact, historicalEvidenceJson(buildHistoricalEvidence(await readHistoricalEvidenceInputs())));
  assert.equal(evidence.snapshot.sha256, createHash("sha256").update(inputs.shortlistCsv).digest("hex"));
});
