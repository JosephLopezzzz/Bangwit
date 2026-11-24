export type ActivityEventKind = "sunrise" | "sunset" | "moonrise" | "moonset";

export type ActivityEvent = {
  kind: ActivityEventKind;
  time: string;
};

export type MarineActivityForecast = {
  fetchedAt: string;
  modelLatitude: number;
  modelLongitude: number;
  hourly: Array<{
    time: string;
    seaLevel: number | null;
    waveHeight: number | null;
    currentSpeed: number | null;
  }>;
  events: ActivityEvent[];
};

type ApiRecord = Record<string, unknown>;

const LOCATION = { latitude: 14.783333, longitude: 120.683333 };

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null;
}

function numberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function nullableNumberArray(value: unknown): Array<number | null> {
  return Array.isArray(value) ? value.map(numberValue) : [];
}

async function fetchRecord(url: URL, signal?: AbortSignal): Promise<ApiRecord> {
  const response = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Forecast request failed (${response.status}).`);
  const data: unknown = await response.json();
  if (!isRecord(data) || data.error === true) throw new Error("Forecast data was unavailable.");
  return data;
}

function makeMarineUrl() {
  const url = new URL("https://marine-api.open-meteo.com/v1/marine");
  url.search = new URLSearchParams({
    latitude: String(LOCATION.latitude),
    longitude: String(LOCATION.longitude),
    hourly: "sea_level_height_msl,wave_height,ocean_current_velocity",
    forecast_hours: "48",
    timezone: "Asia/Manila",
    cell_selection: "sea",
  }).toString();
  return url;
}

function makeSunMoonUrl() {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(LOCATION.latitude),
    longitude: String(LOCATION.longitude),
    daily: "sunrise,sunset,moonrise,moonset",
    forecast_days: "2",
    timezone: "Asia/Manila",
  }).toString();
  return url;
}

export async function fetchMarineActivityForecast(signal?: AbortSignal): Promise<MarineActivityForecast> {
  const [marine, sunMoon] = await Promise.all([
    fetchRecord(makeMarineUrl(), signal),
    fetchRecord(makeSunMoonUrl(), signal),
  ]);
  const hourly = isRecord(marine.hourly) ? marine.hourly : null;
  const daily = isRecord(sunMoon.daily) ? sunMoon.daily : null;
  if (!hourly || !daily) throw new Error("Forecast data was missing hourly or daily conditions.");

  const times = stringArray(hourly.time);
  const seaLevels = nullableNumberArray(hourly.sea_level_height_msl);
  const waveHeights = nullableNumberArray(hourly.wave_height);
  const currentSpeeds = nullableNumberArray(hourly.ocean_current_velocity);
  if (!times.length || !seaLevels.length) throw new Error("No sea-level trend data was returned.");

  const dailyDates = stringArray(daily.time);
  const events: ActivityEvent[] = [];
  for (const kind of ["sunrise", "sunset", "moonrise", "moonset"] as const) {
    const values = stringArray(daily[kind]);
    values.forEach((time, index) => {
      if (time && dailyDates[index]) events.push({ kind, time });
    });
  }

  return {
    fetchedAt: new Date().toISOString(),
    modelLatitude: numberValue(marine.latitude) ?? LOCATION.latitude,
    modelLongitude: numberValue(marine.longitude) ?? LOCATION.longitude,
    hourly: times.map((time, index) => ({
      time,
      seaLevel: seaLevels[index] ?? null,
      waveHeight: waveHeights[index] ?? null,
      currentSpeed: currentSpeeds[index] ?? null,
    })),
    events,
  };
}

export function isMarineActivityForecast(value: unknown): value is MarineActivityForecast {
  return (
    isRecord(value) &&
    typeof value.fetchedAt === "string" &&
    typeof value.modelLatitude === "number" &&
    typeof value.modelLongitude === "number" &&
    Array.isArray(value.hourly) &&
    Array.isArray(value.events) &&
    value.hourly.every(
      (point) =>
        isRecord(point) &&
        typeof point.time === "string" &&
        (point.seaLevel === null || typeof point.seaLevel === "number") &&
        (point.waveHeight === null || typeof point.waveHeight === "number") &&
        (point.currentSpeed === null || typeof point.currentSpeed === "number"),
    ) &&
    value.events.every(
      (event) =>
        isRecord(event) &&
        typeof event.time === "string" &&
        (event.kind === "sunrise" || event.kind === "sunset" || event.kind === "moonrise" || event.kind === "moonset"),
    )
  );
}

export const MARINE_ACTIVITY_CACHE_KEY = "bangwit.fish-activity.marine.v1";
