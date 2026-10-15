import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const input = new URL("../data/research/alternatives/cavite/raw/geoboundaries-phl-adm2-simplified.geojson", import.meta.url);
const provinceOutput = new URL("../src/data/phl-provinces.ts", import.meta.url);
const pathOutput = new URL("../src/data/phl-province-paths.ts", import.meta.url);
const provenanceOutput = new URL("../data/research/alternatives/cavite/philippine-province-map-provenance.json", import.meta.url);
const expectedSourceHash = "fa77b9f17db2e419acaae714a935f7812be4409e2983675d34020e8426a3e189";
const viewBox = { width: 600, height: 1000, padding: 26 };
const simplificationTolerance = 0.65;

const sourceText = await readFile(input, "utf8");
const sourceHash = createHash("sha256").update(sourceText).digest("hex");
if (sourceHash !== expectedSourceHash) {
  throw new Error(`Unexpected boundary source hash: ${sourceHash}`);
}

const source = JSON.parse(sourceText);
const excludedNames = new Set(["City of Isabela", "Cotabato City"]);
const features = source.features.filter(
  ({ properties }) => !properties.shapeName.startsWith("NCR,") && !excludedNames.has(properties.shapeName),
);
if (source.features.length !== 87 || features.length !== 81) {
  throw new Error(`Expected 87 source features and 81 province outline features; got ${source.features.length} and ${features.length}.`);
}

const positions = [];
function collectCoordinates(value) {
  if (typeof value[0] === "number" && typeof value[1] === "number") {
    positions.push(value);
    return;
  }
  for (const child of value) collectCoordinates(child);
}
for (const feature of features) collectCoordinates(feature.geometry.coordinates);

const longitudes = positions.map(([longitude]) => longitude);
const latitudes = positions.map(([, latitude]) => latitude);
const minLongitude = Math.min(...longitudes);
const maxLongitude = Math.max(...longitudes);
const minLatitude = Math.min(...latitudes);
const maxLatitude = Math.max(...latitudes);
const longitudeScale = Math.cos((((minLatitude + maxLatitude) / 2) * Math.PI) / 180);
const geographicWidth = (maxLongitude - minLongitude) * longitudeScale;
const geographicHeight = maxLatitude - minLatitude;
const scale = Math.min(
  (viewBox.width - viewBox.padding * 2) / geographicWidth,
  (viewBox.height - viewBox.padding * 2) / geographicHeight,
);
const renderedWidth = geographicWidth * scale;
const renderedHeight = geographicHeight * scale;
const offsetX = (viewBox.width - renderedWidth) / 2;
const offsetY = (viewBox.height - renderedHeight) / 2;

function project([longitude, latitude]) {
  return [
    offsetX + (longitude - minLongitude) * longitudeScale * scale,
    offsetY + (maxLatitude - latitude) * scale,
  ];
}

function distanceFromSegment(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const ratio = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point[0] - start[0] - ratio * dx, point[1] - start[1] - ratio * dy);
}

function simplifyOpenLine(points, tolerance) {
  if (points.length <= 2) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const pending = [[0, points.length - 1]];
  while (pending.length) {
    const [startIndex, endIndex] = pending.pop();
    let maxDistance = tolerance;
    let maxIndex = -1;
    for (let index = startIndex + 1; index < endIndex; index += 1) {
      const distance = distanceFromSegment(points[index], points[startIndex], points[endIndex]);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = index;
      }
    }
    if (maxIndex === -1) continue;
    keep[maxIndex] = 1;
    pending.push([startIndex, maxIndex], [maxIndex, endIndex]);
  }
  return points.filter((_, index) => keep[index] === 1);
}

function simplifyClosedRing(ring) {
  const sourcePoints = ring.map(project);
  const points = sourcePoints.length > 3 && ring[0][0] === ring.at(-1)[0] && ring[0][1] === ring.at(-1)[1]
    ? sourcePoints.slice(0, -1)
    : sourcePoints;
  if (points.length <= 8) return points;

  let splitAt = 1;
  let farthest = 0;
  for (let index = 1; index < points.length; index += 1) {
    const distance = Math.hypot(points[index][0] - points[0][0], points[index][1] - points[0][1]);
    if (distance > farthest) {
      farthest = distance;
      splitAt = index;
    }
  }

  const forward = [...points.slice(0, splitAt + 1)];
  const backward = [...points.slice(splitAt), ...points.slice(0, 1)];
  const simplifiedForward = simplifyOpenLine(forward, simplificationTolerance);
  const simplifiedBackward = simplifyOpenLine(backward, simplificationTolerance);
  const simplified = [...simplifiedForward.slice(0, -1), ...simplifiedBackward.slice(0, -1)];
  return simplified.length >= 4 ? simplified : points;
}

