import assert from "node:assert/strict";
import test from "node:test";
import {
  getProvinceWarning,
  mergeAdvisorySnapshots,
  parseAdvisorySnapshot,
} from "../src/lib/map-advisories.ts";

const now = Date.parse("2026-01-01T06:03:00Z");
const provinces = ["cavite", "laguna"];
function fixture() {
  return {
    version: 1,
    mode: "live",
    generatedAt: "2026-01-01T06:03:00Z",
    sources: [{
      id: "pagasa-reviewed",
      name: "Reviewed PAGASA adapter",
      url: "https://www.pagasa.dost.gov.ph/",
      provinceIds: ["cavite"],
      hazards: ["rainfall", "thunderstorm", "wind", "flood", "marine"],
      checkedAt: "2026-01-01T06:03:00Z",
      status: "ok",
    }],
    alerts: [{
      id: "rain-1",
      sourceId: "pagasa-reviewed",
      hazard: "rainfall",
      level: "emergency",
      officialLevel: "Red rainfall warning",
      title: { en: "Rainfall warning", fil: "Babala sa ulan" },
      description: { en: "Flooding expected.", fil: "Inaasahan ang pagbaha." },
      instruction: { en: "Read the official bulletin.", fil: "Basahin ang opisyal na bulletin." },
      areas: [{ provinceId: "cavite", scope: "partial", localities: ["Bacoor"] }],
      issuedAt: "2026-01-01T06:00:00Z",
      effectiveAt: "2026-01-01T06:00:00Z",
      expiresAt: "2026-01-01T09:00:00Z",
      sourceUrl: "https://www.pagasa.dost.gov.ph/regional-forecast/ncrprsd",
      status: "active",
      supersedes: [],
    }],
  };
}

test("missing data and uncovered provinces stay unknown", () => {
  assert.equal(getProvinceWarning(null, "cavite", now).level, "unknown");
  assert.equal(getProvinceWarning(fixture(), "laguna", now).level, "unknown");
});

test("overlapping hazards use the highest severity and retain partial locations", () => {
  const data = fixture();
  data.alerts.push({ ...data.alerts[0], id: "flood-1", hazard: "flood", level: "warning" });
  const warning = getProvinceWarning(data, "cavite", now);
  assert.equal(warning.level, "emergency");
  assert.equal(warning.alerts.length, 2);
  assert.deepEqual(warning.alerts[0].areas[0].localities, ["Bacoor"]);
  const filtered = getProvinceWarning(data, "cavite", now, false, "flood");
  assert.equal(filtered.level, "warning");
  assert.equal(filtered.alerts.length, 1);
  assert.equal(warning.alerts.length, 2);
});

test("only complete healthy coverage allows a checked empty state", () => {
  const data = fixture();
  data.alerts = [];
  assert.equal(getProvinceWarning(data, "cavite", now).level, "clear");
  data.sources[0].hazards = ["rainfall"];
  assert.equal(getProvinceWarning(data, "cavite", now).level, "unknown");
  data.sources[0].status = "unavailable";
  assert.equal(getProvinceWarning(data, "cavite", now).level, "unknown");
});

test("transport failure never turns a previous warning or empty cache into a clear state", () => {
  assert.equal(getProvinceWarning(fixture(), "cavite", now, true).level, "emergency");
  assert.equal(getProvinceWarning(fixture(), "cavite", now, true).stale, true);
  const data = fixture();
  data.alerts = [];
  assert.equal(getProvinceWarning(data, "cavite", now, true).level, "unknown");
});

test("expired last-known warnings remain visible when source freshness is lost", () => {
  const warning = getProvinceWarning(fixture(), "cavite", now + 4 * 60 * 60 * 1000);
  assert.equal(warning.level, "emergency");
  assert.equal(warning.stale, true);
  assert.equal(warning.complete, false);
});

test("expiry is honored after a fresh complete source publication", () => {
  const data = fixture();
  data.generatedAt = "2026-01-01T10:00:00Z";
  data.sources[0].checkedAt = data.generatedAt;
  const warning = getProvinceWarning(data, "cavite", Date.parse(data.generatedAt));
  assert.equal(warning.level, "clear");
  assert.deepEqual(warning.alerts, []);
});

test("effective cancellation suppresses the referenced warning", () => {
  const data = fixture();
  data.alerts.push({ ...data.alerts[0], id: "cancel-1", status: "cancelled", supersedes: ["rain-1"] });
  assert.equal(getProvinceWarning(data, "cavite", now).alerts.length, 0);
});

test("future-effective updates do not prematurely suppress an active warning", () => {
  const data = fixture();
  data.alerts.push({ ...data.alerts[0], id: "update-1", level: "warning", effectiveAt: "2026-01-01T07:00:00Z", supersedes: ["rain-1"] });
  assert.equal(getProvinceWarning(data, "cavite", now).level, "emergency");
});

test("source check times and future snapshot times cannot claim healthy coverage", () => {
  const data = fixture();
  data.alerts = [];
  data.sources[0].checkedAt = "2026-01-01T05:00:00Z";
  assert.equal(getProvinceWarning(data, "cavite", now).level, "unknown");
  data.generatedAt = "2026-01-01T07:00:00Z";
  data.sources[0].checkedAt = data.generatedAt;
  assert.equal(getProvinceWarning(data, "cavite", now).level, "unknown");
});

