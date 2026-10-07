# Cavite pilot fisheries rule source inventory

**Reviewed:** 2026-10-07  
**Status:** Source map only. This is not a legal clearance or a recommendation to fish.

Bangwit's rule result has to be matched to **user type, exact water area, trip date, species, and fishing method/gear**. A species occurrence record cannot answer whether a person may catch it.

## Primary sources to use

| Source | What it establishes for the app | What remains to verify |
| --- | --- | --- |
| [Republic Act 8550, Philippine Fisheries Code](https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/2/4002), read together with [RA 10654](https://issuances-library.senate.gov.ph/legislative%2Bissuances/Republic%20Act%20No.%2010654) | National framework. A closed season is defined for specified species, gear, and area; the statute also provides for municipal-water management and exceptions. | Use the amended text and current implementing orders; match exact species, gear, area, and dates. |
| [Local Government Code, RA 7160, Section 149](https://officialgazette.gov.ph/1991/10/10/republic-act-no-7160/) | Municipalities have authority over fishery privileges in municipal waters. | The relevant LGU's current ordinance, permits, registration, and treatment of visiting recreational anglers. |
| [BFAR implementing rules for RA 10654](https://www.bfar.da.gov.ph/wp-content/uploads/2023/09/IRRofRA10654.pdf), Rule 16.3 | Local municipal fisheries ordinances can declare demarcated fisheries areas, closed seasons, marine protected areas, fish refuges/sanctuaries, and reserves. | Obtain the actual ordinance and its mapped boundary, amendments, and effective dates from each relevant LGU. |
| [BFAR FAO 232 (2010), Limiting Commercial Fishing in Manila Bay](https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/10/50770) | Manila Bay has a specific commercial-fishing licensing/access order. Its definition of commercial fishing excludes subsistence or sports fishing. | Do not apply this as a blanket rule for recreational anglers. Confirm other national rules and each LGU's rules for the person's activity. |
| [Cavite Provincial Environment Plan 2024](https://cavite.gov.ph/wp-content/uploads/2026/04/CEP_2024.pdf), Table 4.26 | Lists local fisheries ordinances and sanctuary actions, including entries for Cavite City, Bacoor, Maragondon, and Naic. | The plan is an index, not the full ordinance text or a current legal boundary. Request the signed ordinance, amendments/repeals, and map from the LGU. |
| [Cavite Coastal Water Boundaries Map (2011)](https://cavite.gov.ph/home/wp-content/uploads/2017/06/Chapter-1.pdf) | Provincial map depicts municipality/city and municipal-water boundary lines. | Dated visual map; no usable GIS geometry was added to the project. Confirm current legal boundaries with the relevant LGUs/BFAR before point-in-polygon checks. |
| [NAMRIA Request for Free Products and Services (2025 Citizen's Charter)](https://www.namria.gov.ph/Downloads/CitizensCharter/2025/External/Request%20for%20Free%20Products%20and%20Services.pdf) | The currently linked Citizen's Charter lists free product requests, eligible government/academic/hydrographic users, request-letter and ID requirements, student-thesis documents, and a 17-day, 1-hour, 5-minute processing estimate with no fee. Its free-product list does **not** name Municipal Water Boundary Data. It gives `css.gismb@namria.gov.ph` for initial inquiries. | Ask whether the older municipal-water data product is still available, whether the user qualifies, and which service unit should handle Cavite. Do not infer that the boundary-data request is free just because other data products are. |
| [NAMRIA Citizen's Charter 2023: Free Printed and Digital Products](https://namria.gov.ph/CitizensCharter/2023/Provision%20of%20Free%20Printed%20and%20Digital%20Products.pdf) | Lists “Municipal Water Boundary Data” as a requestable product with a 15-day processing estimate. | This is a 2023 listing; the currently linked 2025 free-products charter omits that product, so availability, eligibility, fee, and format are unconfirmed. |
| [NAMRIA certification services](https://www.namria.gov.ph/kiosk/namria06.htm) | NAMRIA offers certification and certified true copies of municipal-water maps and technical descriptions; it accepts requests through its One-stop Shop, including `oss@namria.gov.ph`. The published certification fee is ₱5,000 plus ₱50 per km; verify the current fee and the exact product before ordering. | Ask first whether existing certified Cavite coastal-LGU boundary files are available digitally, their CRS/file format, reuse terms, date, and any charge. A certified map/technical description is the authority lead; the public-facing site does not expose a ready Cavite GIS download. |
| [NAMRIA 2025 Annual Report](https://www.namria.gov.ph/jdownloads/Annual_Report/NAMRIA_Annual_Report_2025_-_signed.pdf) | Reports 107 municipal-water master maps and a catalog of 107 certified map updates produced agency-wide. | The report excerpt does not identify which LGUs are covered or confirm a public GIS release. Ask NAMRIA specifically about Cavite coverage and distribution terms. |
| [Cavite City Ordinance 2023-3388](https://cavitecity.gov.ph/index.php/component/phocadownload/category/77) | Official Cavite City repository lists an ordinance banning compressor breathing apparatus in fishing activities in the city's territorial waters. | Download and review the signed ordinance, effectivity, coverage, exceptions, penalties, and any amendment/repeal before encoding it as an active rule. |
| [Cavite Ecological Profile 2021](https://cavite.gov.ph/wp-content/uploads/2026/04/CEP_2021.pdf), Table 2.12 | Lists five fish sanctuaries/MPAs and gives a 2021 status snapshot. | The profile is historical. Recheck each sanctuary's present status, legal text, marker condition, and mapped extent. |
| [Bacoor Integrated Zoning Ordinance / CLUP (2025)](https://bacoor.gov.ph/wp-content/uploads/2025/10/Zoning-Ordinance-1_compressed.pdf) | References Bacoor City Ordinance No. 278-2023, the Comprehensive Fishing Ordinance, and says fishing-ground/aquaculture-zone boundaries are marked. | Obtain the ordinance and its official boundary map or coordinate description; a CLUP excerpt alone is not the full operational rule. |
| [BFAR Fisheries Administrative Orders index](https://www.bfar.da.gov.ph/laws-regulations-issuances/administrative-orders/) | Central starting point for national gear, species, and seasonal orders. | An order's appearance in the index does not by itself establish that a dated or time-limited closure is currently in force. Check the text and any superseding order. |

## Initial Cavite follow-up list

The provincial plan lists, among others, a Maragondon fish sanctuary (2020), a Naic fish sanctuary in a portion of Barangay Bagong Kalsada's municipal waters, and local fishing/gear ordinances for Bacoor and Cavite City. Its 2021 ecological profile separately reported Rosario, Tanza, and Naic sanctuaries as maintained, Ternate as “for assessment,” and Maragondon as “lost marker.” These are dated status reports, not proof of current status. The Maragondon dates/descriptions differ across the provincial records, so get the signed ordinance and current map before labeling it on the app.

Bacoor's 2025 zoning ordinance references its Comprehensive Fishing Ordinance No. 278-2023 and marked fishing-ground/aquaculture boundaries. That is a strong local source lead; the underlying ordinance and boundary coordinates still need review. Cavite City's official ordinance index now supplies a specific 2023 rule lead (Ord. 2023-3388), but the ordinance itself still needs legal review. The provincial 2011 municipal-waters map is useful for orientation but is too old and visual-only to substitute for current local GIS geometry. The 13-record CC0 shortlist includes broad historical leads, so it does not yet identify a single LGU or sanctuary boundary to test.

## Next source-gathering action

NAMRIA's **Download** page is a library of general PDF/JPG/ZIP maps, charts, publications, and forms; the page reviewed does not expose a Cavite municipal-water GIS download. The 2023 charter lists “Municipal Water Boundary Data,” but the currently linked 2025 free-products charter does not, so treat that older listing as unconfirmed. NAMRIA's 2025 charter gives `css.gismb@namria.gov.ph` for initial inquiries; its official directory also lists `csu.hb@namria.gov.ph` for the Hydrography Branch. Start with a no-commitment availability and eligibility question, then follow the unit's routing before sending IDs or other personal documents. NAMRIA's 2025 Annual Report says it produced 107 master maps and a catalog of 107 certified updates, but does not establish Cavite coverage or public access. For any returned file, ask for its legal date/effectivity, coordinate reference system, downloadable GIS format (GeoJSON or Shapefile if available), map scale/accuracy, public reuse terms, and the office that confirms the current version. Do not trace the 2011 map or GBIF/OBIS points into a legal boundary.

For a simple first inquiry, the 2025 Free Products and Services charter lists `css.gismb@namria.gov.ph`; NAMRIA's official directory lists `csu.hb@namria.gov.ph` for the Hydrography Branch and `oss@namria.gov.ph` for certification requests. The ₱5,000 plus ₱50/km price applies to **certification** of a municipal-water map/technical description, not automatically to every data request. Ask whether the old data product remains available and whether digital delivery/reuse is allowed before ordering certification.

For local rules, the current public-source leads are: Bacoor (Ord. 278-2023 referenced by its 2025 zoning ordinance; full ordinance/map still needed), Cavite City (Ord. 2023-3388 listed in its official ordinance repository; text/effectivity review needed), and Naic/Maragondon plus sanctuary sites in Rosario, Tanza, and Ternate (provincial profiles identify actions/status, but signed current ordinance and geometry are still needed). These leads are not an exhaustive review of every coastal LGU or all amendments. Naic's public ordinance index did not surface the cited fisheries/sanctuary instrument in the records inspected; this means “not located in the public index,” not “does not exist.”

### Copy-ready request draft

> Subject: Inquiry about Cavite municipal-water boundary data for research
>
> Hello NAMRIA One-stop Shop,
>
> I am preparing a research prototype about fisheries information for Cavite. May I ask whether NAMRIA has existing certified municipal-water maps and technical descriptions for Cavite's coastal cities/municipalities, and whether digital copies or GIS files are available for research and public-facing display?
>
> If available, please advise whether the data request is free or fee-based, the file format and coordinate reference system, coverage and data/certification date, permitted reuse/attribution terms, and the steps and requirements. GeoJSON or Shapefile would be helpful for the prototype; a scanned map and technical description would also help us identify the authoritative source. Please also clarify the difference between requesting the boundary data and ordering a certified map/technical description.
>
> I will not present an unverified or illustrative line as a legal fishing boundary. Thank you.

This is a draft only; no request has been sent.

> Subject: Request for current fisheries ordinances and mapped restricted areas
>
> Hello,
>
> I am preparing a research prototype about fisheries information for Cavite. May I request copies or official links to the current fisheries ordinances and their amendments for your city/municipality, including rules for municipal fisherfolk and recreational/sports anglers, fishing methods/gears, permits, closed seasons, sanctuaries, and other restricted areas?
>
> If available, may I also request the official maps or boundary descriptions for municipal waters and any fish sanctuary, marine protected area, no-take zone, or other fishing restriction? A GIS file (GeoJSON/Shapefile) is preferred; if unavailable, a map with its scale, coordinate reference system, and technical description would be useful.
>
> Please include the approval/effectivity date, any amendment or repeal, the office responsible for confirming that each rule and boundary is current, and the source/attribution or reuse terms. We will keep unverified boundaries clearly marked and will not describe a recorded species as legally catchable based on presence alone.
>
> Thank you.

This is a draft only; no request has been sent.

The BFAR index also lists FAO 175 (1991), titled as a **five-year** Manila Bay closed season for specified commercial and municipal gears. Because its stated duration is time-limited, do not show it as an active 2026 closure without an authoritative later order confirming the current rule.

## Evidence needed before Bangwit can show a legal result

1. Current municipal fisheries ordinances and amendments for the coastal LGUs implicated by the chosen fishing area, beginning with the Bacoor and Cavite City source leads above.
2. Official boundary files or ordinance maps for municipal waters, sanctuaries, no-take zones, and other restricted areas; record the map source, date, and coordinate reference system. Start by asking NAMRIA about existing certified maps/technical descriptions and available digital formats.
3. Rules for resident municipal fisherfolk, visiting recreational anglers, and commercial operators kept as distinct user categories.
4. Current species-, gear-, area-, and date-specific closures or prohibitions, checked against the official order text and its effectivity/amendment history.
5. A source owner, citation, last-checked date, and review status for each rule. If a source or boundary cannot be confirmed, show “not verified” and do not recommend the catch.

Until these checks are complete, all 12 historical locality leads remain **not verified for catchability**, and the one broad-error record remains excluded from Cavite-specific evidence.
