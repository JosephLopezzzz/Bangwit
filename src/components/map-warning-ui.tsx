"use client";

import {
  ArrowUpRight,
  CloudLightning,
  CloudRain,
  FlaskConical,
  Layers,
  RefreshCw,
  ShieldAlert,
  TriangleAlert,
  Waves,
  Wind,
  X,
} from "lucide-react";
import { useBangwit } from "@/components/bangwit-provider";
import { DropdownSelect } from "@/components/dropdown-select";
import type { AdvisoryDemoScenario } from "@/data/map-advisory-demo";
import type { AdvisorySnapshot, HazardType, MapAdvisory, ProvinceWarning } from "@/lib/map-advisories";

export const hazardIcons = {
  rainfall: CloudRain,
  thunderstorm: CloudLightning,
  wind: Wind,
  flood: Waves,
  marine: Waves,
};

export function advisoryTime(time: string, lang: "fil" | "en") {
  return new Intl.DateTimeFormat(lang === "fil" ? "fil-PH" : "en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(time));
}

export function WarningToolbar({
  demo,
  onDemoChange,
  connection,
  refreshing,
  onRefresh,
  snapshot,
}: {
  demo: AdvisoryDemoScenario | null;
  onDemoChange: (scenario: AdvisoryDemoScenario | null) => void;
  connection: "loading" | "ready" | "unavailable" | "offline";
  refreshing: boolean;
  onRefresh: () => void;
  snapshot: AdvisorySnapshot | null;
}) {
  const { dict, lang } = useBangwit();
  const copy = dict.mapWarnings;
  const stateLabel = demo
    ? copy.demoBadge
    : {
        loading: copy.loading,
        ready: copy.connected,
        unavailable: copy.unavailable,
        offline: copy.offline,
      }[connection];
  return (
    <div className="map-warning-toolbar" data-demo={Boolean(demo)}>
      <div className="map-warning-feed" role="status" aria-live="polite">
        <strong>
          <ShieldAlert aria-hidden="true" size={17} />
          {stateLabel}
        </strong>
        <p>
          {demo
            ? copy.demoDescription
            : connection === "ready"
              ? copy.connectedDescription
              : snapshot
                ? copy.lastKnownDescription
                : copy.unavailableDescription}
        </p>
        {!demo && snapshot && (
          <small>
            {copy.lastChecked}: {advisoryTime(snapshot.generatedAt, lang)} · PHT
          </small>
        )}
      </div>
      <div className="map-warning-actions">
        {demo ? (
          <>
            <DropdownSelect
              id="warning-demo-scenario"
              label={copy.scenario}
              value={demo}
              options={Object.entries(copy.scenarios).map(([value, label]) => ({ value, label, icon: FlaskConical }))}
              onValueChange={(value) => onDemoChange(value as AdvisoryDemoScenario)}
              className="dropdown-select--compact"
            />
            <button type="button" className="ui-button ui-button--secondary" onClick={() => onDemoChange(null)}>
              {copy.exitPreview}
            </button>
          </>
        ) : (
          <>
            <button type="button" className="ui-button ui-button--secondary" onClick={() => onDemoChange("warnings")}>
              <FlaskConical aria-hidden="true" size={15} />
              {copy.preview}
            </button>
            <button
              type="button"
              className="ui-button ui-button--secondary map-warning-refresh"
              onClick={onRefresh}
              disabled={refreshing}
              aria-label={refreshing ? copy.refreshing : copy.refresh}
              title={copy.refresh}
            >
              <RefreshCw aria-hidden="true" size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function WarningLegend({
  filter,
  onFilterChange,
  count,
  stale,
  available,
  filteredCount,
  calloutHidden,
  onRestoreCallout,
}: {
  filter: HazardType | "all";
  onFilterChange: (filter: HazardType | "all") => void;
  count: number;
  stale: boolean;
  available: boolean;
  filteredCount: number;
  calloutHidden: boolean;
  onRestoreCallout: () => void;
}) {
  const { dict } = useBangwit();
  const copy = dict.mapWarnings;
  return (
    <div className="map-warning-legend">
      <div className="map-warning-filter-row">
        <p>
          <TriangleAlert aria-hidden="true" size={15} />
          {available ? copy.count(count) : copy.coverageUnavailable}
          {stale && <span>{copy.stale}</span>}
          {filter !== "all" && filteredCount === 0 && <span>{copy.noMatches}</span>}
        </p>
        {calloutHidden && (
          <button type="button" className="ui-button ui-button--secondary" onClick={onRestoreCallout}>
            {copy.showWarningCard}
          </button>
        )}
        <DropdownSelect
          id="map-hazard-filter"
          label={copy.filter}
          value={filter}
          options={Object.entries(copy.hazards).map(([value, label]) => ({
            value,
            label,
            icon: value === "all" ? Layers : hazardIcons[value as HazardType],
          }))}
          onValueChange={(value) => onFilterChange(value as HazardType | "all")}
          className="dropdown-select--compact"
        />
      </div>
      <ul aria-label={copy.legend}>
        {Object.entries(copy.levels).map(([level, label]) => (
          <li key={level}>
            <span className="map-warning-swatch" data-level={level} aria-hidden="true" />
            {filter !== "all" && level === "clear" ? copy.noMatches : label}
          </li>
        ))}
        <li>
          <span className="map-warning-swatch map-warning-swatch--stale" aria-hidden="true" />
          {copy.lastKnown}
        </li>
      </ul>
      <p className="map-warning-legend-note">{filter === "all" ? copy.legendNote : copy.filterNotice}</p>
    </div>
  );
}

export function WarningDetails({
  warning,
  provinceId,
  snapshot,
  demo,
}: {
  warning: ProvinceWarning;
  provinceId: string;
  snapshot: AdvisorySnapshot | null;
  demo: boolean;
}) {
  const { dict, lang } = useBangwit();
  const copy = dict.mapWarnings;
  return (
    <section className="map-warning-details" aria-labelledby="province-warning-heading">
      <h3 id="province-warning-heading">
        <ShieldAlert aria-hidden="true" size={17} />
        {copy.heading}
      </h3>
      {demo && <p className="map-warning-demo-label">{copy.demoBadge}</p>}
      {warning.stale && (
        <p className="map-warning-stale">
          <TriangleAlert aria-hidden="true" size={15} />
          {copy.stale}
        </p>
      )}
      {warning.alerts.length === 0 ? (
        <p className="map-warning-empty">{warning.level === "clear" ? copy.noWarnings : copy.coverageUnavailable}</p>
      ) : (
        warning.alerts.map((alert, index) => {
          const area = alert.areas.find((item) => item.provinceId === provinceId);
          const source = snapshot?.sources.find((item) => item.id === alert.sourceId);
          const Icon = hazardIcons[alert.hazard];
          return (
            <details key={alert.id} className="map-warning-entry" data-level={alert.level} open={index === 0}>
              <summary>
                <Icon aria-hidden="true" size={17} />
                <span>
                  {alert.title[lang]}
                  <small>
                    {area?.scope === "province"
                      ? copy.wholeProvince
                      : area?.scope === "coastal"
                        ? copy.coast
                        : copy.partialProvince}
                  </small>
                </span>
              </summary>
              <div className="map-warning-entry-body">
                <p className="map-warning-official-level">{alert.officialLevel}</p>
                <p>{alert.description[lang]}</p>
                {area && area.localities.length > 0 && (
                  <p>
                    <strong>{copy.affected}: </strong>
                    {area.localities.join(", ")}
                  </p>
                )}
                <p>{alert.instruction[lang]}</p>
                <dl>
                  <div>
                    <dt>{demo ? copy.samplePublished : copy.published}</dt>
                    <dd>{advisoryTime(alert.issuedAt, lang)}</dd>
                  </div>
                  <div>
                    <dt>{demo ? copy.sampleUntil : copy.validUntil}</dt>
                    <dd>{advisoryTime(alert.expiresAt, lang)}</dd>
                  </div>
                  {source && (
                    <div>
                      <dt>{copy.lastChecked}</dt>
                      <dd>{advisoryTime(source.checkedAt, lang)}</dd>
                    </div>
                  )}
                </dl>
                <a href={alert.sourceUrl} target="_blank" rel="noreferrer">
                  {demo ? copy.reference : copy.source}
                  <ArrowUpRight aria-hidden="true" size={14} />
                </a>
              </div>
            </details>
          );
        })
      )}
      {!warning.complete && <p className="map-warning-coverage-note">{copy.limitedCoverage}</p>}
      <a className="map-warning-official-link" href="https://www.pagasa.dost.gov.ph/" target="_blank" rel="noreferrer">
        {copy.officialLinks}
        <ArrowUpRight aria-hidden="true" size={14} />
      </a>
      {warning.alerts.length > 0 && <p className="map-warning-time-note">{copy.timestampNote}</p>}
    </section>
  );
}

export function WarningCallout({
  provinceId,
  provinceName,
  alert,
  stale,
  demo,
  onSelect,
  onDismiss,
}: {
  provinceId: string;
  provinceName: string;
  alert: MapAdvisory;
  stale: boolean;
  demo: boolean;
  onSelect: () => void;
  onDismiss: () => void;
}) {
  const { dict, lang } = useBangwit();
  const copy = dict.mapWarnings;
  const Icon = hazardIcons[alert.hazard];
  const area = alert.areas.find((item) => item.provinceId === provinceId);
  const scope =
    area?.scope === "province" ? copy.wholeProvince : area?.scope === "coastal" ? copy.coast : copy.partialProvince;
  return (
    <div className="map-warning-callout" data-level={alert.level}>
      <button
        type="button"
        className="ui-button ui-button--notice map-warning-callout-select"
        data-level={alert.level}
        onClick={onSelect}
        aria-label={`${copy.criticalCallout} ${provinceName}`}
      >
        <Icon aria-hidden="true" size={20} />
        <span>
          <strong>
            {provinceName}
            {demo && <small>DEMO</small>}
          </strong>
          <span>
            {alert.title[lang]} · {scope}
          </span>
          <small>{stale ? copy.stale : copy.levels[alert.level]}</small>
        </span>
      </button>
      <button
        type="button"
        className="ui-button ui-button--quiet ui-button--icon map-warning-callout-dismiss"
        aria-label={copy.dismissWarningCard}
        title={copy.dismissWarningCard}
        onClick={onDismiss}
      >
        <X aria-hidden="true" size={16} />
      </button>
    </div>
  );
}
