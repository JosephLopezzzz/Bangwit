import type { CatchEntry } from "@/types/catch";
import type { FishingTrip } from "@/types/fishing-trip";

const DATABASE = "bangwit-local";
const VERSION = 2;
const CATCH_STORE = "catches";
const TRIP_STORE = "fishing-trips";

type PhotoBackup = { type: string; name: string; lastModified: number; data: string };
type BackupEntry = Omit<CatchEntry, "id" | "photo"> & { id: number; photo: PhotoBackup | null };
type BackupTrip = Omit<FishingTrip, "id"> & { id: number };
type CatchBackup =
  | { format: "bangwit-catches"; version: 1; exportedAt: string; catches: BackupEntry[] }
  | { format: "bangwit-catches"; version: 2; exportedAt: string; catches: BackupEntry[]; fishingTrips: BackupTrip[] };

let databasePromise: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined")
    return Promise.reject(new Error("Hindi available ang local storage sa browser na ito."));
  if (databasePromise) return databasePromise;

  const opening = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE, VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(CATCH_STORE)) {
        request.result.createObjectStore(CATCH_STORE, { keyPath: "id", autoIncrement: true });
      }
      if (!request.result.objectStoreNames.contains(TRIP_STORE)) {
        request.result.createObjectStore(TRIP_STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
    request.onerror = () => reject(request.error ?? new Error("Hindi mabuksan ang local catch storage."));
    request.onblocked = () => reject(new Error("Naka-open pa ang lumang Bangwit tab. Isara ito at subukan ulit."));
  }).catch((error: unknown) => {
    databasePromise = undefined;
    throw error;
  });
  databasePromise = opening;
  return opening;
}

function transact<T>(
  storeName: string,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(storeName, mode);
        const request = action(transaction.objectStore(storeName));
        let result: T;
        request.onsuccess = () => {
          result = request.result;
        };
        request.onerror = () =>
          reject(request.error ?? transaction.error ?? new Error("Local storage request failed."));
        transaction.oncomplete = () => resolve(result);
        transaction.onerror = () => reject(transaction.error ?? new Error("Local storage transaction failed."));
        transaction.onabort = () => reject(transaction.error ?? new Error("Local storage transaction was cancelled."));
      }),
  );
}

export const listCatches = () => transact<CatchEntry[]>(CATCH_STORE, "readonly", (store) => store.getAll());
export const saveCatch = (entry: CatchEntry) =>
  transact<IDBValidKey>(CATCH_STORE, "readwrite", (store) => store.add(entry));
export const removeCatch = (id: number) => transact<undefined>(CATCH_STORE, "readwrite", (store) => store.delete(id));
export const listFishingTrips = () => transact<FishingTrip[]>(TRIP_STORE, "readonly", (store) => store.getAll());
export const saveFishingTrip = (entry: FishingTrip) =>
  transact<IDBValidKey>(TRIP_STORE, "readwrite", (store) => store.add(entry));
export const removeFishingTrip = (id: number) =>
  transact<undefined>(TRIP_STORE, "readwrite", (store) => store.delete(id));

