import assert from "node:assert/strict";
import test from "node:test";
import { getBrowserPreferredLanguage } from "../src/i18n/browser-language.ts";

test("uses the first supported browser language", () => {
  assert.equal(getBrowserPreferredLanguage(["en-US", "fil-PH"]), "en");
  assert.equal(getBrowserPreferredLanguage(["fr-FR", "fil-PH", "en-US"]), "fil");
});

test("recognizes Tagalog as the Filipino app language", () => {
  assert.equal(getBrowserPreferredLanguage(["tl-PH"]), "fil");
});

test("uses Filipino when no supported browser language is available", () => {
  assert.equal(getBrowserPreferredLanguage(["ja-JP", "fr-FR"]), "fil");
  assert.equal(getBrowserPreferredLanguage([]), "fil");
});
