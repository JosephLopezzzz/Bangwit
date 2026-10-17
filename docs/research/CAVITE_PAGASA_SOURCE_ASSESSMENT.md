# Cavite advisory source assessment

Reviewed: 17 October 2026
Decision: no-go for enabling a live app feed; continue with official links and an unavailable status.

## Findings

1. PAGASA publishes a Southern Luzon Regional Forecast page that includes a current forecast and links to rainfall warnings, thunderstorm warnings and impact-based forecasts. The page is a public regional bulletin, not a Cavite-only warning record. A regional list or “no warning issued” text must not be interpreted as proof that every Cavite hazard is clear.
2. PAGASA's TenDay Weather Forecast API is a separate, documented API for date- and location-based forecasts. The official API guide describes an approval process, token authentication and per-token limits. It is not, by itself, the structured active-warning or cancellation feed required by Bangwit's current alert contract.
3. A public August 2026 FOI response from PAGASA states that the API request was denied because access was then limited to government agencies. This is evidence that access may be restricted, not a definitive ruling on every partnership or request. Bangwit has no approved token or authorized government partner recorded.
4. The current app has no validated raw warning adapter, authorized source access, publisher, scheduler or durable last-good snapshot. Rewriting the public HTML page as an undocumented scraper would not satisfy source stability, reuse, update/cancellation, outage and monitoring gates.

## Go/no-go

**No-go for automated live-warning activation now.** Keep live advisory coverage unavailable. Keep the fictional preview clearly marked as a demonstration, and let users open PAGASA's official Southern Luzon page for the source bulletin. Do not display a green or “safe” state from a missing feed.

**Possible next path:** request or obtain authorized access through an eligible government partner, then confirm the permitted product, data reuse terms, stable machine-readable endpoint, Cavite locality semantics, update/cancellation rules and expected cadence. The TenDay forecast API should only be used for a separate forecast feature after access is approved; forecast values must not be recast as official warnings. No request was sent as part of this review.

## Source references

- PAGASA Southern Luzon regional forecast: https://pagasa.dost.gov.ph/regional-forecast/slprsd
- PAGASA TenDay API documentation (official PDF): https://tenday.pagasa.dost.gov.ph/static/media/api-doc.c9cf6abbaa781437ed96.pdf
- PAGASA TenDay API access request and authorization guide: same official API documentation.
- PAGASA response on TenDay API access, 20 August 2026: https://www.foi.gov.ph/agencies/pagasa/request-for-access-to-the-pagasa-tenday-weather-forecast-api/
- Current app route and unavailable/live-feed contract: `src/app/api/advisories/route.ts` and `docs/MAP_ADVISORIES.md`.

## Scope and limits

This review checked official PAGASA web pages and current indexed API documentation. It did not submit an access request, obtain a token, contact PAGASA, call authenticated endpoints, measure feed uptime, or confirm terms permitting republication. The regional page's content may change; it is a link for the user to consult, not a data source Bangwit has validated for automated ingestion.