function encodeBytes(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

function decodeBytes(value: string): Uint8Array {
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
    throw new Error("May invalid na photo data sa backup file.");
  }
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function photoToBackup(photo: Blob | File | null): Promise<PhotoBackup | null> {
  if (!photo) return null;
  const file = photo instanceof File ? photo : null;
  return {
    type: photo.type,
    name: file?.name ?? "catch-photo",
    lastModified: file?.lastModified ?? 0,
    data: encodeBytes(new Uint8Array(await photo.arrayBuffer())),
  };
}

export async function exportCatchBackup(): Promise<string> {
  const [catches, fishingTrips] = await Promise.all([listCatches(), listFishingTrips()]);
  const entries = await Promise.all(
    catches.map(async (entry) => ({
      ...entry,
      id: entry.id as number,
      photo: await photoToBackup(entry.photo),
    })),
  );
  const backup: CatchBackup = {
    format: "bangwit-catches",
    version: 2,
    exportedAt: new Date().toISOString(),
    catches: entries,
    fishingTrips: fishingTrips.map((trip) => ({ ...trip, id: trip.id as number })),
  };
  return JSON.stringify(backup, null, 2);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function parseBackup(file: File): Promise<{ catches: CatchEntry[]; fishingTrips: FishingTrip[] }> {
  let input: unknown;
  try {
    input = JSON.parse(await file.text());
  } catch {
    throw new Error("Hindi mabasa ang backup. Pumili ng valid na Bangwit JSON file.");
  }
  if (
    !isRecord(input) ||
    input.format !== "bangwit-catches" ||
    (input.version !== 1 && input.version !== 2) ||
    !Array.isArray(input.catches) ||
    (input.version === 2 && !Array.isArray(input.fishingTrips))
  ) {
    throw new Error("Hindi tugma ang format ng backup na ito sa Bangwit.");
  }

  const catches = await Promise.all(
    input.catches.map(async (value): Promise<CatchEntry> => {
      if (!isRecord(value) || !Number.isSafeInteger(value.id) || Number(value.id) < 1) {
        throw new Error("May invalid na catch entry o ID sa backup.");
      }
      const textFields = [
        "species",
        "date",
        "habitat",
        "location",
        "length",
        "weight",
        "bait",
        "notes",
        "disposition",
        "savedAt",
        "syncStatus",
      ] as const;
      for (const field of textFields) {
        if (typeof value[field] !== "string") throw new Error(`May invalid na ${field} field sa backup.`);
      }
      if (value.lengthUnit !== undefined && value.lengthUnit !== "cm" && value.lengthUnit !== "in") {
        throw new Error("May invalid na length unit sa backup.");
      }
      if (
        value.weightUnit !== undefined &&
        value.weightUnit !== "g" &&
        value.weightUnit !== "kg" &&
        value.weightUnit !== "lbs"
      ) {
        throw new Error("May invalid na weight unit sa backup.");
      }

      let photo: Blob | null = null;
      if (value.photo !== null) {
        if (
          !isRecord(value.photo) ||
          typeof value.photo.type !== "string" ||
          typeof value.photo.name !== "string" ||
          !Number.isFinite(value.photo.lastModified) ||
          typeof value.photo.data !== "string"
        ) {
          throw new Error("May invalid na photo sa backup.");
        }
        const photoBytes = new Uint8Array(decodeBytes(value.photo.data));
        const photoBlob = new Blob([photoBytes.buffer as ArrayBuffer], { type: value.photo.type });
        photo =
          typeof File === "undefined"
            ? photoBlob
            : new File([photoBlob], value.photo.name, {
                type: value.photo.type,
                lastModified: Number(value.photo.lastModified),
              });
      }
      const { photo: _photo, ...entry } = value;
      return { ...(entry as Omit<CatchEntry, "photo">), id: Number(value.id), photo };
    }),
  );

  const tripValues = Array.isArray(input.fishingTrips) ? input.fishingTrips : [];
  const fishingTrips =
    input.version === 2
      ? tripValues.map((value): FishingTrip => {
          if (
            !isRecord(value) ||
            !Number.isSafeInteger(value.id) ||
            Number(value.id) < 1 ||
            (value.waterType !== "sea" && value.waterType !== "lake" && value.waterType !== "river") ||
            (value.outcome !== "no-bites" &&
              value.outcome !== "bites" &&
              value.outcome !== "caught-fish" &&
              value.outcome !== "not-recorded") ||
            (value.biteCount !== null && (!Number.isSafeInteger(value.biteCount) || Number(value.biteCount) < 0))
          ) {
            throw new Error("May invalid na fishing trip o ID sa backup.");
          }
          for (const field of [
            "date",
            "startTime",
            "endTime",
            "location",
            "targetSpecies",
            "method",
            "notes",
            "savedAt",
          ] as const) {
            if (typeof value[field] !== "string") throw new Error(`May invalid na ${field} field sa backup.`);
          }
          return { ...(value as Omit<FishingTrip, "id">), id: Number(value.id) };
        })
      : [];

  return { catches, fishingTrips };
}

export async function restoreCatchBackup(file: File): Promise<number> {
  const { catches, fishingTrips } = await parseBackup(file);
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CATCH_STORE, TRIP_STORE], "readwrite");
    const catchStore = transaction.objectStore(CATCH_STORE);
    const tripStore = transaction.objectStore(TRIP_STORE);
    let catchCount: number | undefined;
    let tripCount: number | undefined;
    const maybeRestore = () => {
      if (catchCount === undefined || tripCount === undefined) return;
      if (catchCount > 0 || tripCount > 0) {
        transaction.abort();
        reject(
          new Error(
            "May laman na ang local fishing journal. I-export muna ito; hindi papalitan o paghahaluin ang records.",
          ),
        );
        return;
      }
      for (const entry of catches) catchStore.add(entry);
      for (const trip of fishingTrips) tripStore.add(trip);
    };
    const catchCountRequest = catchStore.count();
    const tripCountRequest = tripStore.count();
    catchCountRequest.onsuccess = () => {
      catchCount = catchCountRequest.result;
      maybeRestore();
    };
    tripCountRequest.onsuccess = () => {
      tripCount = tripCountRequest.result;
      maybeRestore();
    };
    catchCountRequest.onerror = () =>
      reject(catchCountRequest.error ?? new Error("Hindi ma-validate ang destination storage."));
    tripCountRequest.onerror = () =>
      reject(tripCountRequest.error ?? new Error("Hindi ma-validate ang destination storage."));
    transaction.oncomplete = () => resolve(catches.length + fishingTrips.length);
    transaction.onerror = () => reject(transaction.error ?? new Error("Hindi na-restore ang backup."));
    transaction.onabort = () => reject(transaction.error ?? new Error("Hindi natuloy ang restore."));
  });
}

export async function clearCatches(): Promise<void> {
  await transact<undefined>(CATCH_STORE, "readwrite", (store) => store.clear());
}

export async function clearLocalFishingData(): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction([CATCH_STORE, TRIP_STORE], "readwrite");
    transaction.objectStore(CATCH_STORE).clear();
    transaction.objectStore(TRIP_STORE).clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Hindi nabura ang local fishing data."));
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("Hindi natuloy ang pagbura ng local fishing data."));
  });
}
