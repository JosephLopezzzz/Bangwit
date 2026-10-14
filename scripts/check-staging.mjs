import assert from "node:assert/strict";

// Read-only hosting checks. This never opens or changes a catch journal.
async function main() {
  assert.ok(process.argv[2], "Usage: npm run check:staging -- https://your-staging-host");
  const origin = new URL(process.argv[2]);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
  assert.ok(
    origin.protocol === "https:" || (local && origin.protocol === "http:"),
    "Use HTTPS, or HTTP loopback for local verification.",
  );
  assert.ok(
    !origin.username && !origin.password && !origin.search && !origin.hash,
    "Use an origin URL without credentials, query parameters or fragments.",
  );
  assert.equal(origin.pathname, "/", "Use the site origin without a path.");

  async function read(path, type) {
    const response = await fetch(new URL(path, origin), {
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    assert.equal(
      response.status,
      200,
      `${path}: expected 200; received ${response.status}. Protected previews may require a signed-in browser.`,
    );
    assert.ok(response.headers.get("content-type")?.includes(type), `${path}: expected ${type}.`);
    return response;
  }

  const [journal, fallback, manifestResponse, worker] = await Promise.all([
    read("/catches", "text/html"),
    read("/~offline", "text/html"),
    read("/manifest.webmanifest", "application/manifest+json"),
    read("/serwist/sw.js", "javascript"),
  ]);

  assert.ok((await journal.text()).includes("Bangwit"), "Journal response does not contain the Bangwit app.");
  assert.ok((await fallback.text()).includes('href="/catches"'), "Offline fallback must link directly to the journal.");
  assert.equal(
    worker.headers.get("service-worker-allowed"),
    "/",
    "Service worker must be allowed to control the root scope.",
  );
  assert.ok(
    /\bno-cache\b/.test(worker.headers.get("cache-control") ?? ""),
    "Service-worker updates must revalidate instead of using a stale HTTP cache.",
  );
  const workerText = await worker.text();
  for (const path of ["/catches", "/~offline"]) {
    assert.ok(workerText.includes(path), `Worker does not reference ${path}.`);
  }

  const manifest = await manifestResponse.json();
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.display, "standalone");
  assert.ok(
    manifest.icons?.some((icon) => icon.purpose === "maskable"),
    "Manifest needs a maskable icon.",
  );
  for (const icon of manifest.icons) {
    assert.equal(new URL(icon.src, origin).origin, origin.origin, "Manifest icons must use this app's origin.");
    const response = await read(icon.src, "image/png");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.ok(
      bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
      `${icon.src}: invalid PNG.`,
    );
    assert.equal(
      `${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`,
      icon.sizes,
      `${icon.src}: icon dimensions do not match the manifest.`,
    );
  }

  console.log(
    "Hosting checks passed: journal, fallback, worker scope/update headers and document references, manifest and icon dimensions.",
  );
  console.log("Physical-phone offline, reconnect and installed-app acceptance remain separate checks.");
}

main().catch((error) => {
  console.error(`Hosting check failed: ${error.message}`);
  process.exitCode = 1;
});
