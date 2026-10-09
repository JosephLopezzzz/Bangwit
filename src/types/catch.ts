export type CatchDisposition = "Released" | "Kept" | "Not recorded";
export type CatchLengthUnit = "cm" | "in";
export type CatchWeightUnit = "g" | "kg" | "lbs";

export type CatchEntry = {
  id?: number;
  species: string;
  date: string;
  habitat: string;
  location: string;
  length: string;
  lengthUnit?: CatchLengthUnit;
  weight: string;
  weightUnit?: CatchWeightUnit;
  bait: string;
  notes: string;
  disposition: CatchDisposition | string;
  photo: Blob | File | null;
  savedAt: string;
  syncStatus: "device-only" | string;
};

export type FisherProfile = {
  type: "exploring" | "angler" | "livelihood" | "both";
  water: "any" | "saltwater" | "freshwater" | "brackish";
};
