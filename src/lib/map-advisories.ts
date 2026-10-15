export const HAZARD_TYPES = ["rainfall", "thunderstorm", "wind", "flood", "marine"] as const;
export type HazardType = (typeof HAZARD_TYPES)[number];
export type WarningLevel = "advisory" | "warning" | "emergency";
export type AdvisoryText = { en: string; fil: string };

export type MapAdvisory = {
  id: string;
  sourceId: string;
  hazard: HazardType;
  level: WarningLevel;
  officialLevel: string;
  title: AdvisoryText;
  description: AdvisoryText;
  instruction: AdvisoryText;
  areas: { provinceId: string; scope: "province" | "partial" | "coastal"; localities: string[] }[];
  issuedAt: string;
  effectiveAt: string;
  expiresAt: string;
  sourceUrl: string;
  status: "active" | "cancelled";
  supersedes: string[];
};

export type AdvisorySource = {
  id: string;
  name: string;
  url: string;
  provinceIds: string[];
  hazards: HazardType[];
  checkedAt: string;
  status: "ok" | "unavailable";
};

export type AdvisorySnapshot = {
  version: 1;
  mode: "live" | "demo";
  generatedAt: string;
  sources: AdvisorySource[];
  alerts: MapAdvisory[];
};

export type ProvinceWarning = {
  level: WarningLevel | "clear" | "unknown";
  alerts: MapAdvisory[];
  stale: boolean;
  complete: boolean;
};

export const ADVISORY_FRESHNESS_MS = 10 * 60 * 1000;
export const PUBLIC_ADVISORY_CACHE_KEY = "bangwit.public-advisories.v1";
export const WARNING_RANK = { advisory: 1, warning: 2, emergency: 3 } as const;

export function mergeAdvisorySnapshots(
  previous: AdvisorySnapshot | null,
  next: AdvisorySnapshot,
  now: number,
): AdvisorySnapshot {
  if (!previous) return next;
  if (previous.mode !== next.mode) throw new Error("Advisory modes cannot be mixed");
  if (Date.parse(next.generatedAt) < Date.parse(previous.generatedAt)) {
    throw new Error("Advisory snapshot moved backwards");
  }
  const sources = [...next.sources];
  const alerts = new Map(next.alerts.map((alert) => [alert.id, alert]));
  for (const source of previous.sources) {
    const replacement = next.sources.find((item) => item.id === source.id);
    const healthy =
      replacement?.status === "ok" &&
      Date.parse(replacement.checkedAt) <= now &&
      Date.parse(replacement.checkedAt) >= Date.parse(source.checkedAt) &&
      now - Date.parse(replacement.checkedAt) <= ADVISORY_FRESHNESS_MS &&
      source.provinceIds.every((id) => replacement.provinceIds.includes(id)) &&
      source.hazards.every((hazard) => replacement.hazards.includes(hazard));
    if (healthy) continue;
    if (!replacement) sources.push({ ...source, status: "unavailable" });
    else {
      sources[sources.findIndex((item) => item.id === source.id)] = {
        ...source,
        status: "unavailable",
      };
    }
    // An incomplete/regressed source cannot cancel or downgrade its last accepted publication.
    for (const [id, alert] of alerts) {
      if (alert.sourceId === source.id) alerts.delete(id);
    }
    for (const alert of previous.alerts.filter((item) => item.sourceId === source.id)) {
      alerts.set(alert.id, alert);
    }
  }
  return { ...next, sources, alerts: [...alerts.values()] };
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown, max = 1500): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

function date(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value.slice(0, 10)).toISOString().slice(0, 10) === value.slice(0, 10) &&
    Number(value.slice(11, 13)) < 24 &&
    Number(value.slice(14, 16)) < 60 &&
    Number(value.slice(17, 19)) < 60
  );
}

function translated(value: unknown): value is AdvisoryText {
  return record(value) && text(value.en) && text(value.fil);
}

function strings(value: unknown, max = 100): value is string[] {
  return Array.isArray(value) && value.length <= max && value.every((item) => text(item, 200));
}

