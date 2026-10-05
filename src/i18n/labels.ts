import type { Language } from "./types";

/**
 * Display-time label resolvers for stored fields.
 * Stored database values remain untampered ("Hindi alam", "Released", etc.),
 * but are rendered cleanly according to current user language.
 */

export function getHabitatLabel(value: string | undefined, lang: Language): string {
  if (!value) return lang === "fil" ? "Uri ng tubig hindi naitala" : "Water type not recorded";
  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "saltwater":
    case "dagat":
      return lang === "fil" ? "Saltwater (Dagat)" : "Saltwater (Marine)";
    case "freshwater":
    case "ilog o lawa":
      return lang === "fil" ? "Freshwater (Ilog o lawa)" : "Freshwater (River/Lake)";
    case "brackish":
    case "halo ng alat at tabang":
      return lang === "fil" ? "Brackish (Halo ng alat at tabang)" : "Brackish (Estuary)";
    case "hindi alam":
    case "unknown":
      return lang === "fil" ? "Hindi alam" : "Unknown";
    default:
      return value;
  }
}

export function getDispositionLabel(value: string | undefined, lang: Language): string {
  if (!value) return lang === "fil" ? "Not recorded" : "Not recorded";
  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "released":
      return lang === "fil" ? "Released" : "Released";
    case "kept":
      return lang === "fil" ? "Kept" : "Kept";
    case "not recorded":
      return lang === "fil" ? "Not recorded" : "Not recorded";
    default:
      return value;
  }
}

export function getSpeciesDisplay(name: string | undefined, lang: Language): string {
  const trimmed = name?.trim();
  if (!trimmed || trimmed.toLowerCase() === "hindi pa natukoy" || trimmed.toLowerCase() === "unidentified") {
    return lang === "fil" ? "Hindi pa natukoy" : "Unidentified";
  }
  return trimmed;
}

export function getFisherTypeLabel(type: string | undefined, lang: Language): string {
  switch (type) {
    case "exploring":
      return lang === "fil" ? "Nag-e-explore pa lang" : "Just exploring";
    case "angler":
      return lang === "fil" ? "Recreational angler" : "Recreational angler";
    case "livelihood":
      return lang === "fil" ? "Mangingisdang pangkabuhayan" : "Livelihood / commercial fisher";
    case "both":
      return lang === "fil" ? "Angler at livelihood fisher" : "Both";
    default:
      return lang === "fil" ? "Preferences not set" : "Preferences not set";
  }
}

export function getPreferredWaterLabel(water: string | undefined, lang: Language): string {
  switch (water) {
    case "any":
      return lang === "fil" ? "Wala pang preference" : "No preference yet";
    case "saltwater":
      return lang === "fil" ? "Dagat o baybayin" : "Sea or coastal";
    case "freshwater":
      return lang === "fil" ? "Ilog o lawa" : "River or lake";
    case "brackish":
      return lang === "fil" ? "Brackish o estuary" : "Brackish or estuary";
    default:
      return lang === "fil" ? "Puwede mong itakda ang uri ng tubig na gusto mo." : "Set your water preference anytime.";
  }
}
