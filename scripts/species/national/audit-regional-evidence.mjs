import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const researchRoot = "data/research/philippines";
const manifestPath = `${researchRoot}/luzon-completion-manifest.json`;
const sourcesPath = `${researchRoot}/sources.json`;
const reviewsRoot = `${researchRoot}/national/reviews`;
const outputPath = `${reviewsRoot}/luzon-evidence-index-20261124.json`;
const rawRoot = path.resolve(root, researchRoot, "raw");
const slash = (value) => value.replaceAll("\\", "/");

function repositoryPath(value) {
  return slash(path.relative(root, value));
}

function isGeneratedAuditIndex(value) {
  return /^luzon-evidence-index-\d{8}\.json$/.test(path.basename(value));
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"));
}

function hashFile(relativePath) {
  return createHash("sha256").update(readFileSync(path.join(root, relativePath))).digest("hex");
}

function resolveReference(raw, fromPath) {
  const cleaned = slash(raw.trim()).replace(/^\.\//, "");
  const candidates = path.isAbsolute(raw)
    ? [raw]
    : [
        path.resolve(root, cleaned),
        path.resolve(root, path.dirname(fromPath), cleaned),
        path.resolve(root, researchRoot, cleaned),
        path.resolve(root, reviewsRoot, path.basename(cleaned)),
      ];
  const match = candidates.find((candidate) => existsSync(candidate) && path.extname(candidate).toLowerCase() === ".json");
  return match ? repositoryPath(match) : null;
}

let rawFilePaths;
function listLocalRawFiles() {
  if (rawFilePaths) return rawFilePaths;
  rawFilePaths = [];
  function visit(directory) {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolutePath);
      else if (entry.isFile()) rawFilePaths.push(repositoryPath(absolutePath));
    }
  }
  visit(rawRoot);
  rawFilePaths.sort();
  return rawFilePaths;
}

