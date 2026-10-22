export type HistoricalEvidenceFilter = {
  query: string;
  locality: "all" | "limbones-cove" | "cavite-manila-bay";
  date: "all" | "dated" | "undated";
};

export type HistoricalEvidenceRecord = {
  acceptedName: string;
  recordedName: string;
  acceptedTaxonId: string;
  localityGroup: string;
  collectedOn: string | null;
};

export function normaliseSpeciesSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase();
}

export function filterSpeciesNameAssertions<T extends { scientificName: string; recordedName: string }>(
  records: readonly T[],
  query: string,
) {
  const normalized = normaliseSpeciesSearch(query);
  return records.filter(
    (record) =>
      !normalized ||
      normaliseSpeciesSearch(record.scientificName).includes(normalized) ||
      normaliseSpeciesSearch(record.recordedName).includes(normalized),
  );
}

export const filterTaalChecklist = filterSpeciesNameAssertions;

export function filterHistoricalEvidence<T extends HistoricalEvidenceRecord>(
  records: readonly T[],
  filters: HistoricalEvidenceFilter,
) {
  const query = normaliseSpeciesSearch(filters.query);

  return records.filter((record) => {
    const matchesQuery =
      !query ||
      normaliseSpeciesSearch(record.acceptedName).includes(query) ||
      normaliseSpeciesSearch(record.recordedName).includes(query);
    const matchesLocality = filters.locality === "all" || record.localityGroup === filters.locality;
    const matchesDate =
      filters.date === "all" ||
      (filters.date === "dated" && record.collectedOn !== null) ||
      (filters.date === "undated" && record.collectedOn === null);

    return matchesQuery && matchesLocality && matchesDate;
  });
}

export function countEvidenceSpecies(records: readonly HistoricalEvidenceRecord[]) {
  return new Set(records.map((record) => record.acceptedTaxonId)).size;
}

export type FeedingGuideFilter = {
  query: string;
  foodCategory: string;
};

export type FeedingGuide = {
  scientificName: string;
  commonName: { en: string; fil: string };
  summary: { en: string; fil: string };
  studyContext: { en: string; fil: string };
  foods: { category: string; en: string; fil: string }[];
};

export function filterFeedingGuides<T extends FeedingGuide>(guides: readonly T[], filters: FeedingGuideFilter) {
  const query = normaliseSpeciesSearch(filters.query);

  return guides.filter((guide) => {
    const searchable = [
      guide.scientificName,
      guide.commonName.en,
      guide.commonName.fil,
      ...guide.foods.flatMap((food) => [food.en, food.fil]),
    ]
      .map(normaliseSpeciesSearch)
      .join(" ");
    const matchesQuery = !query || searchable.includes(query);
    const matchesFood =
      filters.foodCategory === "all" || guide.foods.some((food) => food.category === filters.foodCategory);
    return matchesQuery && matchesFood;
  });
}
