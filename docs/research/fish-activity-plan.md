# Bangwit fish activity plan

Research checked 25 November 2026. This plan is for recreational anglers who want to choose a time and waterbody, understand the conditions behind a timing cue, and record whether fish actually bit.

## What existing apps do

| Product | Activity feature | Inputs and presentation | Product lesson for Bangwit |
| --- | --- | --- | --- |
| Fishbrain | BiteTime shows hourly and multi-day activity, with species-specific bars and a score breakdown. BiteGuide adds a current score and bait suggestions. | Fishbrain says BiteTime uses machine learning trained on millions of catches and more than 30 local attributes, including temperature, sun and moon position, pressure, and precipitation. It withholds predictions where it lacks enough species/location data. | Species-level predictions need a large, local, labeled catch history. Show coverage gaps instead of filling them with a generic score. |
| Fishing Points | Fish Activity score, major/minor periods, solunar calendar, tides, weather, waves, and currents. | Its help material describes an in-house algorithm based on solunar theory, tides, and other factors. | Keep the input factors visible and treat solunar periods as one timing heuristic, not as measured fish behavior. |
| FishAngler | Hourly fishing forecast, tide stations, weather, bait/lure suggestions, local reports, and catch logs. | FishAngler describes its forecast as based on Solunar Theory and provides a percentage chart. | Pair forecasts with a structured log so anglers can compare predictions with local outcomes. |
| Nautide | Hourly fish-activity chart and solunar periods alongside tide tables, sun/moon events, barometer, waves, wind, and marine weather. | The product presents an integrated coastal-planning view and says it covers more than 25,000 coastal stations. | Put timing and environmental context together, while keeping navigation and safety services clearly separate. |

## Product decision

Bangwit should start with **possible activity windows**, not a species bite score. The first version combines solar and lunar event times with available water-condition trends, labels every output as an estimate, and saves trip outcomes locally. A future score should be introduced only after Bangwit has enough reviewed, local trip records, including sessions with no bites.

The current app is a Philippines biodiversity and fisheries prototype. Historical species records do not establish current fish presence or feeding behavior, so those records must not be used to claim that a species is biting at a chosen spot.

## App plan

- **Summary:** Help recreational anglers in Bangwit choose a fishing time, understand what environmental cues are available for a waterbody, and record bites and no-bite trips.
- **Platform:** Keep it in Bangwit’s installable web app. Anglers can open the page in the field, and the local trip journal should remain usable offline.
- **Must-have:** Sea/lake/river selector; coverage and data-age label; solar/lunar timing cues; modeled coastal conditions for the reviewed pilot point; device-local trip log; backup, restore, deletion, and stale/offline states.
- **Later:** Reviewed freshwater gauge and lake feeds; more coastal locations; trip history filters and charts; species-specific scores only after enough labeled local observations; optional account sync only after privacy and consent work.
- **Screen map:** Explore opens Fish activity; Fish activity shows coverage, timing, and supported conditions; Log trip records the angler’s session; Recent trips lets the angler review or remove entries; Settings backs up, restores, or erases local records.
- **First-success flow:** Open Fish activity → choose sea/lake/river → review whether that water has forecast coverage → use a timing cue or log a trip → save location, time, target, method, and bite outcome → compare the next trip with the history.
- **Data and accounts:** `FishingTrip` stores water type, manually entered waterbody label, date, start/end time, target species, method, outcome, bite count, notes, and save time in IndexedDB. No account or GPS is needed. A versioned JSON backup moves records between browser profiles; Settings erasure clears both trip and catch stores.
- **Monetization:** No price or subscription is assumed. If Bangwit becomes commercial, replace the free Open-Meteo integration with a commercial license or a reviewed alternative before monetization.
- **Next step:** Pilot the timing cues with anglers around the supported coastal point, then prioritize named lake and river gauges with current licensing and data-coverage checks.

### First-slice feature spec

**Story:** As an angler, I want to see clearly labeled timing and water-condition cues for a supported place and record whether I had bites, so I can learn from my own trips without confusing a model estimate with a local fish observation.

**Acceptance criteria:**

1. The selector offers sea, lake, and river. Unsupported freshwater forecast coverage is stated directly, while trip logging stays available for each type.
2. Sea timing and environmental conditions identify the Puerto Azul/Ternate pilot and show when cached data may be stale.
3. Activity periods are presented as one-hour solar/lunar timing cues. No numeric bite score, species prediction, bait recommendation, navigation direction, or safety conclusion is shown.
4. A trip can be saved with location, date, start/end time, outcome, and optional target, method, bite count, and notes.
5. Trip records stay in local IndexedDB, appear in recent history, and can be deleted, exported/restored through Settings backup, or cleared with Settings erasure.
6. Loading, API error, cached/offline, empty history, save error, and successful save states are represented in English and Filipino.