function rawReferenceCandidates(reference) {
  const { from, field, referencedPath } = reference;
  const snapshotFile = field.match(/^\$\.rawSnapshot\.files\[(\d+)\]\.path$/);
  if (snapshotFile) {
    const snapshot = documents.get(from)?.value?.rawSnapshot;
    const file = snapshot?.files?.[Number(snapshotFile[1])];
    if (typeof snapshot?.directory !== "string") return [];
    const absolute = path.resolve(root, researchRoot, snapshot.directory, referencedPath);
    return [{ path: repositoryPath(absolute), expectedSha256: file?.sha256 ?? null }];
  }

  const rawResponsePath = field.endsWith(".rawResponse.path");
  if (rawResponsePath) {
    const parentPath = field.replace(/\.path$/, "");
    const segments = parentPath.replace(/^\$\.?/, "").replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
    const rawResponse = segments.reduce((value, segment) => value?.[segment], documents.get(from)?.value);
    const cleaned = slash(referencedPath.trim()).replace(/^\.\//, "");
    const absolute = cleaned.startsWith("data/")
      ? path.resolve(root, cleaned)
      : path.resolve(root, researchRoot, cleaned);
    return [{ path: repositoryPath(absolute), expectedSha256: rawResponse?.sha256 ?? null }];
  }

  const sourceReceipt = field.match(/^\$\.sources\[(\d+)\]\.access\.rawReceipts\[(\d+)\]\.file$/);
  if (from === sourcesPath && sourceReceipt) {
    const source = sourceRegistry.sources[Number(sourceReceipt[1])];
    const receipt = source?.access?.rawReceipts?.[Number(sourceReceipt[2])];
    const expected = receipt?.sha256;
    const explicit = source?.access?.rawPath
      ? path.resolve(root, researchRoot, source.access.rawPath, referencedPath)
      : null;
    if (explicit && existsSync(explicit)) return [{ path: repositoryPath(explicit), expectedSha256: expected ?? null }];
    const byName = listLocalRawFiles().filter((candidate) => path.basename(candidate) === path.basename(referencedPath));
    return byName.map((candidate) => ({ path: candidate, expectedSha256: expected ?? null }));
  }

  const pageResponse = field.match(/^\$\.gbif\.administrativeSearch\.pageResponses\[(\d+)\]\.file$/);
  if (pageResponse) {
    const page = documents.get(from)?.value?.gbif?.administrativeSearch?.pageResponses?.[Number(pageResponse[1])];
    const expectedSha256 = page?.sha256 ?? null;
    const byName = listLocalRawFiles().filter((candidate) => path.basename(candidate) === path.basename(referencedPath));
    return byName.map((candidate) => ({ path: candidate, expectedSha256 }));
  }

  if (/[*?]/.test(referencedPath)) {
    const absolutePattern = path.isAbsolute(referencedPath)
      ? slash(referencedPath)
      : referencedPath.startsWith("data/")
      ? slash(path.resolve(root, referencedPath))
      : slash(path.resolve(root, researchRoot, referencedPath));
    const expression = new RegExp(`^${absolutePattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replaceAll("*", "[^/]*").replaceAll("?", "[^/]")}$`);
    return listLocalRawFiles()
      .filter((candidate) => expression.test(slash(path.resolve(root, candidate))))
      .map((candidate) => ({ path: candidate, expectedSha256: null }));
  }

  const explicit = resolveReference(referencedPath, from);
  if (explicit?.includes("/raw/")) return [{ path: explicit, expectedSha256: null }];
  const basenameMatches = listLocalRawFiles().filter((candidate) => path.basename(candidate) === path.basename(referencedPath));
  return basenameMatches.map((candidate) => ({ path: candidate, expectedSha256: null }));
}

function collectJsonReferences(value, fromPath, keyPath = "$", rows = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectJsonReferences(entry, fromPath, `${keyPath}[${index}]`, rows));
  } else if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      collectJsonReferences(entry, fromPath, `${keyPath}.${key}`, rows);
    }
  } else if (
    typeof value === "string"
    && !/^https?:\/\//i.test(value)
    && !/\s/.test(value.trim())
    && (/\.json(?:$|#)/i.test(value.trim()) || keyPath.endsWith(".rawResponse.path"))
  ) {
    const raw = value.trim().replace(/#.*$/, "");
    const normalized = slash(raw);
    const localRaw = normalized.includes("/raw/")
      || normalized.startsWith("raw/")
      || keyPath.includes(".rawReceipts[")
      || keyPath.includes(".rawSnapshot.files[")
      || keyPath.includes(".pageResponses[")
      || keyPath.endsWith(".rawResponse.path");
    const isRawFileField = keyPath.endsWith(".rawFile");
    rows.push({ field: keyPath, raw, resolvedPath: resolveReference(raw, fromPath), localRaw: localRaw || isRawFileField });
  }
  return rows;
}

function sourceIdsIn(value, keyPath = "$", ids = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => sourceIdsIn(entry, `${keyPath}[${index}]`, ids));
  } else if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      if (["sourceId", "sourceIds", "sourceRefs"].includes(key)) {
        const values = Array.isArray(entry) ? entry : [entry];
        for (const id of values) if (typeof id === "string" && id.trim()) ids.add(id.trim());
      }
      if (["source", "sources"].includes(key)) {
        const values = Array.isArray(entry) ? entry : [entry];
        for (const source of values) {
          if (source && typeof source === "object" && typeof source.id === "string") ids.add(source.id);
        }
      }
      sourceIdsIn(entry, `${keyPath}.${key}`, ids);
    }
  }
  return [...ids].sort();
}

function explicitRegionIds(review, knownIds) {
  const values = [
    ...(Array.isArray(review.regionIds) ? review.regionIds : []),
    ...(typeof review.regionId === "string" ? [review.regionId] : []),
    ...(typeof review.regionScope?.regionId === "string" ? [review.regionScope.regionId] : []),
  ];
  return [...new Set(values.filter((id) => knownIds.has(id)))].sort();
}

const manifest = readJson(manifestPath);
const sourceRegistry = readJson(sourcesPath);
const sourceRegistryIds = new Set(sourceRegistry.sources.map((source) => source.id));
const regionById = new Map(manifest.regions.map((region) => [region.regionId, region]));
const reviewPaths = readdirSync(path.join(root, reviewsRoot))
  .filter((name) => name.endsWith(".json") && !isGeneratedAuditIndex(name))
  .map((name) => `${reviewsRoot}/${name}`)
  .sort();
const reviewPathSet = new Set(reviewPaths);
const documents = new Map();
const missingReferences = new Map();
const localRawReferences = new Map();
const inputPaths = new Set([manifestPath, sourcesPath, ...reviewPaths]);

