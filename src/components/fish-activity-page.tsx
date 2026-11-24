"use client";

import {
  Activity,
  CalendarDays,
  CircleAlert,
  Clock3,
  Droplets,
  Fish,
  Moon,
  RefreshCw,
  Sun,
  Trash2,
  Waves,
} from "lucide-react";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useBangwit } from "@/components/bangwit-provider";
import { CatchDatePicker } from "@/components/catch-date-picker";
import { type DropdownOption, DropdownSelect } from "@/components/dropdown-select";
import {
  type ActivityEventKind,
  fetchMarineActivityForecast,
  isMarineActivityForecast,
  MARINE_ACTIVITY_CACHE_KEY,
  type MarineActivityForecast,
} from "@/lib/fish-activity";
import { listFishingTrips, removeFishingTrip, saveFishingTrip } from "@/lib/storage/catches";
import type { FishingTrip, FishingTripOutcome, FishingWaterType } from "@/types/fishing-trip";
import "./fish-activity.css";

type ActivityWindow = { start: number; end: number; cues: ActivityEventKind[] };
type ForecastStatus = "loading" | "ready" | "error";

const FRESH_FORECAST_MS = 60 * 60 * 1000;

function localDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function parseManilaTime(value: string) {
  return new Date(/(?:Z|[+-]\d{2}:\d{2})$/u.test(value) ? value : `${value}+08:00`).getTime();
}

function formatManilaTime(value: string | number, lang: "en" | "fil", options: Intl.DateTimeFormatOptions = {}) {
  const date = typeof value === "number" ? new Date(value) : new Date(parseManilaTime(value));
  return new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-PH", {
    timeZone: "Asia/Manila",
    hour: "numeric",
    minute: "2-digit",
    ...options,
  }).format(date);
}

function readForecastCache(): MarineActivityForecast | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(MARINE_ACTIVITY_CACHE_KEY) ?? "null");
    return isMarineActivityForecast(value) ? value : null;
  } catch {
    return null;
  }
}

function getActivityWindows(forecast: MarineActivityForecast | null, now: number): ActivityWindow[] {
  if (!forecast) return [];
  const windows = forecast.events
    .map((event) => {
      const eventTime = parseManilaTime(event.time);
      return { start: eventTime - 30 * 60 * 1000, end: eventTime + 30 * 60 * 1000, cues: [event.kind] };
    })
    .filter((window) => window.end >= now)
    .sort((a, b) => a.start - b.start);

  const merged: ActivityWindow[] = [];
  for (const window of windows) {
    const previous = merged.at(-1);
    if (previous && window.start <= previous.end + 5 * 60 * 1000) {
      previous.end = Math.max(previous.end, window.end);
      previous.cues = [...new Set([...previous.cues, ...window.cues])];
    } else {
      merged.push({ ...window });
    }
  }
  return merged.slice(0, 4);
}

function getCurrentMarinePoint(forecast: MarineActivityForecast | null, now: number) {
  if (!forecast?.hourly.length) return null;
  return (
    forecast.hourly.find((point) => parseManilaTime(point.time) >= now - 30 * 60 * 1000) ??
    forecast.hourly.at(-1) ??
    null
  );
}

function getSeaLevelTrend(forecast: MarineActivityForecast | null, now: number): "rising" | "falling" | "steady" {
  const points =
    forecast?.hourly.filter((point): point is typeof point & { seaLevel: number } => point.seaLevel !== null) ?? [];
  if (points.length < 2) return "steady";
  const start = points.findIndex((point) => parseManilaTime(point.time) >= now - 30 * 60 * 1000);
  const startIndex = Math.max(0, start);
  const end = points[Math.min(points.length - 1, startIndex + 3)];
  const delta = end.seaLevel - points[startIndex].seaLevel;
  if (delta > 0.03) return "rising";
  if (delta < -0.03) return "falling";
  return "steady";
}

function waterOptions(copy: ReturnType<typeof useBangwit>["dict"]["fishActivity"]): DropdownOption[] {
  return [
    { value: "sea", label: copy.waterTypes.sea, icon: Waves },
    { value: "lake", label: copy.waterTypes.lake, icon: Droplets },
    { value: "river", label: copy.waterTypes.river, icon: Activity },
  ];
}

