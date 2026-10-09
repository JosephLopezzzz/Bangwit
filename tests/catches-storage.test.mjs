import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { test } from "node:test";
import { clearCatches, exportCatchBackup, listCatches, restoreCatchBackup, saveCatch } from "../src/lib/storage/catches.ts";

test("preserves a version-1 catch and photo through export and empty-database restore", async () => {
  await clearCatches();
  const photo = new File([new Uint8Array([0, 1, 2, 254, 255])], "dalag-catch.jpg", {
    type: "image/jpeg",
    lastModified: 1_700_000_000_000,
  });
  const legacyEntry = {
    id: 41,
    species: "Dalag",
    date: "2026-08-09",
    habitat: "Freshwater",
    location: "Private creek label",
    length: "23.5",
    weight: "410",
    bait: "Uod",
    notes: "Legacy note",
    disposition: "Released",
    photo,
    savedAt: "2026-08-09T06:15:00.000Z",
    syncStatus: "device-only",
  };
  await saveCatch(legacyEntry);

  const before = await listCatches();
  assert.equal(before.length, 1);
  assert.equal(before[0].id, 41);
  const backup = await exportCatchBackup();
  const backupFile = new File([backup], "bangwit-backup.json", { type: "application/json" });

  await clearCatches();
  assert.equal(await restoreCatchBackup(backupFile), 1);
  const restored = await listCatches();
  assert.equal(restored.length, 1);
  const record = restored[0];
  assert.equal(record.id, 41);
  assert.deepEqual(
    {
      species: record.species,
      date: record.date,
      habitat: record.habitat,
      location: record.location,
      length: record.length,
      weight: record.weight,
      bait: record.bait,
      notes: record.notes,
      disposition: record.disposition,
      savedAt: record.savedAt,
      syncStatus: record.syncStatus,
    },
    {
      species: "Dalag",
      date: "2026-08-09",
      habitat: "Freshwater",
      location: "Private creek label",
      length: "23.5",
      weight: "410",
      bait: "Uod",
      notes: "Legacy note",
      disposition: "Released",
      savedAt: "2026-08-09T06:15:00.000Z",
      syncStatus: "device-only",
    },
  );
  assert.equal(record.photo?.type, "image/jpeg");
  assert.ok(record.photo instanceof File);
  assert.equal(record.photo.name, "dalag-catch.jpg");
  assert.equal(record.photo.lastModified, 1_700_000_000_000);
  assert.deepEqual([...new Uint8Array(await record.photo.arrayBuffer())], [0, 1, 2, 254, 255]);

  await assert.rejects(restoreCatchBackup(backupFile), /May laman na ang catch journal/);
  assert.equal((await listCatches()).length, 1);
});

test("preserves chosen measurement units through backup and rejects unsupported units", async () => {
  await clearCatches();
  const measurements = [
    { length: "23.5", lengthUnit: "cm", weight: "410", weightUnit: "g" },
    { length: "9.25", lengthUnit: "in", weight: "0.41", weightUnit: "kg" },
    { length: "9.25", lengthUnit: "in", weight: "0.9", weightUnit: "lbs" },
  ];
  for (const measurement of measurements) {
    await saveCatch({
      species: "Unit test catch",
      date: "2026-10-10",
      habitat: "Saltwater",
      location: "",
      ...measurement,
      bait: "",
      notes: "",
      disposition: "Released",
      photo: null,
      savedAt: "2026-10-10T00:00:00.000Z",
      syncStatus: "device-only",
    });
  }
  const backup = await exportCatchBackup();
  await clearCatches();
  assert.equal(await restoreCatchBackup(new File([backup], "units.json")), 3);
  assert.deepEqual(
    (await listCatches()).map(({ length, lengthUnit, weight, weightUnit }) => ({ length, lengthUnit, weight, weightUnit })),
    measurements,
  );
  await clearCatches();
  for (const [field, invalidUnit] of [["lengthUnit", "feet"], ["weightUnit", "stones"]]) {
    const invalidBackup = JSON.parse(backup);
    invalidBackup.catches[0][field] = invalidUnit;
    await assert.rejects(
      restoreCatchBackup(new File([JSON.stringify(invalidBackup)], "invalid-units.json")),
      /invalid na .* unit/,
    );
    assert.equal((await listCatches()).length, 0);
  }
});