const reviewedRegionalAssociations = new Map([
  ["region02-aparri-fyke-glass-eel-bycatch-source-review-20261110", ["0200000000", "The reviewed estuarine-fishery study is explicitly scoped to Aparri, Cagayan."]],
  ["region02-aparri-pterygoplichthys-sightings-review-20261111", ["0200000000", "The reviewed historical sighting is explicitly localized to Aparri, Cagayan."]],
  ["region02-aritao-bambang-river-biodiversity-source-review-20261111", ["0200000000", "The reviewed river assessment names the Aritao and Bambang rivers in Nueva Vizcaya."]],
  ["region02-bangalao-lake-fish-catch-assessment-review-20261111", ["0200000000", "The reviewed catch assessment names Laguna de Cagayan (Bangalao) Lake in Cagayan."]],
  ["region02-bangalao-taxonomy-crosscheck-20261111", ["0200000000", "Its recorded input is the Bangalao Lake assessment, whose study waterbody is in Cagayan."]],
  ["region02-batanes-2017-reef-fish-assemblage-review-20261111", ["0200000000", "The reviewed reef-fish study scope is Batanes."]],
  ["region02-batanes-pole-held-cast-net-fishery-review-20261111", ["0200000000", "The reviewed cast-net fishery study scope is Batanes."]],
  ["region02-batanes-usnm-331725-freshwater-eel-review-20261112", ["0200000000", "The reviewed USNM source locality is Basco, Batanes."]],
  ["region02-batanes-zookeys-type-locality-crosswalk-20261111", ["0200000000", "The selected historical type-series localities in the reviewed checklist are Batanes."]],
  ["region02-bfar-2021-nagtipunan-batanes-fish-leads-review-20261111", ["0200000000", "The reviewed BFAR report leads are in Quirino and Batanes."]],
  ["region02-cagayan-2006-profile-and-provisional-list-source-review-20261110", ["0200000000", "The reviewed profile and fish-list source trail concern Cagayan freshwater fish."]],
  ["region02-cagayan-estuary-aoyama-glass-eel-recruitment-review-20261110", ["0200000000", "The reviewed recruitment study names the Cagayan River mouth and estuary."]],
  ["region02-cagayan-estuary-yoshinaga-japanese-eel-review-20261110", ["0200000000", "The reviewed collection study names the Cagayan River estuary."]],
  ["region02-cagayan-magat-bbold-cas-provenance-rights-review-20261110", ["0200000000", "The reviewed candidates are Cagayan River records and Magat River vouchers in the Cagayan Valley scope."]],
  ["region02-cagayan-magat-fish-taxonomy-crosswalk-20261110", ["0200000000", "Its recorded input review covers Cagayan River candidates and Magat River vouchers in the Cagayan Valley scope."]],
  ["region02-cagayan-river-hilario-eel-identification-review-20261110", ["0200000000", "The reviewed study explicitly samples the Cagayan River."]],
  ["region02-cagayan-riverine-plan-2006-fish-list-review-20261110", ["0200000000", "The reviewed secondary fish-list lead is the Cagayan River plan."]],
  ["region02-clarias-macrocephalus-cagayan-genbank-crosswalk-review-20261111", ["0200000000", "The reviewed population study and accession crosswalk include Cagayan sample localities."]],
  ["region02-darwin-2018-ar1-janitor-fish-cmg-fid-review-20261111", ["0200000000", "The reviewed project report concerns the Cagayan River Basin."]],
  ["region02-darwin-2021-cagayan-freshwater-sanctuary-fish-review-20261111", ["0200000000", "The reviewed project report concerns Cagayan River Basin freshwater sanctuaries."]],
  ["region02-didipio-river-fish-source-trace-review-20261111", ["0200000000", "The reviewed river lead is Didipio River in Nueva Vizcaya."]],
  ["region02-itbayat-1967-freshwater-fish-ethnography-review-20261112", ["0200000000", "The reviewed ethnography is explicitly about Itbayat, Batanes."]],
  ["region02-jica-cagayan-bfar-fish-list-crosscheck-20261110", ["0200000000", "The reviewed provenance and conservation context is the Cagayan fish-list lead."]],
  ["region02-jica-lower-cagayan-aquatic-ecology-fisheries-review-20261110", ["0200000000", "The reviewed JICA report covers the Lower Cagayan River."]],
  ["region02-magat-river-reservoir-source-chain-review-20261111", ["0200000000", "The reviewed Magat Reservoir locality is on the Isabela–Ifugao boundary and adjacent Magat River leads include Isabela; the review is shared with CAR for its Ifugao context.", "1400000000"]],
  ["region02-seafdec-2007-cagayan-ludong-project-context-review-20261111", ["0200000000", "The reviewed project evidence explicitly concerns the Cagayan River."]],
  ["region02-wangag-glass-eel-thesis-review-20261112", ["0200000000", "The reviewed thesis names Wangag River in Cagayan; its exact sampling reach remains unresolved."]],
  ["calabarzon-makiling-pjs-fulltext-access-refresh-20261115", ["0400000000", "The cited study covers watersheds of Mt. Makiling Forest Reserve in Laguna; this is source-scope context, not new species admission."]],
  ["geonames-hydrolakes-region02-nifep-crosswalk-20261109", ["0200000000", "The reviewed purpose explicitly crosswalks BFAR Region II NIFEP named waters."]],
  ["geonames-region02-dost-ludong-site-crosswalk-20261109", ["0200000000", "The reviewed purpose explicitly matches a DOST site lead to the Region II hydrographic candidate queue."]],
  ["geonames-region02-hydrographic-candidate-extract-20261109", ["0200000000", "The review explicitly freezes the five Region II provincial hydrographic search scope."]],
  ["geonames-region02-major-river-name-crosswalk-20261109", ["0200000000", "The reviewed purpose crosswalks named tributaries in the Cagayan Riverine Zone against Region II candidates."]],
].map(([reviewId, [regionId, basis, sharedRegionId]]) => [
  reviewId,
  { regionIds: sharedRegionId ? [regionId, sharedRegionId] : [regionId], basis },
]));