function makeRingPath(ring) {
  return `${simplifyClosedRing(ring)
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${Math.round(x)},${Math.round(y)}`)
    .join("")}Z`;
}

function makeGeometryPath(geometry) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.map((polygon) => polygon.map(makeRingPath).join("")).join("");
}

function geometryCenter(geometry) {
  const points = [];
  collectCoordinatesForFeature(geometry.coordinates, points);
  const projected = points.map(project);
  const minX = Math.min(...projected.map(([x]) => x));
  const maxX = Math.max(...projected.map(([x]) => x));
  const minY = Math.min(...projected.map(([, y]) => y));
  const maxY = Math.max(...projected.map(([, y]) => y));
  return {
    center: { x: Number(((minX + maxX) / 2).toFixed(2)), y: Number(((minY + maxY) / 2).toFixed(2)) },
    bounds: {
      x: Number(minX.toFixed(2)),
      y: Number(minY.toFixed(2)),
      width: Number((maxX - minX).toFixed(2)),
      height: Number((maxY - minY).toFixed(2)),
    },
  };
}

function collectCoordinatesForFeature(value, points) {
  if (typeof value[0] === "number" && typeof value[1] === "number") {
    points.push(value);
    return;
  }
  for (const child of value) collectCoordinatesForFeature(child, points);
}

const seenIds = new Set();
const provinces = features
  .map(({ properties, geometry }) => {
    const id = properties.shapeID;
    if (seenIds.has(id)) throw new Error(`Duplicate geoBoundaries shape ID: ${id}`);
    seenIds.add(id);
    const name = properties.shapeName === "Compostela Valley" ? "Davao de Oro" : properties.shapeName;
    const { center, bounds } = geometryCenter(geometry);
    return {
      id,
      name,
      sourceName: properties.shapeName,
      center,
      bounds,
      path: makeGeometryPath(geometry),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, "en"));

const cavite = provinces.find((province) => province.sourceName === "Cavite");
if (!cavite) throw new Error("Cavite boundary is missing from the source data.");

const provinceModule = [
  "// Generated by scripts/build-philippine-province-map.mjs from the pinned 2020 geoBoundaries PHL ADM2 source.",
  "export const PHILIPPINE_PROVINCES = [",
  ...provinces.map(
    ({ id, name, sourceName, center, bounds }) =>
      `  { id: ${JSON.stringify(id)}, name: ${JSON.stringify(name)}, sourceName: ${JSON.stringify(sourceName)}, center: ${JSON.stringify(center)}, bounds: ${JSON.stringify(bounds)} },`,
  ),
  "] as const;",
  "",
  "export type ProvinceId = (typeof PHILIPPINE_PROVINCES)[number][\"id\"];",
  `export const CAVITE_PROVINCE_ID: ProvinceId = ${JSON.stringify(cavite.id)};`,
  `export const DEFAULT_PROVINCE_ID: ProvinceId = CAVITE_PROVINCE_ID;`,
  "",
].join("\n");

const pathsModule = [
  "// Generated by scripts/build-philippine-province-map.mjs from the pinned 2020 geoBoundaries PHL ADM2 source.",
  'import type { ProvinceId } from "./phl-provinces";',
  "",
  "export const PHILIPPINE_PROVINCE_PATHS: Record<ProvinceId, string> = {",
  ...provinces.map(({ id, path }) => `  ${JSON.stringify(id)}: ${JSON.stringify(path)},`),
  "};",
  "",
].join("\n");

const provenance = {
  boundaryId: "PHL-ADM2-2640588",
  sourceUrl:
    "https://github.com/wmgeolab/geoBoundaries/raw/41af8f1/releaseData/gbOpen/PHL/ADM2/geoBoundaries-PHL-ADM2_simplified.geojson",
  metadataUrl: "https://www.geoboundaries.org/api/current/gbOpen/PHL/ADM2/",
  pinnedCommit: "41af8f1",
  boundaryYearRepresented: 2020,
  sourceDataUpdateDate: "2023-01-19",
  buildDate: "2023-07-05",
  boundarySource: "National Mapping and Resource Information Authority (NAMRIA), Philippine Statistics Authority (PSA), OCHA Philippines",
  boundaryLicense: "Creative Commons Attribution 3.0 Intergovernmental Organisations (CC BY 3.0 IGO)",
  sourceFeatureCount: source.features.length,
  renderedProvinceOutlineCount: provinces.length,
  sourceSha256: sourceHash,
  simplificationToleranceInViewBoxUnits: simplificationTolerance,
  includedFeatureIds: provinces.map(({ id }) => id),
  excludedSourceFeatures: [
    { match: "shapeName starts with NCR,", count: 4, reason: "NCR districts are not provinces." },
    { match: "City of Isabela", count: 1, reason: "Independent city; not a province." },
    { match: "Cotabato City", count: 1, reason: "Independent city; not a province." },
  ],
  displayNameAliases: [{ sourceName: "Compostela Valley", displayName: "Davao de Oro", reason: "Current PSGC name." }],
  knownGeographyLimitations: [
    "The outline layer represents 2020 geography and must not be read as a current cadastral or legal boundary source.",
    "The source contains one combined Maguindanao outline; it does not distinguish the current Maguindanao del Norte and Maguindanao del Sur provinces.",
    "The PSA PSGC summary as of 30 September 2026 lists 82 provinces, while this 2020 source yields 81 province outline units after excluding NCR districts and independent cities.",
  ],
  currentPsgcReference: "https://psa.gov.ph/classification/psgc/summary",
  mapUse: "Visual province selection only. Cavite is the only pilot with existing waterbody choices; all other areas have no regional species or fisheries coverage in the app.",
};

await Promise.all([
  writeFile(provinceOutput, provinceModule, "utf8"),
  writeFile(pathOutput, pathsModule, "utf8"),
  writeFile(provenanceOutput, `${JSON.stringify(provenance, null, 2)}\n`, "utf8"),
]);

const totalPathCharacters = provinces.reduce((total, province) => total + province.path.length, 0);
console.log(`Generated ${provinces.length} province outlines from ${source.features.length} source features.`);
console.log(`Path data: ${totalPathCharacters.toLocaleString("en-US")} characters.`);
