import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const inputPath = path.join(root, "data/research/philippines/raw/national/obis-ph-actinopterygii-calabarzon-rights-shortlist-v1.jsonl");
const triagePath = path.join(root, "data/research/philippines/national/reviews/obis-ph-actinopterygii-calabarzon-triage-20261107.json");
const metadataEndpoint = "https://www.geoboundaries.org/api/current/gbOpen/PHL/ADM2/";
const pinnedBoundaryId = "PHL-ADM2-2640588";
const pinnedCommit = "41af8f1";
const pinnedGeoJsonUrl = `https://github.com/wmgeolab/geoBoundaries/raw/${pinnedCommit}/releaseData/gbOpen/PHL/ADM2/geoBoundaries-PHL-ADM2_simplified.geojson`;
const rawDirectory = path.join(root, "data/research/philippines/raw/national/geoboundaries-phl-adm2-2020");
const geometryPath = path.join(rawDirectory, "geoBoundaries-PHL-ADM2_simplified-41af8f1.geojson");
const metadataPath = path.join(rawDirectory, "metadata.json");
const localReviewQueuePath = path.join(root, "data/research/philippines/raw/national/obis-cas-calabarzon-boundary-review-queue-v1.jsonl");
const runDate = new Date().toISOString().slice(0, 10);
const runDateCompact = runDate.replaceAll("-", "");
const outputPath = path.join(root, `data/research/philippines/national/reviews/obis-cas-ich-calabarzon-geoboundaries-${runDateCompact}.json`);
const refresh = process.argv.includes("--refresh");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const normalize = (value) => String(value ?? "").trim().normalize("NFKC").toLocaleLowerCase("en");
const hasValue = (value) => value !== null && value !== undefined && String(value).trim() !== "";
const isNumeric = (value) => hasValue(value) && Number.isFinite(Number(value));

function pointOnSegment(point, first, second) {
  const cross = (point[0] - first[0]) * (second[1] - first[1])
    - (point[1] - first[1]) * (second[0] - first[0]);
  if (Math.abs(cross) > 1e-10) return false;
  return point[0] >= Math.min(first[0], second[0]) - 1e-10
    && point[0] <= Math.max(first[0], second[0]) + 1e-10
    && point[1] >= Math.min(first[1], second[1]) - 1e-10
    && point[1] <= Math.max(first[1], second[1]) + 1e-10;
}

function pointInRing(point, ring) {
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index, index += 1) {
    const first = ring[previous];
    const second = ring[index];
    if (pointOnSegment(point, first, second)) return true;
    const crosses = (first[1] > point[1]) !== (second[1] > point[1]);
    if (crosses && point[0] < ((second[0] - first[0]) * (point[1] - first[1])) / (second[1] - first[1]) + first[0]) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInPolygon(point, rings) {
  if (!Array.isArray(rings) || rings.length === 0 || !pointInRing(point, rings[0])) return false;
  return !rings.slice(1).some((hole) => pointInRing(point, hole));
}

function pointInGeometry(point, geometry) {
  if (geometry?.type === "Polygon") return pointInPolygon(point, geometry.coordinates);
  if (geometry?.type === "MultiPolygon") return geometry.coordinates.some((polygon) => pointInPolygon(point, polygon));
  return false;
}

function geometryRings(geometry) {
  if (geometry?.type === "Polygon") return geometry.coordinates;
  if (geometry?.type === "MultiPolygon") return geometry.coordinates.flat();
  return [];
}

function distanceToGeometryBoundaryMeters(point, geometry) {
  const latitudeRadians = (point[1] * Math.PI) / 180;
  const metersPerDegreeLongitude = 111320 * Math.cos(latitudeRadians);
  const metersPerDegreeLatitude = 111320;
  let minimumDistance = Number.POSITIVE_INFINITY;
  for (const ring of geometryRings(geometry)) {
    for (let index = 0; index + 1 < ring.length; index += 1) {
      const first = [
        (ring[index][0] - point[0]) * metersPerDegreeLongitude,
        (ring[index][1] - point[1]) * metersPerDegreeLatitude,
      ];
      const second = [
        (ring[index + 1][0] - point[0]) * metersPerDegreeLongitude,
        (ring[index + 1][1] - point[1]) * metersPerDegreeLatitude,
      ];
      const dx = second[0] - first[0];
      const dy = second[1] - first[1];
      const segmentLengthSquared = dx * dx + dy * dy;
      const projection = segmentLengthSquared === 0
        ? 0
        : Math.max(0, Math.min(1, -(first[0] * dx + first[1] * dy) / segmentLengthSquared));
      const closestX = first[0] + projection * dx;
      const closestY = first[1] + projection * dy;
      minimumDistance = Math.min(minimumDistance, Math.hypot(closestX, closestY));
    }
  }
  return minimumDistance;
}

function countBy(rows, selector) {
  const counts = {};
  for (const row of rows) {
    const value = selector(row);
    const key = hasValue(value) ? String(value).trim() : "MISSING";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)));
}