const nationalContextDispositions = new Map([
  ["gbif-ph-fish-taxon-selection-20261107", "National GBIF fish-taxon retrieval design; candidate scope only, not a Luzon species checklist or regional evidence item."],
  ["philippines-freshwater-biogeography-2026-access-rights-review-20261116", "Philippines-wide freshwater source-access and rights review; no regional species extraction or admission."],
  ["source-identity-crosswalk-20261117", "National source-catalog identity reconciliation; preserves source aliases and separate research findings without merging evidence or granting publication approval."],
]);

const publicProjectionComponents = new Map([
  ["angat-gbif-species-evidence.json", "src/components/angat-gbif-evidence.tsx"],
  ["bulacan-manila-bay-gbif-evidence.json", "src/components/bulacan-manila-bay-gbif-evidence.tsx"],
  ["cavite-historical-evidence.json", "src/components/historical-species-evidence.tsx"],
  ["feeding-guides.json", "src/components/feeding-guides.tsx"],
  ["laguna-de-bay-specimen-evidence.json", "src/components/laguna-de-bay-specimen-evidence.tsx"],
  ["makiling-gbif-evidence.json", "src/components/makiling-gbif-evidence.tsx"],
  ["manila-bay-shared-gbif-evidence.json", "src/components/manila-bay-shared-gbif-evidence.tsx"],
  ["palawan-stiphodon-evidence.json", "src/components/palawan-stiphodon-evidence.tsx"],
  ["palico-river-survey-evidence.json", "src/components/palico-river-survey-evidence.tsx"],
  ["pansipit-river-gbif-evidence.json", "src/components/pansipit-river-gbif-evidence.tsx"],
  ["pasig-river-species-evidence.json", "src/components/pasig-river-species-evidence.tsx"],
  ["taal-cas-gbif-evidence.json", "src/components/taal-cas-gbif-evidence.tsx"],
  ["taal-checklist-evidence.json", "src/components/taal-checklist-evidence.tsx"],
]);
const projectionExceptions = new Map([
  ["cavite-historical-evidence.json", {
    status: "rights-scope-reconciliation-required-before-new-repackaging",
    reviewPath: "data/research/philippines/national/reviews/calabarzon-santa-cruz-cas-occurrence-refresh-20261116.json",
    note: "This CAS Ichthyology projection requires row-level reconciliation with the later provider-versus-GBIF terms review; the Santa Cruz review holds its selected records from new public projections and redistributed packages. This index does not change the current page.",
  }],
  ["taal-cas-gbif-evidence.json", {
    status: "rights-scope-reconciliation-required-before-new-repackaging",
    reviewPath: "data/research/philippines/national/reviews/calabarzon-taal-cas-undated-candidates-rights-hold-20261116.json",
    note: "The newer CAS provider terms conflict with GBIF CC0 metadata. The two newly screened candidates are explicitly held; reconcile older displayed CAS rows with the same provider terms before carrying them into a new package. This index does not change the current page.",
  }],
  ["angat-gbif-species-evidence.json", {
    status: "rights-review-needed-before-new-repackaging",
    reviewPath: "data/research/philippines/national/reviews/calabarzon-santa-cruz-cas-occurrence-refresh-20261116.json",
    note: "The displayed source is CAS Ichthyology. The later provider-terms review identifies a conflict with the GBIF CC0 label; record-specific application to this historical Angat entry has not been resolved. Do not carry it into a new package until checked. This index does not change the current page.",
  }],
]);

