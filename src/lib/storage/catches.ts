import type { CatchEntry } from "@/types/catch";

const DATABASE = "bangwit-local";
const VERSION = 1;
const STORE = "catches";

type PhotoBackup = { type: string; name: string; lastModified: number; data: string };
type BackupEntry = Omit<CatchEntry, "id" | "photo"> & { id: number; photo: PhotoBackup | null };
type CatchBackup = { format: "bangwit-catches"; version: 1; exportedAt: string; catches: BackupEntry[] };

let databasePromise: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined")
    return Promise.reject(new Error("Hindi available ang local storage sa browser na ito."));
  if (databasePromise) return databasePromise;

  const opening = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE, VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
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

function transact<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE, mode);
        const request = action(transaction.objectStore(STORE));
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

export const listCatches = () => transact<CatchEntry[]>("readonly", (store) => store.getAll());
export const saveCatch = (entry: CatchEntry) => transact<IDBValidKey>("readwrite", (store) => store.add(entry));
export const removeCatch = (id: number) => transact<undefined>("readwrite", (store) => store.delete(id));

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
  const catches = await listCatches();
  const entries = await Promise.all(
    catches.map(async (entry) => ({
      ...entry,
      id: entry.id as number,
      photo: await photoToBackup(entry.photo),
    })),
  );
  const backup: CatchBackup = {
    format: "bangwit-catches",
    version: 1,
    exportedAt: new Date().toISOString(),
    catches: entries,
  };
  return JSON.stringify(backup, null, 2);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function parseBackup(file: File): Promise<CatchEntry[]> {
  let input: unknown;
  try {
    input = JSON.parse(await file.text());
  } catch {
    throw new Error("Hindi mabasa ang backup. Pumili ng valid na Bangwit JSON file.");
  }
  if (!isRecord(input) || input.format !== "bangwit-catches" || input.version !== 1 || !Array.isArray(input.catches)) {
    throw new Error("Hindi tugma ang format ng backup na ito sa Bangwit.");
  }

  return Promise.all(
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
}

export async function restoreCatchBackup(file: File): Promise<number> {
  const entries = await parseBackup(file);
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, "readwrite");
    const store = transaction.objectStore(STORE);
    const countRequest = store.count();
    countRequest.onsuccess = () => {
      if (countRequest.result > 0) {
        transaction.abort();
        reject(
          new Error(
            "May laman na ang catch journal na ito. I-export muna ito; hindi papalitan o paghahaluin ang records.",
          ),
        );
        return;
      }
      for (const entry of entries) store.add(entry);
    };
    countRequest.onerror = () => reject(countRequest.error ?? new Error("Hindi ma-validate ang destination storage."));
    transaction.oncomplete = () => resolve(entries.length);
    transaction.onerror = () => reject(transaction.error ?? new Error("Hindi na-restore ang backup."));
    transaction.onabort = () => reject(transaction.error ?? new Error("Hindi natuloy ang restore."));
  });
}

export async function clearCatches(): Promise<void> {
  await transact<undefined>("readwrite", (store) => store.clear());
}
