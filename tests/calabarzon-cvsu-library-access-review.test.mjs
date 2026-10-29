import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base = new URL("../data/research/philippines/", import.meta.url);
const review = JSON.parse(await readFile(new URL("calabarzon-labac-cvsu-library-access-review-20261029.json", base), "utf8"));

test("CvSU thesis access review documents the gate without submitting personal data", () => {
  assert.equal(review.status, "official-library-routes-reviewed;thesis-search-authentication-gated;no-login-or-request-submitted");
  assert.equal(review.officialLibrary.catalogSearchPerformed, false);
  assert.equal(review.officialLibrary.catalogRecordLocated, false);
  assert.match(review.officialLibrary.observedRoute, /guest sign-in control; neither was used/);
  assert.ok(review.abstractRequestForm.requiredFieldsObserved.includes("student or employee number"));
  assert.ok(review.abstractRequestForm.requiredFieldsObserved.includes("thesis barcode number"));
  assert.equal(review.abstractRequestForm.submitted, false);
  assert.match(review.abstractRequestForm.applicability, /Do not assume this form can request its conference presentation or full text/);
  assert.equal(review.privacyAndRights.personalDataTransmitted, false);
  assert.equal(review.privacyAndRights.loginAttempted, false);
  assert.equal(review.privacyAndRights.emailSent, false);
  assert.equal(review.decisions.speciesAssertionsAdded, 0);
  assert.equal(review.decisions.publicAdmission, false);
  assert.equal(review.decisions.fishAbsenceInferred, false);
});