function loadDocument(relativePath) {
  if (documents.has(relativePath)) return documents.get(relativePath);
  if (!existsSync(path.join(root, relativePath))) return null;
  try {
    const value = readJson(relativePath);
    const refs = collectJsonReferences(value, relativePath);
    for (const ref of refs) {
      if (isGeneratedAuditIndex(ref.resolvedPath ?? ref.raw)) continue;
      if (ref.localRaw) {
        localRawReferences.set(`${relativePath}|${ref.field}|${ref.raw}`, {
          from: relativePath,
          field: ref.field,
          referencedPath: ref.raw,
        });
      } else if (!ref.resolvedPath) {
        missingReferences.set(`${relativePath}|${ref.field}|${ref.raw}`, {
          from: relativePath,
          field: ref.field,
          reference: ref.raw,
        });
      } else {
        if (ref.resolvedPath !== outputPath) inputPaths.add(ref.resolvedPath);
      }
    }
    const record = { value, refs };
    documents.set(relativePath, record);
    return record;
  } catch (error) {
    missingReferences.set(`${relativePath}|parse`, {
      from: relativePath,
      field: "$",
      reference: `JSON parse error: ${error.message}`,
    });
    return null;
  }
}

for (const relativePath of [manifestPath, sourcesPath, ...reviewPaths]) loadDocument(relativePath);
const sourceIdentityCrosswalkPath = `${reviewsRoot}/source-identity-crosswalk-20261117.json`;
const sourceIdentityCrosswalk = documents.get(sourceIdentityCrosswalkPath)?.value;

const directRefsByRegion = new Map();
const reachByRegion = new Map();
const graphFindings = [];

for (const region of manifest.regions) {
  const direct = new Set();
  const reached = new Set();
  const queue = [];
  for (const ref of region.evidenceRefs ?? []) {
    if (typeof ref !== "string") {
      graphFindings.push({ regionId: region.regionId, issue: "non-string manifest evidence reference" });
      continue;
    }
    const resolved = resolveReference(ref, manifestPath);
    if (!resolved) {
      graphFindings.push({ regionId: region.regionId, issue: "manifest reference does not resolve", reference: ref });
      continue;
    }
    inputPaths.add(resolved);
    if (reviewPathSet.has(resolved)) direct.add(resolved);
    queue.push(resolved);
  }

  const visited = new Set();
  while (queue.length) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    if (reviewPathSet.has(current)) reached.add(current);
    const document = loadDocument(current);
    if (!document) continue;
    // These files organize the corpus globally. Their links identify catalog and
    // manifest membership, but do not make every listed review part of each
    // region's evidence scope.
    if (current === sourcesPath || current === manifestPath) continue;
    for (const ref of document.refs) {
      if (ref.localRaw || !ref.resolvedPath || isGeneratedAuditIndex(ref.resolvedPath)) continue;
      queue.push(ref.resolvedPath);
    }
  }
  directRefsByRegion.set(region.regionId, direct);
  reachByRegion.set(region.regionId, reached);
}

const localRawInputs = new Map();
for (const reference of localRawReferences.values()) {
  const candidates = rawReferenceCandidates(reference);
  const checked = candidates
    .filter((candidate) => existsSync(path.join(root, candidate.path)))
    .map((candidate) => {
      const actualSha256 = hashFile(candidate.path);
      return {
        path: candidate.path,
        expectedSha256: candidate.expectedSha256,
        actualSha256,
        hashMatches: candidate.expectedSha256 ? actualSha256 === candidate.expectedSha256 : null,
      };
    });
  const matched = checked.filter((candidate) => candidate.hashMatches !== false);
  reference.availability = matched.length
    ? matched.some((candidate) => candidate.expectedSha256)
      ? "available-and-hash-verified"
      : "available-unpinned"
    : checked.length
      ? "local-hash-mismatch"
      : "not-found-locally";
  reference.matchedFiles = matched.map(({ path: filePath, actualSha256 }) => ({ path: filePath, sha256: actualSha256 }));
  reference.nonmatchingCandidates = checked
    .filter((candidate) => candidate.hashMatches === false)
    .map(({ path: filePath, expectedSha256, actualSha256 }) => ({ path: filePath, expectedSha256, actualSha256 }));
  for (const file of matched) {
    const existing = localRawInputs.get(file.path);
    if (existing) existing.referenceCount += 1;
    else localRawInputs.set(file.path, { path: file.path, sha256: file.actualSha256, referenceCount: 1 });
  }
}

