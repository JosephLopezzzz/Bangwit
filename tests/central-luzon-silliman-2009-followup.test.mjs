import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const [review, checkpoint, proposals, catalogReview, registry] = await Promise.all([
  "central-luzon-silliman-nueva-ecija-pampanga-2009-followup-20261024.json",
  "central-luzon-discovery-checkpoint-20261024.json",
  "central-luzon-silliman-2009-gbif-taxonomy-proposals-20261024.json",
  "central-luzon-silliman-2009-catalog-of-fishes-followup-20261024.json",
  "sources.json",
].map((name) => readFile(new URL(name, base), "utf8").then(JSON.parse)));

test("Silliman 2009 scope keeps Nueva Ecija waters separate from Pampanga river reaches", () => {
  assert.equal(review.source.issue, "Volume 50, Number 2, July to December 2009");
  assert.equal(review.sourceReportedStudyDesign.newEcijaStudyAreas.length, 5);
  assert.equal(review.sourceReportedStudyDesign.pampangaStudyAreas.length, 4);
  assert.ok(review.sourceReportedStudyDesign.newEcijaStudyAreas.some(({ waterbody }) => waterbody === "Paitan Lake"));
  assert.ok(review.sourceReportedStudyDesign.newEcijaStudyAreas.some(({ waterbody }) => waterbody === "Pantabangan Dam"));
  assert.equal(review.sourceReportedStudyDesign.stationMethod.fieldDates, null);
  assert.equal(review.sourceReportedStudyDesign.stationMethod.stationCoordinates, null);
  assert.equal(review.authorReportedFishNameGroups.newEcijaIndigenous.length, 2);
  assert.equal(review.authorReportedFishNameGroups.newEcijaEndemic.length, 1);
  assert.equal(review.authorReportedFishNameGroups.newEcijaIntroduced.length, 7);
  assert.equal(review.authorReportedFishNameGroups.pampangaAndCandabaIntroducedCombinedTable.length, 9);
  assert.ok(review.authorReportedFishNameGroups.interpretationLimits.some((text) => /do not infer which individual river reach or wetland/.test(text)));
});

test("Silliman source-era aggregate lists and rights limits do not become app records", () => {
  assert.match(review.source.accessReview.reuse, /written permission/);
  assert.match(review.source.accessReview.articlePdfRoute, /502/);
  assert.equal(review.coverageAndAdmission.independentlyVerifiedTaxa, 0);
  assert.equal(review.coverageAndAdmission.siteSpecificFishAssignmentsExtracted, 0);
  assert.equal(review.coverageAndAdmission.currentPresenceClaims, 0);
  assert.equal(review.coverageAndAdmission.publicSpeciesAssertionsAdded, 0);
  assert.equal(review.coverageAndAdmission.dietClaimsAdded, 0);
  assert.equal(review.coverageAndAdmission.appProjectionsAdded, 0);
  assert.equal(review.coverageAndAdmission.geometryAdded, false);
  assert.equal(review.coverageAndAdmission.regionalReleaseApproved, false);
});

test("Central Luzon checkpoint links the 2009 follow-up and taxonomy reviews but remains incomplete", () => {
  const source = registry.sources.find(({ id }) => id === "silliman-nueva-ecija-pampanga-freshwater-study");
  assert.ok(source);
  assert.ok(source.access.reviewFiles.includes("central-luzon-silliman-nueva-ecija-pampanga-2009-followup-20261024.json"));
  assert.equal(checkpoint.silliman2009FollowupReviewFile, "central-luzon-silliman-nueva-ecija-pampanga-2009-followup-20261024.json");
  assert.equal(checkpoint.silliman2009TaxonomyProposalFile, "central-luzon-silliman-2009-gbif-taxonomy-proposals-20261024.json");
  assert.equal(checkpoint.silliman2009CatalogFollowupFile, "central-luzon-silliman-2009-catalog-of-fishes-followup-20261024.json");
  assert.ok(source.access.reviewFiles.includes("central-luzon-silliman-2009-gbif-taxonomy-proposals-20261024.json"));
  assert.ok(source.access.reviewFiles.includes("central-luzon-silliman-2009-catalog-of-fishes-followup-20261024.json"));
  assert.equal(checkpoint.status, "discovery-checkpoint-incomplete");
  assert.match(checkpoint.nextStep.action, /Central Luzon source discovery/);
});

test("17 GBIF name matches remain proposals, preserve source spellings and expose independent family conflict", () => {
  assert.equal(proposals.summary.sourceNameMentions, 19);
  assert.equal(proposals.summary.uniqueSourceNames, 17);
  assert.equal(proposals.summary.responsesMarkedAccepted, 15);
  assert.equal(proposals.summary.responsesMarkedSynonym, 2);
  assert.ok(proposals.proposals.every(({ decision }) => decision.includes("proposal-only")));
  const synonym = proposals.proposals.find(({ sourceName }) => sourceName === "Trichogaster pectoralis");
  assert.equal(synonym.proposedAcceptedName, "Trichopodus pectoralis");
  assert.equal(synonym.acceptedUsageKey, 5211177);
  const spellingProposal = proposals.proposals.find(({ sourceName }) => sourceName === "Hypopthalmichthys molitrix");
  assert.equal(spellingProposal.proposedAcceptedName, "Hypophthalmichthys molitrix");
  assert.equal(spellingProposal.acceptedUsageKey, 2362473);
  assert.equal(catalogReview.coverageAndAdmission.sourceNamesIndependentlyReviewed, 17);
  assert.equal(catalogReview.reviews.length, 17);
  const familyConflict = catalogReview.reviews.find(({ sourceSpelling }) => sourceSpelling === "Hypopthalmichthys molitrix");
  assert.match(familyConflict.catalogFinding, /Xenocyprididae.*GBIF.*Cyprinidae/);
  assert.equal(catalogReview.coverageAndAdmission.appProjectionsAdded, 0);
  assert.equal(catalogReview.coverageAndAdmission.regionalReleaseApproved, false);
});
