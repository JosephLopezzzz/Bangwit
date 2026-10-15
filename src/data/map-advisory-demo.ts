import type { AdvisorySnapshot } from "@/lib/map-advisories";
import { CAVITE_PROVINCE_ID, PHILIPPINE_PROVINCES } from "./phl-provinces";

// Fixed fictional timeline, never a live bulletin or a fallback for a failed live request.
export const DEMO_ADVISORY_NOW = Date.parse("2026-01-01T06:03:00Z");
export type AdvisoryDemoScenario = "warnings" | "stale" | "clear";
const batangas = PHILIPPINE_PROVINCES.find((province) => province.name === "Batangas")?.id ?? "";
const laguna = PHILIPPINE_PROVINCES.find((province) => province.name === "Laguna")?.id ?? "";

export function createAdvisoryDemo(scenario: AdvisoryDemoScenario): AdvisorySnapshot {
  return {
    version: 1,
    mode: "demo",
    generatedAt: "2026-01-01T06:03:00Z",
    sources: [
      {
        id: "fictional-scenario",
        name: "Bangwit demonstration",
        url: "https://www.pagasa.dost.gov.ph/information/rainfall-and-thunderstorm-warning-system",
        provinceIds: [CAVITE_PROVINCE_ID, batangas, laguna],
        hazards: ["rainfall", "thunderstorm", "wind", "flood", "marine"],
        checkedAt: "2026-01-01T06:03:00Z",
        status: scenario === "stale" ? "unavailable" : "ok",
      },
    ],
    alerts:
      scenario === "clear"
        ? []
        : [
            {
              id: "demo-cavite-rain",
              sourceId: "fictional-scenario",
              hazard: "rainfall",
              level: "emergency",
              officialLevel: "Red rainfall warning (example)",
              title: { en: "Red rainfall warning", fil: "Red rainfall warning" },
              description: {
                en: "Fictional scenario: severe flooding is expected in the listed areas. This does not describe current conditions.",
                fil: "Kathang-isip na halimbawa: inaasahan ang matinding pagbaha sa mga nakalistang lugar. Hindi ito kasalukuyang kondisyon.",
              },
              instruction: {
                en: "Open the official bulletin for its instructions and monitor your local DRRMO.",
                fil: "Basahin ang opisyal na bulletin at subaybayan ang lokal na DRRMO.",
              },
              areas: [
                { provinceId: CAVITE_PROVINCE_ID, scope: "partial", localities: ["Bacoor", "Kawit", "Noveleta"] },
              ],
              issuedAt: "2026-01-01T06:00:00Z",
              effectiveAt: "2026-01-01T06:00:00Z",
              expiresAt: "2026-01-01T09:00:00Z",
              sourceUrl: "https://www.pagasa.dost.gov.ph/information/rainfall-and-thunderstorm-warning-system",
              status: "active",
              supersedes: [],
            },
            {
              id: "demo-cavite-flood",
              sourceId: "fictional-scenario",
              hazard: "flood",
              level: "warning",
              officialLevel: "Flood advisory (example)",
              title: { en: "Flood advisory", fil: "Flood advisory" },
              description: {
                en: "Fictional example of possible flooding near river channels. No flooding has been confirmed by this demo.",
                fil: "Kathang-isip na posibleng pagbaha malapit sa ilog. Walang aktuwal na baha na kinukumpirma ng demo.",
              },
              instruction: {
                en: "Check official local flood advisories for the affected locations.",
                fil: "Tingnan ang opisyal na lokal na flood advisory para sa mga apektadong lugar.",
              },
              areas: [{ provinceId: CAVITE_PROVINCE_ID, scope: "partial", localities: ["Bacoor", "Kawit"] }],
              issuedAt: "2026-01-01T06:00:00Z",
              effectiveAt: "2026-01-01T06:00:00Z",
              expiresAt: "2026-01-01T09:00:00Z",
              sourceUrl: "https://www.pagasa.dost.gov.ph/flood",
              status: "active",
              supersedes: [],
            },
            {
              id: "demo-batangas-marine",
              sourceId: "fictional-scenario",
              hazard: "marine",
              level: "warning",
              officialLevel: "Gale warning (example)",
              title: { en: "Gale warning", fil: "Babala sa malakas na hangin sa dagat" },
              description: {
                en: "Fictional coastal warning used to preview a second affected province.",
                fil: "Kathang-isip na coastal warning upang ipakita ang isa pang apektadong lalawigan.",
              },
              instruction: {
                en: "Read the official marine bulletin for conditions and vessel advice.",
                fil: "Basahin ang opisyal na marine bulletin para sa kondisyon at payo sa sasakyang pandagat.",
              },
              areas: [{ provinceId: batangas, scope: "coastal", localities: ["Batangas seaboard (example)"] }],
              issuedAt: "2026-01-01T06:00:00Z",
              effectiveAt: "2026-01-01T06:00:00Z",
              expiresAt: "2026-01-01T09:00:00Z",
              sourceUrl: "https://www.pagasa.dost.gov.ph/marine/gale-warning",
              status: "active",
              supersedes: [],
            },
            {
              id: "demo-laguna-thunderstorm",
              sourceId: "fictional-scenario",
              hazard: "thunderstorm",
              level: "advisory",
              officialLevel: "Thunderstorm advisory (example)",
              title: { en: "Thunderstorm advisory", fil: "Thunderstorm advisory" },
              description: {
                en: "Fictional example of an advisory affecting part of a province.",
                fil: "Kathang-isip na advisory para sa bahagi ng isang lalawigan.",
              },
              instruction: {
                en: "Check the official regional thunderstorm advisory.",
                fil: "Tingnan ang opisyal na regional thunderstorm advisory.",
              },
              areas: [{ provinceId: laguna, scope: "partial", localities: ["Calamba (example)"] }],
              issuedAt: "2026-01-01T06:00:00Z",
              effectiveAt: "2026-01-01T06:00:00Z",
              expiresAt: "2026-01-01T08:00:00Z",
              sourceUrl: "https://www.pagasa.dost.gov.ph/regional-forecast/ncrprsd",
              status: "active",
              supersedes: [],
            },
          ],
  };
}