const knownRegionIds = new Set(regionById.keys());
const reviews = reviewPaths.map((relativePath) => {
  const { value } = loadDocument(relativePath);
  const directRegionIds = [];
  const indirectRegionIds = [];
  for (const region of manifest.regions) {
    if (directRefsByRegion.get(region.regionId).has(relativePath)) directRegionIds.push(region.regionId);
    else if (reachByRegion.get(region.regionId).has(relativePath)) indirectRegionIds.push(region.regionId);
  }
  const declaredRegionIds = explicitRegionIds(value, knownRegionIds);
  const reviewKey = value.reviewId ?? value.id ?? value.reportId ?? path.basename(relativePath, ".json");
  const manualAssociation = reviewedRegionalAssociations.get(reviewKey) ?? null;
  const nationalContextDisposition = nationalContextDispositions.get(reviewKey) ?? null;
  const linkedRegionIds = [...new Set([...directRegionIds, ...indirectRegionIds])].sort();
  const relatedRegionIds = [...new Set([
    ...linkedRegionIds,
    ...declaredRegionIds,
    ...(manualAssociation?.regionIds ?? []),
  ])].sort();
  const sourceIds = sourceIdsIn(value);
  const missingSourceIds = sourceIds.filter((id) => !sourceRegistryIds.has(id));
  let classification;
  if (relatedRegionIds.length > 1) classification = "shared-across-regions";
  else if (directRegionIds.length) classification = "directly-linked";
  else if (indirectRegionIds.length) classification = "indirectly-linked";
  else if (declaredRegionIds.length) classification = "unaccounted-for-explicit-region";
  else if (nationalContextDisposition) classification = "national-context-only";
  else classification = "contextual-or-out-of-scope-pending-manual-review";

  const successors = [value.supersededBy, value.successor, value.supersession?.successor]
    .filter((entry) => typeof entry === "string" && entry.trim());
  return {
    path: relativePath,
    sha256: hashFile(relativePath),
    reviewId: value.reviewId ?? value.id ?? null,
    reviewedOn: value.reviewedOn ?? value.checkedOn ?? null,
    phaseId: value.phaseId ?? null,
    declaredRegionIds,
    manualAssociation,
    nationalContextDisposition,
    directRegionIds: directRegionIds.sort(),
    indirectRegionIds: indirectRegionIds.sort(),
    relatedRegionIds,
    classification,
    publicationApproval: value.publicationApproval ?? value.publicAdmission ?? null,
    sourceIds,
    missingSourceIds,
    explicitSuccessorReferences: successors,
  };
});

const regionSummaries = manifest.regions.map((region) => {
  const related = reviews.filter((review) => review.relatedRegionIds.includes(region.regionId));
  return {
    rolloutKey: region.rolloutKey,
    regionId: region.regionId,
    name: region.name,
    manifestReferenceCount: (region.evidenceRefs ?? []).length,
    directlyLinkedReviewCount: reviews.filter((review) => review.directRegionIds.includes(region.regionId)).length,
    indirectlyLinkedReviewCount: reviews.filter((review) => review.indirectRegionIds.includes(region.regionId)).length,
    declaredOrLinkedReviewCount: related.length,
    unaccountedExplicitReviewCount: related.filter((review) => review.classification === "unaccounted-for-explicit-region").length,
    baselineReviewed: region.baselineReviewed,
    scopeFrozen: region.scopeFrozen,
  };
});

const reviewClassifications = Object.fromEntries(
  [...new Set(reviews.map((review) => review.classification))]
    .sort()
    .map((classification) => [classification, reviews.filter((review) => review.classification === classification).length]),
);
const sourceIdFindings = reviews
  .filter((review) => review.missingSourceIds.length)
  .map(({ path: reviewPath, missingSourceIds }) => ({ path: reviewPath, missingSourceIds }));
const unlinkedManualAssociations = reviews
  .filter((review) => review.manualAssociation && review.manualAssociation.regionIds.some((id) => !review.directRegionIds.includes(id) && !review.indirectRegionIds.includes(id)))
  .map(({ path: reviewPath, manualAssociation, directRegionIds, indirectRegionIds }) => ({
    path: reviewPath,
    manualAssociation,
    directRegionIds,
    indirectRegionIds,
  }));