test("validation rejects mismatched geography, duplicates, unsafe links and impossible validity", () => {
  const mutations = [
    (data) => { data.alerts[0].areas[0].provinceId = "unmapped-city"; },
    (data) => { data.alerts.push({ ...data.alerts[0] }); },
    (data) => { data.alerts[0].sourceUrl = "https://pagasa.dost.gov.ph.example.com/"; },
    (data) => { data.alerts[0].sourceUrl = "javascript:alert(1)"; },
    (data) => { data.alerts[0].expiresAt = data.alerts[0].issuedAt; },
    (data) => { data.alerts[0].areas[0].localities = []; },
    (data) => { data.alerts[0].sourceId = "unreviewed"; },
    (data) => { data.sources[0].hazards = ["wind"]; },
    (data) => { data.alerts[0].issuedAt = "2026-01-01T08:00:00Z"; },
    (data) => { data.alerts[0].expiresAt = "2026-02-31T09:00:00Z"; },
    (data) => { data.sources[0].checkedAt = "2026-01-01T05:59:00Z"; },
  ];
  for (const mutate of mutations) {
    const data = fixture();
    mutate(data);
    assert.throws(() => parseAdvisorySnapshot(data, provinces));
  }
});

test("live ingestion rejects demo payloads and strips unknown provider fields", () => {
  const data = fixture();
  data.mode = "demo";
  assert.throws(() => parseAdvisorySnapshot(data, provinces));
  data.mode = "live";
  data.providerPrivateField = "excluded";
  data.alerts[0].providerPrivateField = "excluded";
  const parsed = parseAdvisorySnapshot(data, provinces);
  assert.equal("providerPrivateField" in parsed, false);
  assert.equal("providerPrivateField" in parsed.alerts[0], false);
});

test("failed or missing source publications retain previous warning records", () => {
  const previous = fixture();
  const next = fixture();
  next.alerts = [];
  next.sources[0].status = "unavailable";
  const merged = mergeAdvisorySnapshots(previous, next, now);
  assert.equal(getProvinceWarning(merged, "cavite", now).level, "emergency");
  assert.equal(getProvinceWarning(merged, "cavite", now).stale, true);
  next.sources = [];
  assert.equal(mergeAdvisorySnapshots(previous, next, now).alerts.length, 1);
});

test("healthy complete source updates may replace previous warnings", () => {
  const next = fixture();
  next.alerts = [];
  const merged = mergeAdvisorySnapshots(fixture(), next, now);
  assert.equal(getProvinceWarning(merged, "cavite", now).level, "clear");
});

test("older publications cannot overwrite a more recent snapshot", () => {
  const next = fixture();
  next.generatedAt = "2026-01-01T05:00:00Z";
  assert.throws(() => mergeAdvisorySnapshots(fixture(), next, now), /backwards/);
});

test("shrinking geographic or hazard coverage cannot silently clear prior warnings", () => {
  const next = fixture();
  next.alerts = [];
  next.sources[0].provinceIds = ["laguna"];
  next.sources[0].hazards = ["wind"];
  const merged = mergeAdvisorySnapshots(fixture(), next, now);
  const warning = getProvinceWarning(merged, "cavite", now);
  assert.equal(warning.level, "emergency");
  assert.equal(warning.stale, true);
  assert.equal(warning.complete, false);
});

test("live and demonstration snapshots cannot be merged", () => {
  const demo = fixture();
  demo.mode = "demo";
  assert.throws(() => mergeAdvisorySnapshots(fixture(), demo, now), /mixed/);
});

test("a later wrapper cannot replace warnings using an older source check", () => {
  const previous = fixture();
  const next = fixture();
  next.generatedAt = "2026-01-01T06:04:00Z";
  next.sources[0].checkedAt = "2026-01-01T06:02:00Z";
  next.alerts = [];
  const merged = mergeAdvisorySnapshots(previous, next, now + 60_000);
  const warning = getProvinceWarning(merged, "cavite", now + 60_000);
  assert.equal(warning.level, "emergency");
  assert.equal(warning.stale, true);
});

test("regressed source records cannot downgrade or cancel the last accepted warning", () => {
  for (const status of ["active", "cancelled"]) {
    const previous = fixture();
    const next = fixture();
    next.generatedAt = "2026-01-01T06:04:00Z";
    next.sources[0].checkedAt = "2026-01-01T06:02:00Z";
    next.alerts[0].level = "advisory";
    next.alerts[0].status = status;
    if (status === "cancelled") {
      next.alerts[0].id = "older-cancel";
      next.alerts[0].supersedes = ["rain-1"];
    }
    const warning = getProvinceWarning(mergeAdvisorySnapshots(previous, next, now + 60_000), "cavite", now + 60_000);
    assert.equal(warning.level, "emergency");
    assert.equal(warning.alerts[0].id, "rain-1");
    assert.equal(warning.stale, true);
  }
});

test("one healthy source does not hide a failed declared source in a clear state", () => {
  const data = fixture();
  data.alerts = [];
  data.sources.push({ ...data.sources[0], id: "second-source", status: "unavailable" });
  const warning = getProvinceWarning(data, "cavite", now);
  assert.equal(warning.level, "unknown");
  assert.equal(warning.complete, false);
});

test("cyclic update references are rejected instead of suppressing every warning", () => {
  const data = fixture();
  data.alerts[0].supersedes = ["rain-2"];
  data.alerts.push({ ...data.alerts[0], id: "rain-2", supersedes: ["rain-1"] });
  assert.throws(() => parseAdvisorySnapshot(data, provinces));
});
