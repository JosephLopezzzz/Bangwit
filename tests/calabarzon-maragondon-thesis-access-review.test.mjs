import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, claim, registry, report, reviewBytes, claimBytes, sourceBytes] = await Promise.all([
  readFile(new URL("calabarzon-maragondon-thesis-access-review-20261026.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-maragondon-oreochromis-claim-review-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("sources.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-coverage-gap-report-20261025.json", base), "utf8").then(JSON.parse),
  readFile(new URL("calabarzon-maragondon-thesis-access-review-20261026.json", base)),
  readFile(new URL("calabarzon-maragondon-oreochromis-claim-review-20261025.json", base)),
  readFile(new URL("sources.json", base)),
]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("DLSU-D thesis access restrictions do not verify or release the Maragondon species claim", () => {
  assert.equal(review.sourceId, "dlsud-aea-thesis-access-policies");
  assert.equal(review.targetWork.author, "Michael A. Jalandoon");
  assert.equal(review.searchOutcome.recordSpecificCatalogSearchCompleted, false);
  assert.equal(review.searchOutcome.thesisTextObtained, false);
  assert.equal(review.searchOutcome.authorPermissionObtained, false);
  assert.equal(review.decision.speciesIdentificationVerified, false);
  assert.equal(review.decision.reusePermissionVerified, false);
  assert.equal(review.decision.speciesAssertionsAdded, 0);
  assert.equal(review.decision.publicProjectionAdded, false);
  assert.match(review.institutionalSources[1].finding, /temporarily suspended/i);
  assert.match(review.institutionalSources[1].finding, /author permission/i);

  const source = registry.sources.find((row) => row.id === review.sourceId);
  assert.ok(source);
  assert.equal(source.publicationApproval, false);
  assert.ok(source.access.reviewFiles.includes("calabarzon-maragondon-thesis-access-review-20261026.json"));
  assert.ok(source.access.reviewFiles.includes("calabarzon-maragondon-oreochromis-claim-review-20261025.json"));
  assert.equal(registry.sourceCount, registry.sources.length);
  assert.equal(registry.sourceCount, 161);

  assert.deepEqual(claim.institutionalAccessReview, {
    reviewFile: "calabarzon-maragondon-thesis-access-review-20261026.json",
    sourceId: review.sourceId,
    recordSpecificCatalogSearchCompleted: false,
    thesisTextObtained: false,
    authorPermissionObtained: false,
    officialAeaAirStatus: "temporarily-suspended-per-current-library-faq",
    fullTextRequirement: "author permission required for thesis full text or approved pages",
    effect: "No change to species identification or reuse decision; the 2019 Oreochromis niloticus claim remains held.",
  });
  assert.equal(claim.decision.speciesAssertionsAdded, 0);
  assert.equal(claim.decision.publicAppProjectionAdded, false);
  assert.equal(report.inputHashes.sourcesSha256, sha256(sourceBytes));
  assert.equal(report.inputHashes.maragondonOreochromisClaimReviewSha256, sha256(claimBytes));
  assert.equal(report.inputHashes.maragondonThesisAccessReviewSha256, sha256(reviewBytes));
  assert.equal(report.coverageSummary.registeredSources, 161);
  assert.match(report.openGaps.find((row) => row.id === "maragondon-species-identification-and-reuse").nextAction, /author-approved full-text access/i);
});