function collectNamedValues(value, matcher, fieldPath = "$", rows = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectNamedValues(entry, matcher, `${fieldPath}[${index}]`, rows));
  } else if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      const nextPath = `${fieldPath}.${key}`;
      if (matcher.test(key) && (typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean")) {
        rows.push({ field: nextPath, value: String(entry) });
      }
      collectNamedValues(entry, matcher, nextPath, rows);
    }
  }
  return rows;
}

function rowFieldNames(value, names, rows = new Set()) {
  if (Array.isArray(value)) value.forEach((entry) => rowFieldNames(entry, names, rows));
  else if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      if (names.has(key)) {
        const items = Array.isArray(entry) ? entry : [entry];
        for (const item of items) if (item && typeof item === "object" && !Array.isArray(item)) {
          for (const field of Object.keys(item)) rows.add(field);
        }
      }
      rowFieldNames(entry, names, rows);
    }
  }
  return [...rows].sort();
}

const primaryCollectionNames = new Set(["records", "assertions", "assertion", "taxa", "additionalSpeciesObservations"]);
const evidenceDateFieldNames = new Set(["eventDate", "collectionDate", "collectionDates", "observationDate", "collectedOn", "date"]);

function summarizeEvidenceDatePrecision(value) {
  const counts = {};
  const fields = new Set();
  function addDate(field, raw) {
    const values = Array.isArray(raw) ? raw : [raw];
    for (const entry of values) {
      if (typeof entry !== "string" || !entry.trim()) continue;
      fields.add(field);
      const text = entry.trim();
      let precision = "source-specific-format";
      if (/^\d{4}$/.test(text)) precision = "year";
      else if (/^\d{4}-\d{2}$/.test(text)) precision = "month";
      else if (/^\d{4}-\d{2}-\d{2}(?:[T ].*)?$/.test(text)) precision = "day";
      else if (/^\d{4}-\d{2}-\d{2}\/\d{4}-\d{2}-\d{2}$/.test(text)) precision = "day-range";
      else if (/^\d{4}-\d{2}-\d{2}\/\d{2}$/.test(text)) precision = "partial-day-range";
      counts[precision] = (counts[precision] ?? 0) + 1;
    }
  }
  function visit(node) {
    if (Array.isArray(node)) node.forEach(visit);
    else if (node && typeof node === "object") {
      for (const [key, entry] of Object.entries(node)) {
        if (evidenceDateFieldNames.has(key)) addDate(key, entry);
        else visit(entry);
      }
    }
  }
  for (const [key, rows] of Object.entries(value)) if (primaryCollectionNames.has(key)) visit(rows);
  return { fields: [...fields].sort(), counts };
}

const publicProjections = [...publicProjectionComponents.entries()].map(([name, renderedBy]) => {
  const projectionPath = `src/data/${name}`;
  const value = readJson(projectionPath);
  const recordCounts = Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => primaryCollectionNames.has(key))
      .map(([key, rows]) => [key, Array.isArray(rows) ? rows.length : rows ? 1 : 0]),
  );
  const rowFields = rowFieldNames(value, primaryCollectionNames);
  const datePrecisionSummary = summarizeEvidenceDatePrecision(value);
  const precisionValues = [...new Set(collectNamedValues(value, /datePrecision|temporalPrecision/i).map((row) => row.value))].sort();
  const licenseStatements = collectNamedValues(value, /license|permissionType|licenseScope/i);
  const sourceIds = sourceIdsIn(value);
  if (name === "cavite-historical-evidence.json") sourceIds.push("gbif-cas-ichthyology");
  const provenanceReferences = collectJsonReferences(value, projectionPath)
    .filter((ref) => ref.resolvedPath)
    .map((ref) => ({ field: ref.field, path: ref.resolvedPath }));
  const exception = projectionExceptions.get(name) ?? null;
  inputPaths.add(projectionPath);
  for (const ref of provenanceReferences) inputPaths.add(ref.path);
  if (exception) inputPaths.add(exception.reviewPath);
  return {
    path: projectionPath,
    sha256: hashFile(projectionPath),
    renderedBy,
    evidenceKind: name === "feeding-guides.json" ? "natural-diet-and-feeding-guidance; not an occurrence projection" : "species-evidence-projection",
    recordCounts,
    rowFieldNames: rowFields,
    evidenceDateFields: datePrecisionSummary.fields,
    evidenceDatePrecisionCounts: datePrecisionSummary.counts,
    explicitDatePrecisions: precisionValues,
    sourceIds: [...new Set(sourceIds)].sort(),
    licenseAndPermissionStatements: licenseStatements,
    provenanceReferences,
    laterPublicationException: exception,
  };
});

