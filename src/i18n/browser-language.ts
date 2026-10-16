import type { Language } from "./types";

export function getBrowserPreferredLanguage(languages: readonly string[]): Language {
  for (const language of languages) {
    const baseLanguage = language.trim().toLowerCase().split(/[-_]/, 1)[0];
    if (baseLanguage === "en") return "en";
    if (baseLanguage === "fil" || baseLanguage === "tl") return "fil";
  }

  return "fil";
}
