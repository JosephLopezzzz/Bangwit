import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "data/research/alternatives/cavite");
const catalogBytes = await readFile(path.join(output, "sources.json"));
const catalog = JSON.parse(catalogBytes);
const raw = path.join(output, "raw");
await mkdir(raw, { recursive: true });
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const requested = new Set(process.argv.slice(2));
for (const id of requested) {
  if (!catalog.sources.some((source) => source.id === id)) throw new Error(`Unknown source: ${id}`);
}
let previousManifest = null;
try {
  previousManifest = JSON.parse(await readFile(path.join(output, "download-manifest.json"), "utf8"));
} catch {}
const results = requested.size
  ? (previousManifest?.sources ?? []).filter((source) => !requested.has(source.sourceId)
      && !(requested.has("geoboundaries-phl-adm2") && source.sourceId.startsWith("geoboundaries-phl-adm2"))
      && !(requested.has("geoboundaries-phl-adm2") && source.sourceId === "cavite-admin-derivation"))
  : [];

async function save(file, bytes) {
  await writeFile(`${file}.tmp`, bytes);
  await rename(`${file}.tmp`, file);
}

async function download(source) {
  const response = await fetch(source.url, {
    headers: { "user-agent": "Bangwit public-source research" },
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const maxBytes = 40 * 1024 * 1024;
  if (Number(response.headers.get("content-length")) > maxBytes) {
    throw new Error("Source exceeds the 40 MiB research-download limit");
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.byteLength;
    if (size > maxBytes) throw new Error("Source exceeds the 40 MiB research-download limit");
    chunks.push(chunk);
  }
  const bytes = Buffer.concat(chunks);
  if (!bytes.length) throw new Error("Empty source response");
  if (source.kind === "pdf" && bytes.subarray(0, 5).toString() !== "%PDF-") {
    throw new Error("Response is not a PDF (possibly an HTML error page)");
  }
  if (source.kind === "json") JSON.parse(bytes.toString("utf8"));
  if (source.kind === "html" && !/<html[\s>]/i.test(bytes.toString("utf8"))) {
    throw new Error("Response is not an HTML document");
  }
  await save(path.join(raw, source.file), bytes);
  const entry = {
    sourceId: source.id,
    url: source.url,
    resolvedUrl: response.url,
    file: `raw/${source.file}`,
    status: "downloaded",
    retrievedAtUtc: new Date().toISOString(),
    contentType: response.headers.get("content-type"),
    serverLastModified: response.headers.get("last-modified"),
    bytes: bytes.length,
    sha256: sha256(bytes),
    interpretation: "File retrieval verified; source accuracy, legal applicability and advisory currentness are separate checks.",
  };
  results.push(entry);
  console.log(`Downloaded: ${source.id} (${bytes.length} bytes)`);
  return { bytes, entry };
}

async function acquire(source) {
  try {
    return await download(source);
  } catch (error) {
    let priorSnapshot = null;
    try {
      const prior = await readFile(path.join(raw, source.file));
      priorSnapshot = { bytes: prior.length, sha256: sha256(prior) };
    } catch {}
    const detail = error.cause?.code ? `${error.message} (${error.cause.code})` : error.message;
    results.push({
      sourceId: source.id,
      url: source.url,
      file: `raw/${source.file}`,
      status: "retrieval_failed",
      attemptedAtUtc: new Date().toISOString(),
      error: detail,
      priorSnapshotRetained: priorSnapshot,
    });
    console.error(`Failed: ${source.id}: ${detail}`);
    return null;
  }
}

// These are independent document/metadata requests, not parallel occurrence downloads.
const snapshots = await Promise.all(catalog.sources.map((source) =>
  !requested.size || requested.has(source.id) ? acquire(source) : null));
const boundaryIndex = catalog.sources.findIndex((source) => source.id === "geoboundaries-phl-adm2");
let derived = requested.size && !requested.has("geoboundaries-phl-adm2") ? previousManifest?.derived ?? null : null;
if (snapshots[boundaryIndex]) {
  try {
    const metadata = JSON.parse(snapshots[boundaryIndex].bytes.toString("utf8"));
    if (metadata.boundaryISO !== "PHL" || metadata.boundaryCanonical !== "Provinces") {
      throw new Error("Administrative layer is not Philippine provinces");
    }
    const geometryUrl = new URL(metadata.simplifiedGeometryGeoJSON);
    if (geometryUrl.protocol !== "https:" || geometryUrl.hostname !== "github.com") {
      throw new Error("Unexpected geometry download host; review source metadata first");
    }
    const source = {
      id: "geoboundaries-phl-adm2-simplified",
      url: geometryUrl.href,
      file: "geoboundaries-phl-adm2-simplified.geojson",
      kind: "json",
    };
    const snapshot = await acquire(source);
    if (snapshot) {
      const collection = JSON.parse(snapshot.bytes.toString("utf8"));
      if (collection.type !== "FeatureCollection") throw new Error("Expected a GeoJSON FeatureCollection");
      const matches = collection.features.filter((feature) => feature.properties?.shapeName === "Cavite");
      if (matches.length !== 1) throw new Error(`Expected one Cavite feature; received ${matches.length}`);
      const feature = matches[0];
      if (!["Polygon", "MultiPolygon"].includes(feature.geometry?.type)) {
        throw new Error("Cavite feature is not a polygon");
      }
      const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
      const bbox = [Infinity, Infinity, -Infinity, -Infinity];
      let vertices = 0;
      if (!polygons.length) throw new Error("Empty polygon geometry");
      for (const polygon of polygons) {
        if (!polygon.length) throw new Error("Empty polygon rings");
        for (const ring of polygon) {
          if (ring.length < 4 || JSON.stringify(ring[0]) !== JSON.stringify(ring.at(-1))) {
            throw new Error("Invalid or unclosed polygon ring");
          }
          for (const position of ring) {
            const [lon, lat] = position;
            if (!Number.isFinite(lon) || !Number.isFinite(lat) || Math.abs(lon) > 180 || Math.abs(lat) > 90) {
              throw new Error("Invalid longitude/latitude");
            }
            bbox[0] = Math.min(bbox[0], lon);
            bbox[1] = Math.min(bbox[1], lat);
            bbox[2] = Math.max(bbox[2], lon);
            bbox[3] = Math.max(bbox[3], lat);
            vertices += 1;
          }
        }
      }
      if (bbox[0] < 120 || bbox[2] > 122 || bbox[1] < 13 || bbox[3] > 15) {
        throw new Error("Cavite coordinates are outside the regional sanity-check range");
      }
      const file = "cavite-discovery-admin-outline.geojson";
      const artifact = {
        type: "FeatureCollection",
        bbox,
        provenance: {
          sourceUrl: source.url,
          sourceSha256: snapshot.entry.sha256,
          boundaryID: metadata.boundaryID,
          yearRepresented: metadata.boundaryYearRepresented,
          boundarySource: metadata.boundarySource,
          originalSourceLicense: metadata.boundaryLicense,
          geoBoundariesReleaseTerms: "gbOpen; attribution required",
          coordinateConvention: "GeoJSON WGS84 longitude, latitude (RFC7946)",
          geometryProcessing: "Cavite feature extracted unchanged from the provider's simplified layer",
          purpose: "Dated approximate administrative discovery outline",
          legalMunicipalWaterBoundary: false,
          preciseOccurrenceLocalityValidation: false,
          navigationUse: false,
        },
        features: [feature],
      };
      const bytes = Buffer.from(`${JSON.stringify(artifact, null, 2)}\n`);
      await save(path.join(output, file), bytes);
      derived = { file, sha256: sha256(bytes), vertices, bbox, validation: "Closed rings, finite coordinate ranges, single matching Cavite feature and regional extent checks passed. This collector does not perform independent topology validation; compare any separate review against this artifact hash." };
      console.log(`Derived: ${file} (${vertices} vertices)`);
    }
  } catch (error) {
    results.push({ sourceId: "cavite-admin-derivation", status: "derivation_failed", error: error.message });
    console.error(`Geometry derivation failed: ${error.message}`);
  }
}

const manifest = {
  reviewDate: catalog.reviewedOn,
  generatedAtUtc: new Date().toISOString(),
  catalogSha256: sha256(catalogBytes),
  rawFilesTrackedInGit: false,
  sources: results,
  derived,
};
await save(path.join(output, "download-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
const failed = results.filter((result) => result.status.endsWith("failed"));
console.log(`Completed: ${results.length - failed.length} source downloads; ${failed.length} failures.`);
if (failed.length) process.exitCode = 1;