export function isOfficialAdvisoryUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      (url.hostname === "pagasa.dost.gov.ph" || url.hostname.endsWith(".pagasa.dost.gov.ph"))
    );
  } catch {
    return false;
  }
}

/** Reject a whole malformed snapshot; never convert a parse error into an empty warning list. */
export function parseAdvisorySnapshot(
  input: unknown,
  provinceIds: readonly string[],
  expectedMode: "live" | "demo" = "live",
): AdvisorySnapshot {
  const fail = () => {
    throw new Error("Invalid advisory snapshot");
  };
  if (
    !record(input) ||
    input.version !== 1 ||
    input.mode !== expectedMode ||
    !date(input.generatedAt) ||
    !Array.isArray(input.sources) ||
    input.sources.length === 0 ||
    input.sources.length > 30 ||
    !Array.isArray(input.alerts) ||
    input.alerts.length > 500
  )
    return fail();

  const knownProvinces = new Set(provinceIds);
  const sourceIds = new Set<string>();
  for (const source of input.sources) {
    if (
      !record(source) ||
      !text(source.id, 200) ||
      sourceIds.has(source.id) ||
      !text(source.name, 200) ||
      !isOfficialAdvisoryUrl(source.url) ||
      !date(source.checkedAt) ||
      Date.parse(source.checkedAt) > Date.parse(input.generatedAt) ||
      !strings(source.provinceIds) ||
      source.provinceIds.length === 0 ||
      source.provinceIds.some((id) => !knownProvinces.has(id)) ||
      !Array.isArray(source.hazards) ||
      source.hazards.length === 0 ||
      !source.hazards.every((hazard) => HAZARD_TYPES.includes(hazard)) ||
      !["ok", "unavailable"].includes(String(source.status))
    )
      return fail();
    sourceIds.add(source.id);
  }

  const alertIds = new Set<string>();
  for (const alert of input.alerts) {
    if (
      !record(alert) ||
      !text(alert.id, 200) ||
      alertIds.has(alert.id) ||
      !text(alert.sourceId, 200) ||
      !sourceIds.has(alert.sourceId) ||
      !HAZARD_TYPES.includes(alert.hazard as HazardType) ||
      !["advisory", "warning", "emergency"].includes(String(alert.level)) ||
      !text(alert.officialLevel, 200) ||
      !translated(alert.title) ||
      !translated(alert.description) ||
      !translated(alert.instruction) ||
      !isOfficialAdvisoryUrl(alert.sourceUrl) ||
      !date(alert.issuedAt) ||
      !date(alert.effectiveAt) ||
      !date(alert.expiresAt) ||
      Date.parse(alert.issuedAt) > Date.parse(input.generatedAt) ||
      Date.parse(alert.issuedAt) > Date.parse(alert.effectiveAt) ||
      Date.parse(alert.effectiveAt) >= Date.parse(alert.expiresAt) ||
      !["active", "cancelled"].includes(String(alert.status)) ||
      !strings(alert.supersedes, 100) ||
      alert.supersedes.includes(alert.id) ||
      !Array.isArray(alert.areas) ||
      alert.areas.length === 0 ||
      alert.areas.length > 100
    )
      return fail();

    const source = input.sources.find((item) => item.id === alert.sourceId);
    if (!source.hazards.includes(alert.hazard) || Date.parse(alert.issuedAt) > Date.parse(source.checkedAt))
      return fail();
    for (const area of alert.areas) {
      if (
        !record(area) ||
        !text(area.provinceId, 200) ||
        !knownProvinces.has(area.provinceId) ||
        !source.provinceIds.includes(area.provinceId) ||
        !["province", "partial", "coastal"].includes(String(area.scope)) ||
        !strings(area.localities) ||
        (area.scope !== "province" && area.localities.length === 0)
      )
        return fail();
    }
    alertIds.add(alert.id);
  }
  // Copy only public contract fields rather than forwarding unknown provider properties.
  const validated = input as AdvisorySnapshot;
  const byId = new Map(validated.alerts.map((alert) => [alert.id, alert]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const checkReferences = (alert: MapAdvisory) => {
    if (visiting.has(alert.id)) return fail();
    if (visited.has(alert.id)) return;
    visiting.add(alert.id);
    for (const id of alert.supersedes) {
      const referenced = byId.get(id);
      if (referenced?.sourceId === alert.sourceId) checkReferences(referenced);
    }
    visiting.delete(alert.id);
    visited.add(alert.id);
  };
  for (const alert of validated.alerts) checkReferences(alert);
  return {
    version: 1,
    mode: validated.mode,
    generatedAt: validated.generatedAt,
    sources: validated.sources.map(({ id, name, url, provinceIds: ids, hazards, checkedAt, status }) => ({
      id,
      name,
      url,
      provinceIds: ids,
      hazards,
      checkedAt,
      status,
    })),
    alerts: validated.alerts.map((alert) => ({
      id: alert.id,
      sourceId: alert.sourceId,
      hazard: alert.hazard,
      level: alert.level,
      officialLevel: alert.officialLevel,
      title: { en: alert.title.en, fil: alert.title.fil },
      description: { en: alert.description.en, fil: alert.description.fil },
      instruction: { en: alert.instruction.en, fil: alert.instruction.fil },
      areas: alert.areas.map(({ provinceId, scope, localities }) => ({ provinceId, scope, localities })),
      issuedAt: alert.issuedAt,
      effectiveAt: alert.effectiveAt,
      expiresAt: alert.expiresAt,
      sourceUrl: alert.sourceUrl,
      status: alert.status,
      supersedes: alert.supersedes,
    })),
  };
}

export function getProvinceWarning(
  snapshot: AdvisorySnapshot | null,
  provinceId: string,
  now: number,
  connectionUnavailable = false,
  hazard: HazardType | "all" = "all",
): ProvinceWarning {
  if (!snapshot) return { level: "unknown", alerts: [], stale: false, complete: false };
  const sources = snapshot.sources.filter((source) => source.provinceIds.includes(provinceId));
  const isFresh = (time: string) => now >= Date.parse(time) && now - Date.parse(time) <= ADVISORY_FRESHNESS_MS;
  const snapshotFresh = !connectionUnavailable && isFresh(snapshot.generatedAt);
  const freshSources = sources.filter((source) => source.status === "ok" && isFresh(source.checkedAt));
  const hazardsChecked = new Set(freshSources.flatMap((source) => source.hazards));
  const complete =
    snapshotFresh && freshSources.length === sources.length && HAZARD_TYPES.every((type) => hazardsChecked.has(type));
  const issued = snapshot.alerts.filter((alert) => Date.parse(alert.issuedAt) <= now);
  const superseded = new Set(
    issued
      .filter((alert) => Date.parse(alert.effectiveAt) <= now)
      .flatMap((alert) => alert.supersedes.map((id) => `${alert.sourceId}:${id}`)),
  );
  const candidates = issued
    .filter(
      (alert) =>
        alert.status === "active" &&
        !superseded.has(`${alert.sourceId}:${alert.id}`) &&
        Date.parse(alert.effectiveAt) <= now &&
        alert.areas.some((area) => area.provinceId === provinceId) &&
        (hazard === "all" || hazard === alert.hazard),
    )
    .sort((a, b) => WARNING_RANK[b.level] - WARNING_RANK[a.level] || Date.parse(b.issuedAt) - Date.parse(a.issuedAt));
  const stale = !snapshotFresh || (sources.length > 0 && freshSources.length !== sources.length);
  const alerts = candidates.filter((alert) => {
    const sourceFresh = freshSources.some((source) => source.id === alert.sourceId);
    return Date.parse(alert.expiresAt) > now || stale || !sourceFresh;
  });
  if (alerts.length) {
    return {
      level: alerts[0].level,
      alerts,
      stale: stale || alerts.some((alert) => Date.parse(alert.expiresAt) <= now),
      complete,
    };
  }
  return { level: complete ? "clear" : "unknown", alerts: [], stale, complete };
}