function outcomeOptions(copy: ReturnType<typeof useBangwit>["dict"]["fishActivity"]): DropdownOption[] {
  return [
    { value: "no-bites", label: copy.outcomes.noBites, icon: CircleAlert },
    { value: "bites", label: copy.outcomes.bites, icon: Activity },
    { value: "caught-fish", label: copy.outcomes.caughtFish, icon: Fish },
    { value: "not-recorded", label: copy.outcomes.notRecorded, icon: Clock3 },
  ];
}

function outcomeLabel(outcome: FishingTripOutcome, copy: ReturnType<typeof useBangwit>["dict"]["fishActivity"]) {
  if (outcome === "no-bites") return copy.outcomes.noBites;
  if (outcome === "caught-fish") return copy.outcomes.caughtFish;
  if (outcome === "not-recorded") return copy.outcomes.notRecorded;
  return copy.outcomes.bites;
}

export function FishActivityPage() {
  const { dict, lang, showMessage } = useBangwit();
  const copy = dict.fishActivity;
  const [waterType, setWaterType] = useState<FishingWaterType>("sea");
  const [forecast, setForecast] = useState<MarineActivityForecast | null>(null);
  const [forecastStatus, setForecastStatus] = useState<ForecastStatus>("loading");
  const [forecastIsStale, setForecastIsStale] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [trips, setTrips] = useState<FishingTrip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [savingTrip, setSavingTrip] = useState(false);
  const [tripError, setTripError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(() => localDateString());
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("08:00");
  const [targetSpecies, setTargetSpecies] = useState("");
  const [method, setMethod] = useState("");
  const [outcome, setOutcome] = useState<FishingTripOutcome>("not-recorded");
  const [biteCount, setBiteCount] = useState("");
  const [notes, setNotes] = useState("");
  const waterTypeOptions = useMemo(() => waterOptions(copy), [copy]);
  const tripOutcomeOptions = useMemo(() => outcomeOptions(copy), [copy]);
  const activityWindows = useMemo(() => getActivityWindows(forecast, now), [forecast, now]);
  const currentPoint = useMemo(() => getCurrentMarinePoint(forecast, now), [forecast, now]);
  const seaLevelTrend = useMemo(() => getSeaLevelTrend(forecast, now), [forecast, now]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (waterType !== "sea") return;
    const controller = new AbortController();
    const cached = readForecastCache();
    if (cached) {
      setForecast(cached);
      setForecastStatus("ready");
      setForecastIsStale(Date.now() - new Date(cached.fetchedAt).getTime() > FRESH_FORECAST_MS);
    } else {
      setForecast(null);
      setForecastStatus("loading");
      setForecastIsStale(false);
    }
    if (cached && Date.now() - new Date(cached.fetchedAt).getTime() <= FRESH_FORECAST_MS && refreshKey === 0) {
      setRefreshing(false);
      return () => controller.abort();
    }
    setRefreshing(true);
    void fetchMarineActivityForecast(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setForecast(data);
        setForecastStatus("ready");
        setForecastIsStale(false);
        try {
          localStorage.setItem(MARINE_ACTIVITY_CACHE_KEY, JSON.stringify(data));
        } catch {
          // A successful live forecast remains usable when local storage is unavailable.
        }
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        if (cached) {
          setForecastIsStale(true);
          setForecastStatus("ready");
        } else {
          setForecastStatus("error");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setRefreshing(false);
      });
    return () => controller.abort();
  }, [waterType, refreshKey]);

  const refreshForecast = useCallback(() => setRefreshKey((value) => value + 1), []);

  const loadTrips = useCallback(async () => {
    setTripsLoading(true);
    try {
      const savedTrips = await listFishingTrips();
      setTrips(savedTrips.sort((a, b) => `${b.date}T${b.startTime}`.localeCompare(`${a.date}T${a.startTime}`)));
    } catch {
      setTripError(copy.saveError);
    } finally {
      setTripsLoading(false);
    }
  }, [copy.saveError]);

  useEffect(() => {
    void loadTrips();
  }, [loadTrips]);

  async function handleSaveTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTripError("");
    if (!location.trim()) {
      setTripError(copy.locationRequired);
      return;
    }
    if (endTime <= startTime) {
      setTripError(copy.timeRangeInvalid);
      return;
    }
    const count = biteCount.trim() ? Number(biteCount) : null;
    if (count !== null && (!Number.isSafeInteger(count) || count < 0)) return;

    setSavingTrip(true);
    const trip: FishingTrip = {
      waterType,
      date,
      startTime,
      endTime,
      location: location.trim(),
      targetSpecies: targetSpecies.trim(),
      method: method.trim(),
      outcome,
      biteCount: count,
      notes: notes.trim(),
      savedAt: new Date().toISOString(),
    };
    try {
      await saveFishingTrip(trip);
      await loadTrips();
      setLocation("");
      setTargetSpecies("");
      setMethod("");
      setOutcome("not-recorded");
      setBiteCount("");
      setNotes("");
      showMessage(copy.tripSaved);
    } catch {
      setTripError(copy.saveError);
    } finally {
      setSavingTrip(false);
    }
  }

  async function handleRemoveTrip(id: number | undefined) {
    if (typeof id !== "number" || !window.confirm(copy.deleteConfirm)) return;
    try {
      await removeFishingTrip(id);
      await loadTrips();
    } catch {
      setTripError(copy.saveError);
    }
  }

  return (
    <main className="fish-activity-page">
      <header className="fish-activity-hero">
        <p className="fish-activity-eyebrow">{copy.tag}</p>
        <div className="fish-activity-title-row">
          <span className="fish-activity-mark" aria-hidden="true">
            <Activity size={22} />
          </span>
          <h1>{copy.title}</h1>
        </div>
        <p>{copy.description}</p>
      </header>

      <section className="ui-card fish-activity-water-picker" aria-label={copy.waterTypeLabel}>
        <DropdownSelect
          id="fish-activity-water-type"
          label={copy.waterTypeLabel}
          value={waterType}
          options={waterTypeOptions}
          onValueChange={(value) => {
            if (value === "sea" || value === "lake" || value === "river") {
              setWaterType(value);
              setRefreshKey(0);
            }
          }}
          className="fish-activity-water-select"
        />
        <p className="fish-activity-coverage-label">{copy.coverageTitle}</p>
        <p className="fish-activity-coverage-copy">
          {waterType === "sea" ? copy.seaCoverage : copy.freshwaterCoverage}
        </p>
      </section>

      {waterType === "sea" && (
        <section className="ui-card fish-activity-forecast" aria-labelledby="fish-activity-timing-heading">
          <div className="fish-activity-section-heading">
            <div>
              <p className="fish-activity-section-tag">
                <Sun size={14} aria-hidden="true" /> {copy.windowLabel}
              </p>
              <h2 id="fish-activity-timing-heading">{copy.timingTitle}</h2>
            </div>
            <button
              type="button"
              className="ui-button ui-button--secondary fish-activity-refresh"
              onClick={refreshForecast}
              disabled={refreshing}
            >
              <RefreshCw size={15} aria-hidden="true" className={refreshing ? "fish-activity-spin" : ""} />
              {refreshing ? copy.refreshing : copy.refresh}
            </button>
          </div>
          <p className="fish-activity-muted">{copy.timingDescription}</p>
          {forecastStatus === "loading" && (
            <p className="fish-activity-status" role="status">
              {copy.loading}
            </p>
          )}
          {forecastStatus === "error" && (
            <div className="fish-activity-alert" role="status">
              <CircleAlert size={18} aria-hidden="true" />
              <span>{copy.loadError}</span>
            </div>
          )}
          {forecastIsStale && (
            <p className="fish-activity-stale" role="status">
              {copy.stale}
            </p>
          )}
          {forecast && (
            <>
              <div className="fish-activity-window-grid">
                {activityWindows.length === 0 && <p className="fish-activity-empty">{copy.noWindows}</p>}
                {activityWindows.map((window) => (
                  <article className="fish-activity-window" key={window.start}>
                    <span className="fish-activity-window-icon" aria-hidden="true">
                      {window.cues.some((cue) => cue.startsWith("moon")) ? <Moon size={18} /> : <Sun size={18} />}
                    </span>
                    <div>
                      <p className="fish-activity-window-label">
                        {window.cues.map((cue) => copy.cues[cue]).join(" + ")}
                      </p>
                      <p className="fish-activity-window-time">
                        {formatManilaTime(window.start, lang)}–{formatManilaTime(window.end, lang)}
                      </p>
                      <p className="fish-activity-window-date">
                        {formatManilaTime(window.start, lang, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: undefined,
                          minute: undefined,
                        })}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="fish-activity-conditions">
                <div className="fish-activity-section-heading fish-activity-conditions-heading">
                  <div>
                    <p className="fish-activity-section-tag">
                      <Waves size={14} aria-hidden="true" /> {copy.coverageTitle}
                    </p>
                    <h3>{copy.conditionsTitle}</h3>
                  </div>
                  {forecastStatus === "ready" && (
                    <span className="fish-activity-updated">
                      {copy.updatedAt} {formatManilaTime(forecast.fetchedAt, lang)}
                    </span>
                  )}
                </div>
                <div className="fish-activity-metric-grid">
                  <article className="fish-activity-metric">
                    <span className="fish-activity-metric-label">{copy.seaLevelTrend}</span>
                    <strong>{copy[seaLevelTrend]}</strong>
                  </article>
                  <article className="fish-activity-metric">
                    <span className="fish-activity-metric-label">{copy.waveHeight}</span>
                    <strong>
                      {currentPoint?.waveHeight === null || currentPoint?.waveHeight === undefined
                        ? "—"
                        : `${currentPoint.waveHeight.toFixed(1)} m`}
                    </strong>
                  </article>
                  <article className="fish-activity-metric">
                    <span className="fish-activity-metric-label">{copy.currentSpeed}</span>
                    <strong>
                      {currentPoint?.currentSpeed === null || currentPoint?.currentSpeed === undefined
                        ? "—"
                        : `${currentPoint.currentSpeed.toFixed(1)} km/h`}
                    </strong>
                  </article>
                </div>
                <p className="fish-activity-muted fish-activity-model-cell">
                  {copy.modelCell}: {forecast.modelLatitude.toFixed(3)}, {forecast.modelLongitude.toFixed(3)}
                </p>
              </div>
            </>
          )}
          <p className="fish-activity-footnote">{copy.estimateNote}</p>
          <p className="fish-activity-footnote fish-activity-safety-note">{copy.safetyNote}</p>
          <p className="fish-activity-attribution">
            <a href="https://open-meteo.com/en/docs/marine-weather-api" target="_blank" rel="noreferrer">
              {copy.attribution}
            </a>
            {" · "}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
              {copy.dataLicense}
            </a>
          </p>
        </section>
      )}

      <section className="ui-card fish-activity-log" aria-labelledby="fish-activity-log-heading">
        <div className="fish-activity-section-heading">
          <div>
            <p className="fish-activity-section-tag">
              <CalendarDays size={14} aria-hidden="true" /> {copy.waterTypes[waterType]}
            </p>
            <h2 id="fish-activity-log-heading">{copy.logTitle}</h2>
          </div>
        </div>
        <p className="fish-activity-muted">{copy.logDescription}</p>
        <form className="fish-activity-form" onSubmit={handleSaveTrip}>
          <label className="fish-activity-field fish-activity-field--wide">
            <span>{copy.locationLabel}</span>
            <input
              className="ui-input"
              required
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder={copy.locationPlaceholder}
              maxLength={120}
            />
          </label>
          <div className="fish-activity-field">
            <label htmlFor="fish-activity-trip-date">{copy.dateLabel}</label>
            <CatchDatePicker
              id="fish-activity-trip-date"
              value={date}
              onChange={setDate}
              lang={lang}
              showToday={false}
              portal
            />
          </div>
          <label className="fish-activity-field">
            <span>{copy.startTimeLabel}</span>
            <input
              className="ui-input"
              type="time"
              required
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </label>
          <label className="fish-activity-field">
            <span>{copy.endTimeLabel}</span>
            <input
              className="ui-input"
              type="time"
              required
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
            />
          </label>
          <label className="fish-activity-field">
            <span>{copy.targetSpeciesLabel}</span>
            <input
              className="ui-input"
              value={targetSpecies}
              onChange={(event) => setTargetSpecies(event.target.value)}
              placeholder={copy.targetSpeciesPlaceholder}
              maxLength={100}
            />
          </label>
          <label className="fish-activity-field">
            <span>{copy.methodLabel}</span>
            <input
              className="ui-input"
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              placeholder={copy.methodPlaceholder}
              maxLength={100}
            />
          </label>
          <div className="fish-activity-field">
            <DropdownSelect
              id="fish-activity-outcome"
              label={copy.outcomeLabel}
              value={outcome}
              options={tripOutcomeOptions}
              onValueChange={(value) => {
                if (value === "no-bites" || value === "bites" || value === "caught-fish" || value === "not-recorded") {
                  setOutcome(value);
                }
              }}
            />
          </div>
          <label className="fish-activity-field">
            <span>{copy.biteCountLabel}</span>
            <input
              className="ui-input"
              type="number"
              min="0"
              step="1"
              value={biteCount}
              onChange={(event) => setBiteCount(event.target.value)}
            />
          </label>
          <label className="fish-activity-field fish-activity-field--wide">
            <span>{copy.notesLabel}</span>
            <textarea
              className="ui-input fish-activity-notes-input"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={copy.notesPlaceholder}
              maxLength={1000}
              rows={3}
            />
          </label>
          {tripError && (
            <p className="fish-activity-form-error" role="alert">
              {tripError}
            </p>
          )}
          <div className="fish-activity-form-actions">
            <span className="fish-activity-private-note">{dict.common.privateDeviceOnly}</span>
            <button type="submit" className="ui-button" disabled={savingTrip}>
              {savingTrip ? copy.savingTrip : copy.saveTrip}
            </button>
          </div>
        </form>
      </section>

      <section className="ui-card fish-activity-history" aria-labelledby="fish-activity-history-heading">
        <div className="fish-activity-section-heading">
          <div>
            <p className="fish-activity-section-tag">
              <Clock3 size={14} aria-hidden="true" /> {copy.logTitle}
            </p>
            <h2 id="fish-activity-history-heading">{copy.historyTitle}</h2>
          </div>
        </div>
        {tripsLoading ? (
          <p className="fish-activity-muted" role="status">
            {copy.loading}
          </p>
        ) : trips.length === 0 ? (
          <p className="fish-activity-empty">{copy.emptyHistory}</p>
        ) : (
          <div className="fish-activity-trip-list">
            {trips.slice(0, 20).map((trip) => (
              <article className="fish-activity-trip" key={trip.id}>
                <div className="fish-activity-trip-heading">
                  <div>
                    <p className="fish-activity-trip-date">
                      {formatManilaTime(`${trip.date}T12:00`, lang, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: undefined,
                        minute: undefined,
                      })}
                      <span>
                        {" "}
                        · {trip.startTime}–{trip.endTime}
                      </span>
                    </p>
                    <h3>{trip.location}</h3>
                  </div>
                  <button
                    type="button"
                    className="fish-activity-delete"
                    onClick={() => void handleRemoveTrip(trip.id)}
                    aria-label={`${copy.removeTrip}: ${trip.location}, ${trip.date}`}
                    title={copy.removeTrip}
                  >
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                </div>
                <div className="fish-activity-trip-meta">
                  <span>{copy.waterTypes[trip.waterType]}</span>
                  <span>
                    {copy.tripOutcome}: {outcomeLabel(trip.outcome, copy)}
                  </span>
                  {trip.biteCount !== null && (
                    <span>
                      {copy.biteCountLabel}: {trip.biteCount}
                    </span>
                  )}
                </div>
                <p className="fish-activity-trip-detail">
                  <strong>{copy.tripTarget}:</strong> {trip.targetSpecies || copy.noTargetRecorded}
                </p>
                {trip.method && (
                  <p className="fish-activity-trip-detail">
                    <strong>{copy.tripMethod}:</strong> {trip.method}
                  </p>
                )}
                {trip.notes && (
                  <p className="fish-activity-trip-detail">
                    <strong>{copy.tripNotes}:</strong> {trip.notes}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
