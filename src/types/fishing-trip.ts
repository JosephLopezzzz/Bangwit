export type FishingWaterType = "sea" | "lake" | "river";
export type FishingTripOutcome = "no-bites" | "bites" | "caught-fish" | "not-recorded";

export type FishingTrip = {
  id?: number;
  waterType: FishingWaterType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  targetSpecies: string;
  method: string;
  outcome: FishingTripOutcome;
  biteCount: number | null;
  notes: string;
  savedAt: string;
};