**Out of scope:** Predicting a named species’ probability of being caught; promising that a time is productive; verified freshwater coverage; user accounts, cloud sync, public trip sharing, GPS capture, fishing-law advice, and marine safety warnings.

## Phased implementation

### Phase 1 · Coastal pilot

- Provide a fish-activity page for sea, lake, and river anglers.
- Show live marine conditions and solar/lunar timing cues for one explicitly named pilot point: Puerto Azul, Ternate, Cavite.
- Show the marine model grid coordinate and explain that it may be several kilometres from the named point.
- Avoid an activity percentage, species-specific forecast, bait recommendation, navigation instruction, or safety claim.
- Let anglers log date, water type, manually entered spot, target species, method, bite outcome, and notes. Keep entries device-local and include them in Bangwit backup and erase controls.
- Store forecast cache separately from personal trip records and clear it with the app’s local-data erase action.

### Phase 2 · Freshwater and more coastlines

- Inventory river gauges, lake level/flow data, weather sources, tide stations, and local access constraints for the places Bangwit covers.
- Review provider coverage, update frequency, terms, attribution, and reuse before enabling a location.
- Map only reviewed waterbody/gauge pairs. Show source age, distance from the selected water, missing data, and stale-cache state.
- Use the same trip logger across all water types. Do not infer present fish populations from historical specimen records.

### Phase 3 · Validate local activity guidance

- Ask anglers to log no-bite as well as bite/catch sessions, with time, waterbody, target species, and method.
- Compare candidate timing/condition cues against those records by species, season, and waterbody. Keep unobserved sessions distinct from no-bite reports.
- Publish a score only when there is enough local evidence to evaluate calibration and coverage. Show the score’s data count, time range, factors, and uncertainty; suppress it when evidence is thin.
- Add user research with shore and boat anglers, and check that the flow works in low-signal conditions and Filipino/English.

## Current source and licensing notes

- A government environmental-impact statement reproduces NAMRIA 2020 tide-station coordinates for Puerto Azul, Ternate: 14°47′ N, 120°41′ E. The app’s marine API request uses that named point as a query coordinate, then displays the model-returned grid cell. This is a location anchor, not a claim that Open-Meteo is reporting NAMRIA station observations. [Government EIS table](https://eia.emb.gov.ph/wp-content/uploads/2021/09/EIS-CMC-2021.pdf)
- The official [NAMRIA PhTides page](https://www.namria.gov.ph/PhTides.aspx) publishes predicted hourly tide heights by station and states the time meridian and datum. No reusable live API or redistribution terms have been reviewed for Bangwit, so the first version does not scrape or republish its table.
- [Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api) exposes hourly sea level, waves, and ocean current. Its documentation says coastal sea-level accuracy is limited and the value is not suitable for coastal navigation. It requires attribution to Open-Meteo and the model providers.
- Open-Meteo’s free API is restricted to non-commercial use, has request limits, and uses CC BY 4.0 data terms. The prototype integration must be replaced by a licensed plan or another reviewed provider before Bangwit is used commercially or monetized. [Terms](https://open-meteo.com/en/terms) · [Pricing](https://open-meteo.com/en/pricing)
- [Fishbrain BiteTime](https://support.fishbrain.com/hc/en-us/articles/22539013567644-How-to-find-the-best-time-to-catch-fish) and [BiteGuide](https://support.fishbrain.com/hc/en-us/articles/26183937487900-What-is-BiteGuide), [Fishing Points solunar guidance](https://support.fishingpoints.app/hc/en-us/articles/26649198833810-Using-Solunar-for-fishing) and [forecast glossary](https://support.fishingpoints.app/hc/en-us/articles/26481781708306-Forecasts-Glossary), [FishAngler FAQ](https://www.home.fishangler.com/faq/), and [Nautide](https://nautide.com/) are the product references for the comparison above.

## First-version limits

The current pilot provides timing cues and modeled coastal conditions for one Ternate point. It does not yet forecast live lake or river conditions, represent all of Manila Bay or the selected Bangwit bays, confirm fish presence or feeding, or warn about dangerous weather. The trip log is local to one browser profile until exported in a backup.