function hasRestrictedOutputKey(value) {
  const restrictedKeys = new Set([
    "decimalLatitude", "decimalLongitude", "locality", "verbatimLocality", "occurrenceID",
    "catalogNumber", "recordedBy", "identifiedBy", "datasetContact",
  ]);
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(([key, nested]) => restrictedKeys.has(key)
    || hasRestrictedOutputKey(nested));
}

async function writeFileAtomically(filePath, bytes) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  await writeFile(temporaryPath, bytes);
  await rename(temporaryPath, filePath);
}

async function writeJson(filePath, value) {
  await writeFileAtomically(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function getMetadata() {
  const response = await fetch(metadataEndpoint, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`geoBoundaries metadata request failed with HTTP ${response.status}`);
  const metadata = await response.json();
  if (metadata.boundaryID !== pinnedBoundaryId
    || metadata.boundaryISO !== "PHL"
    || metadata.boundaryType !== "ADM2"
    || metadata.boundaryCanonical !== "Provinces"
    || metadata.boundaryYearRepresented !== "2020"
    || metadata.boundaryLicense !== "Creative Commons Attribution 3.0 Intergovernmental Organisations (CC BY 3.0 IGO)"
    || !metadata.simplifiedGeometryGeoJSON?.includes(`/${pinnedCommit}/`)) {
    throw new Error("Current geoBoundaries metadata no longer matches the reviewed pinned source; stop and re-review the source version/license");
  }
  return metadata;
}

async function getGeometry(metadata) {
  await mkdir(rawDirectory, { recursive: true });
  const existingGeometry = !refresh ? await readFile(geometryPath).catch(() => null) : null;
  const geometryBytes = existingGeometry ?? Buffer.from(await fetch(metadata.simplifiedGeometryGeoJSON, {
    headers: { accept: "application/geo+json, application/json" },
    signal: AbortSignal.timeout(90000),
  }).then(async (response) => {
    if (!response.ok) throw new Error(`geoBoundaries simplified geometry download failed with HTTP ${response.status}`);
    return response.arrayBuffer();
  }));
  if (!existingGeometry) await writeFileAtomically(geometryPath, geometryBytes);
  await writeJson(metadataPath, metadata);
  return { geometryBytes, reusedLocalFile: Boolean(existingGeometry) };
}

async function main() {
  const [triage, inputBytes, metadata] = await Promise.all([
    readFile(triagePath, "utf8").then(JSON.parse),
    readFile(inputPath),
    getMetadata(),
  ]);
  const expectedPartition = triage.privateCandidatePartition;
  if (hash(inputBytes) !== expectedPartition.sha256 || inputBytes.byteLength !== expectedPartition.bytes) {
    throw new Error("CAS candidate partition does not match its hash-checked triage receipt");
  }
  const wrappedRows = inputBytes.toString("utf8").trimEnd().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  const rows = wrappedRows.map((wrapper) => wrapper.sourceRecord);
  if (rows.length !== expectedPartition.rows) throw new Error("CAS candidate row count changed after triage");

  const geometryFile = await getGeometry(metadata);
  const geometryHash = hash(geometryFile.geometryBytes);
  if (geometryFile.reusedLocalFile) {
    const previousReview = await readFile(outputPath, "utf8").then(JSON.parse).catch(() => null);
    const previousHash = previousReview?.boundarySource?.geometrySha256;
    if (previousHash && previousHash !== geometryHash) {
      throw new Error("Cached simplified boundary hash differs from the prior reviewed source receipt");
    }
  }
  const geometry = JSON.parse(geometryFile.geometryBytes.toString("utf8"));
  if (geometry.type !== "FeatureCollection" || !Array.isArray(geometry.features)) {
    throw new Error("geoBoundaries download is not a GeoJSON FeatureCollection");
  }
  const features = geometry.features.map((feature) => {
    const properties = feature.properties ?? {};
    const name = properties.shapeName ?? properties.shapeNameEn ?? properties.NAME_1 ?? properties.name;
    if (!hasValue(name)) throw new Error("A geoBoundaries feature is missing a recognized province-name property");
    if (!["Polygon", "MultiPolygon"].includes(feature.geometry?.type)) {
      throw new Error("A geoBoundaries feature has an unsupported geometry type");
    }
    return { name: String(name).trim(), geometry: feature.geometry };
  });
  const featureByNormalizedName = new Map(features.map((feature) => [normalize(feature.name), feature]));
  if (features.length !== Number(metadata.admUnitCount)) {
    throw new Error(`Boundary feature count changed: ${features.length}/${metadata.admUnitCount}`);
  }

  const provinceStatuses = {};
  let matchedReportedProvinceRows = 0;
  let insideDifferentProvinceRows = 0;
  let outsideEveryLandPolygonRows = 0;
  let multipleProvincePolygonRows = 0;
  let insideDifferentProvinceWithUncertaintyRows = 0;
  let insideDifferentProvinceWithoutUncertaintyRows = 0;
  let uncertaintyCircleCanReachReportedProvinceRows = 0;
  let uncertaintyCircleCannotReachReportedProvinceRows = 0;
  let rowsWithValidCoordinate = 0;
  const localReviewQueue = [];
  for (const row of rows) {
    if (!isNumeric(row.decimalLongitude) || !isNumeric(row.decimalLatitude)) continue;
    rowsWithValidCoordinate += 1;
    const point = [Number(row.decimalLongitude), Number(row.decimalLatitude)];
    const matches = features.filter((feature) => pointInGeometry(point, feature.geometry));
    const reportedName = normalize(row.stateProvince);
    const match = matches.find((feature) => normalize(feature.name) === reportedName);
    let status;
    let distanceToReportedProvinceBoundaryMeters = null;
    if (matches.length === 0) {
      status = "outside-all-land-polygons";
      outsideEveryLandPolygonRows += 1;
    } else if (matches.length > 1) {
      status = match ? "reported-province-and-overlap" : "multiple-other-polygons";
      multipleProvincePolygonRows += 1;
      if (match) matchedReportedProvinceRows += 1;
      else insideDifferentProvinceRows += 1;
    } else if (match) {
      status = "inside-reported-province";
      matchedReportedProvinceRows += 1;
    } else {
      status = "inside-different-province";
      insideDifferentProvinceRows += 1;
      const reportedFeature = featureByNormalizedName.get(reportedName);
      if (isNumeric(row.coordinateUncertaintyInMeters)) {
        insideDifferentProvinceWithUncertaintyRows += 1;
        if (reportedFeature) {
          distanceToReportedProvinceBoundaryMeters = distanceToGeometryBoundaryMeters(point, reportedFeature.geometry);
          if (Number(row.coordinateUncertaintyInMeters) >= distanceToReportedProvinceBoundaryMeters) uncertaintyCircleCanReachReportedProvinceRows += 1;
          else uncertaintyCircleCannotReachReportedProvinceRows += 1;
        }
      } else {
        insideDifferentProvinceWithoutUncertaintyRows += 1;
      }
    }
    const province = String(row.stateProvince ?? "MISSING").trim() || "MISSING";
    provinceStatuses[province] ??= {};
    provinceStatuses[province][status] = (provinceStatuses[province][status] ?? 0) + 1;
    if (status === "inside-different-province") {
      localReviewQueue.push({
        occurrenceID: row.occurrenceID,
        scientificName: row.scientificName,
        originalScientificName: row.originalScientificName,
        aphiaID: row.aphiaID,
        taxonRank: row.taxonRank,
        stateProvince: row.stateProvince,
        locality: row.locality,
        higherGeography: row.higherGeography,
        waterBody: row.waterBody,
        eventDate: row.eventDate,
        basisOfRecord: row.basisOfRecord,
        decimalLatitude: row.decimalLatitude,
        decimalLongitude: row.decimalLongitude,
        coordinateUncertaintyInMeters: row.coordinateUncertaintyInMeters,
        pointInsideAdministrativeUnitNames: matches.map((feature) => feature.name),
        reportedProvinceBoundaryDistanceMeters: Number.isFinite(distanceToReportedProvinceBoundaryMeters)
          ? Math.round(distanceToReportedProvinceBoundaryMeters)
          : null,
        uncertaintyRadiusCanReachReportedProvinceBoundary: Number.isFinite(distanceToReportedProvinceBoundaryMeters)
          && isNumeric(row.coordinateUncertaintyInMeters)
          ? Number(row.coordinateUncertaintyInMeters) >= distanceToReportedProvinceBoundaryMeters
          : null,
        disposition: "local-manual-review-only; not an automatic exclusion or publication decision",
      });
    }
  }

  const localReviewQueueBytes = Buffer.from(localReviewQueue.map((row) => JSON.stringify(row)).join("\n")
    + (localReviewQueue.length > 0 ? "\n" : ""));
  await writeFileAtomically(localReviewQueuePath, localReviewQueueBytes);

  const artifact = {
    schemaVersion: 1,
    reviewId: `obis-cas-ich-calabarzon-geoboundaries-${runDateCompact}`,
    generatedOn: runDate,
    status: "coarse-boundary-crosscheck-complete; regional-and-waterbody-validation-pending",
    boundarySource: {
      provider: "geoBoundaries gbOpen",
      apiMetadataUrl: metadataEndpoint,
      boundaryID: metadata.boundaryID,
      countryCode: metadata.boundaryISO,
      administrativeLevel: metadata.boundaryType,
      canonicalLevelName: metadata.boundaryCanonical,
      representedYear: metadata.boundaryYearRepresented,
      sourceAgencies: metadata.boundarySource,
      sourceDataUpdateDate: metadata.sourceDataUpdateDate,
      geoBoundariesBuildDate: metadata.buildDate,
      boundaryLicense: metadata.boundaryLicense,
      licenseSourceUrl: metadata.licenseSource,
      geometryUrl: metadata.simplifiedGeometryGeoJSON,
      geometryUrlPinnedCommit: pinnedCommit,
      featureCount: features.length,
      featureNameProperty: Object.keys(geometry.features[0]?.properties ?? {}).find((key) => key === "shapeName") ?? "shapeName",
      simplifiedGeometry: true,
      geometryBytes: geometryFile.geometryBytes.byteLength,
      geometrySha256: geometryHash,
      geometryLocalPath: path.relative(root, geometryPath).replaceAll("\\", "/"),
      geometryGitIgnored: true,
      geometryReusedFromLocalCache: geometryFile.reusedLocalFile,
      attribution: "geoBoundaries (2023), PHL ADM2, based on NAMRIA, Philippines Statistics Authority, and OCHA Philippines; CC BY 3.0 IGO.",
    },
    sourceOccurrences: {
      datasetId: "d6af0fac-8a21-4d77-8872-f10d471fc0cf",
      datasetVersion: "150.547",
      candidateRows: rows.length,
      candidatePartitionSha256: expectedPartition.sha256,
      provinceTextCounts: triage.rightsShortlist[0].matchedProvinceTextCounts,
      localBoundaryReviewQueue: {
        path: path.relative(root, localReviewQueuePath).replaceAll("\\", "/"),
        rows: localReviewQueue.length,
        bytes: localReviewQueueBytes.byteLength,
        sha256: hash(localReviewQueueBytes),
        gitIgnored: true,
        appBundleIncluded: false,
        personalObserverOrDeterminerFieldsIncluded: false,
      },
    },
    spatialMethod: {
      algorithm: "point-in-polygon against simplified WGS 84 GeoJSON province polygons; polygon edges count as inside",
      use: "coarse consistency screen only; not a validated regional or marine-water assignment",
      uncertaintyUsedForAssignment: false,
      outsideLandPolygonInterpretation: "can reflect a valid coastal/marine specimen coordinate and is not by itself a locality error",
      boundaryYearLimit: "2020 boundaries, source data integrated 2023; not a current legal or municipal-water boundary",
    },
    results: {
      rowsWithValidCoordinate,
      insideReportedProvinceRows: matchedReportedProvinceRows,
      insideDifferentProvinceRows,
      insideDifferentProvinceWithCoordinateUncertaintyRows: insideDifferentProvinceWithUncertaintyRows,
      insideDifferentProvinceWithoutCoordinateUncertaintyRows: insideDifferentProvinceWithoutUncertaintyRows,
      uncertaintyRadiusReachesReportedProvinceBoundaryRows: uncertaintyCircleCanReachReportedProvinceRows,
      uncertaintyRadiusDoesNotReachReportedProvinceBoundaryRows: uncertaintyCircleCannotReachReportedProvinceRows,
      outsideEveryLandPolygonRows,
      multipleProvincePolygonRows,
      statusCountsByReportedProvince: provinceStatuses,
      admittedRows: 0,
    },
    limitations: [
      "This check compares source province text with a point in a simplified 2020 land-administration polygon; it does not establish which municipality or waterbody a marine record belongs to.",
      "Coastal and offshore points can be outside every land polygon without being erroneous. Coordinate-uncertainty radii were compared with approximate planar distance to the reported province boundary only for a review hint, not used to reassign any point.",
      "Potential province mismatches remain a local manual review queue and are not automatic exclusions.",
      "The simplified geometry is used only for screening; any future map or legal use needs a current, source-authorized geometry and exact-version review.",
    ],
    privacy: {
      exactCoordinatesIncluded: false,
      localityStringsIncluded: false,
      occurrenceIdentifiersIncluded: false,
      perRecordProvinceAssignmentsIncluded: false,
    },
  };
  if (hasRestrictedOutputKey(artifact)) {
    throw new Error("Tracked boundary report contains a restricted occurrence-level field");
  }
  await writeJson(outputPath, artifact);
  console.log(`Boundary features: ${features.length}; source rows checked: ${rowsWithValidCoordinate}`);
  console.log(`Inside reported province: ${matchedReportedProvinceRows}; in other polygon: ${insideDifferentProvinceRows}; outside land: ${outsideEveryLandPolygonRows}; admitted: 0`);
  console.log(`Wrote ${path.relative(root, outputPath).replaceAll("\\", "/")}; raw geometry remains Git-ignored.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
