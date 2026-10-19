import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { CAVITE_AREAS } from "../src/data/cavite-areas.ts";
import { getBrowserPreferredLanguage } from "../src/i18n/browser-language.ts";

test("uses the first supported browser language", () => {
  assert.equal(getBrowserPreferredLanguage(["en-US", "fil-PH"]), "en");
  assert.equal(getBrowserPreferredLanguage(["fr-FR", "fil-PH", "en-US"]), "fil");
});

test("recognizes Tagalog as the Filipino app language", () => {
  assert.equal(getBrowserPreferredLanguage(["tl-PH"]), "fil");
});

test("uses the correctly encoded Cavite area names across location controls", () => {
  assert.deepEqual(CAVITE_AREAS, ["Manila Bay", "Bacoor Bay", "Ca\u00f1acao Bay"]);
});

test("uses Filipino when no supported browser language is available", () => {
  assert.equal(getBrowserPreferredLanguage(["ja-JP", "fr-FR"]), "fil");
  assert.equal(getBrowserPreferredLanguage([]), "fil");
});

test("first-use guide describes pilot areas as browsing choices, not verified fishing grounds", async () => {
  const [english, filipino] = await Promise.all([
    readFile(new URL("../src/i18n/dictionaries/en.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/i18n/dictionaries/fil.ts", import.meta.url), "utf8"),
  ]);

  assert.match(english, /Choose an area to explore/);
  assert.match(english, /does not confirm fishing access or legal water boundaries/);
  assert.doesNotMatch(english, /Select a Cavite fishing ground/);
  assert.match(filipino, /Pumili ng lugar na titingnan/);
  assert.match(filipino, /Hindi nito kinukumpirma ang pahintulot mangisda o legal na hangganan ng katubigan/);
  assert.doesNotMatch(filipino, /Cavite fishing ground/);
});

test("keeps prototype policy drafts and review disclosures available in both languages", async () => {
  const [english, filipino, provider] = await Promise.all([
    readFile(new URL("../src/i18n/dictionaries/en.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/i18n/dictionaries/fil.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/components/bangwit-provider.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(english, /reviewNotice: "Prototype policy draft · legal review pending"/);
  assert.match(filipino, /reviewNotice: "Draft ng prototype policy · kailangan pa ng legal review"/);
  assert.match(english, /hosting provider's processing of website request metadata or logs/);
  assert.match(filipino, /hosting provider sa request metadata at logs/);
  assert.match(english, /weather, flood, or red-tide alerts/);
  assert.match(filipino, /weather, flood, o red-tide alerts/);
  assert.match(english, /protected-species and protected-area restrictions/);
  assert.match(filipino, /protected-species at protected-area restrictions/);
  assert.match(english, /optional manually entered location text/);
  assert.match(filipino, /optional na location text na ikaw ang naglagay/);
  assert.match(english, /does not authorize cloud uploads/);
  assert.match(filipino, /hindi pahintulot sa cloud upload/);
  assert.match(provider, /POLICY_VERSION = "prototype-6"/);
  assert.match(english, /90 days after the request is resolved/);
  assert.match(filipino, /90 araw matapos maresolba ang request/);
  assert.match(english, /Google's recovery, backup and legal-retention processes are separate/);
  assert.match(filipino, /Hiwalay ang recovery, backup at legal-retention processes ng Google/);
});