const index = {
  schemaVersion: 1,
  snapshotId: "luzon-evidence-audit-20261124",
  status: "generated-read-only-audit;review-linkage-complete;phase-id-namespace-separated;publication-exceptions-open",
  purpose: "Reconcile existing regional review artifacts and their explicit JSON reference chains. The global sources.json catalog and Luzon manifest are linkage leaves rather than regional scope edges; this index does not admit research rows or change regional completion status.",
  inputs: [...inputPaths]
    .filter((relativePath) => existsSync(path.join(root, relativePath)))
    .sort()
    .map((relativePath) => ({ path: relativePath, sha256: hashFile(relativePath) })),
  summary: {
    reviewArtifactsScanned: reviews.length,
    regionCount: manifest.regions.length,
    sourceRegistryUniqueIds: sourceRegistryIds.size,
    sourceIdentityCrosswalkGroups: sourceIdentityCrosswalk?.groups?.length ?? 0,
    reviewClassifications,
    brokenOrUnresolvedJsonReferences: missingReferences.size,
    missingSourceIdLinks: sourceIdFindings.length,
    localRawReferenceCount: localRawReferences.size,
    localRawReferencesAvailable: [...localRawReferences.values()].filter((reference) => reference.availability.startsWith("available-")).length,
    localRawReferencesUnresolved: [...localRawReferences.values()].filter((reference) => !reference.availability.startsWith("available-")).length,
    localRawHashMismatchReferences: [...localRawReferences.values()].filter((reference) => reference.availability === "local-hash-mismatch").length,
    localRawNonmatchingBasenameCandidates: [...localRawReferences.values()].reduce((count, reference) => count + reference.nonmatchingCandidates.length, 0),
    uniqueLocalRawInputsMatched: localRawInputs.size,
    manuallyReviewedRegionalAssociations: reviewedRegionalAssociations.size,
    nationalContextArtifacts: nationalContextDispositions.size,
    unlinkedManualAssociations: unlinkedManualAssociations.length,
    publicProjectionFiles: publicProjections.length,
    publicProjectionRightsExceptions: publicProjections.filter((projection) => projection.laterPublicationException).length,
  },
  regions: regionSummaries,
  reviews,
  publicProjections,
  findings: {
    unresolvedJsonReferences: [...missingReferences.values()].sort((a, b) => `${a.from}|${a.field}`.localeCompare(`${b.from}|${b.field}`)),
    phaseIdInterpretation: {
      comparedToManifestRolloutKey: false,
      reason: "Review phaseId and manifest rolloutKey are separate fields with no documented shared namespace; regional linkage uses explicit region IDs and manifest evidence references.",
    },
    localRawInputAvailability: [...localRawReferences.values()].sort((a, b) => `${a.from}|${a.field}`.localeCompare(`${b.from}|${b.field}`)),
    localRawInputs: [...localRawInputs.values()].sort((a, b) => a.path.localeCompare(b.path)),
    missingSourceIds: sourceIdFindings,
    unlinkedManualAssociations,
    manifestReferenceProblems: graphFindings,
    supersessionDisposition: "Only explicit successor fields are listed. No review is inferred to be superseded from dates, filenames, or content similarity.",
    manualDispositionNeeded: reviews
      .filter((review) => review.classification === "contextual-or-out-of-scope-pending-manual-review" || review.classification === "unaccounted-for-explicit-region")
      .map(({ path: reviewPath, declaredRegionIds, directRegionIds, indirectRegionIds }) => ({
        path: reviewPath,
        declaredRegionIds,
        directRegionIds,
        indirectRegionIds,
      })),
  },
};

writeFileSync(path.join(root, outputPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(`Regional evidence index: ${outputPath}`);
console.log(`Review artifacts scanned: ${index.summary.reviewArtifactsScanned}`);
console.log(`Review classifications: ${JSON.stringify(reviewClassifications)}`);
console.log(`Unresolved JSON references: ${missingReferences.size}; missing source IDs: ${sourceIdFindings.length}`);
console.log(`Local-only raw references: ${index.summary.localRawReferenceCount}; available: ${index.summary.localRawReferencesAvailable}; unresolved or mismatched: ${index.summary.localRawReferencesUnresolved}; unique files: ${index.summary.uniqueLocalRawInputsMatched}`);
console.log("Phase ID / regional rollout-key comparison: skipped (no shared namespace is defined)");
console.log(`Manifest reference problems: ${graphFindings.length}`);
