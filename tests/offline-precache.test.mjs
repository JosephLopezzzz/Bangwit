import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { test } from "node:test";
import { getManifest } from "@serwist/build";
import { offlinePrecacheOptions } from "../src/lib/offline-precache.ts";

const fixtureRoot = resolve(".next/offline-precache-tests");
mkdirSync(fixtureRoot, { recursive: true });

function fixture(t) {
  const directory = mkdtempSync(join(fixtureRoot, "run-"));
  t.after(() => {
    assert.ok(resolve(directory).startsWith(`${fixtureRoot}${sep}`));
    rmSync(directory, { recursive: true, force: true });
  });
  for (const folder of [".next/static/chunks", "public/icons", "src/app/~offline", "data/private"]) {
    mkdirSync(join(directory, folder), { recursive: true });
  }
  writeFileSync(join(directory, ".next/static/chunks/catches-v1.js"), "console.log('cached app chunk');");
  writeFileSync(join(directory, "public/icons/test.svg"), "<svg/>");
  writeFileSync(join(directory, "src/app/layout.tsx"), "export default function Layout() { return null; }");
  writeFileSync(join(directory, "src/app/~offline/page.tsx"), "export default function Offline() { return null; }");
  writeFileSync(join(directory, ".env.local"), "TEST_ONLY_PRIVATE_CONFIG=not-a-real-secret");
  writeFileSync(join(directory, "data/private/catches.json"), '{"notes":"private fixture marker"}');
  return directory;
}

async function manifest(directory) {
  const result = await getManifest({ globDirectory: directory, globFollow: false, ...offlinePrecacheOptions });
  assert.deepEqual(result.warnings, []);
  return result.manifestEntries;
}

function shellRevision(entries, url) {
  const entry = entries.find((item) => item.url === url);
  assert.ok(entry, `${url} must be precached`);
  assert.match(entry.revision, /^[0-9a-f]{64}$/);
  return entry.revision;
}

test("precaches the journal and fallback with deterministic matching revisions", async (t) => {
  const directory = fixture(t);
  const first = await manifest(directory);
  const second = await manifest(directory);
  assert.equal(shellRevision(first, "/catches"), shellRevision(first, "/~offline"));
  assert.equal(shellRevision(first, "/catches"), shellRevision(second, "/catches"));
  assert.ok(first.some((entry) => entry.url.endsWith("catches-v1.js")));
});

test("refreshes both documents when source-only HTML changes", async (t) => {
  const directory = fixture(t);
  const before = await manifest(directory);
  writeFileSync(join(directory, "src/app/layout.tsx"), "export default function Layout() { return 'updated HTML'; }");
  const after = await manifest(directory);
  for (const url of ["/~offline", "/catches"]) {
    assert.notEqual(shellRevision(before, url), shellRevision(after, url));
  }
});

test("refreshes both documents when a release replaces a referenced chunk", async (t) => {
  const directory = fixture(t);
  const before = await manifest(directory);
  renameSync(
    join(directory, ".next/static/chunks/catches-v1.js"),
    join(directory, ".next/static/chunks/catches-v2.js"),
  );
  const after = await manifest(directory);
  assert.ok(!after.some((entry) => entry.url.endsWith("catches-v1.js")));
  for (const url of ["/~offline", "/catches"]) {
    assert.notEqual(shellRevision(before, url), shellRevision(after, url));
  }
});

test("does not precache source, environment files, or private research/storage files", async (t) => {
  const entries = await manifest(fixture(t));
  assert.deepEqual(entries.map((entry) => entry.url).sort(), [
    ".next/static/chunks/catches-v1.js",
    "/catches",
    "/~offline",
    "public/icons/test.svg",
  ]);
});

test("keeps document revisions independent of glob enumeration order", async (t) => {
  const directory = fixture(t);
  const entries = await manifest(directory);
  const transform = offlinePrecacheOptions.manifestTransforms[0];
  const withSizes = entries.map((entry) => ({ ...entry, size: 0 }));
  const forward = await transform(withSizes);
  const backward = await transform([...withSizes].reverse());
  assert.equal(shellRevision(forward.manifest, "/catches"), shellRevision(backward.manifest, "/catches"));
});
