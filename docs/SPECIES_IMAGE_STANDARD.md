# Bangwit species image standard

**Status:** Implementation standard; six canonical photos are approved for the Nile tilapia, snakehead, Indian anchovy, tawilis, tiger-toothed croaker, and Palawan goby feeding-guide entries. Commerson's anchovy uses the verified-photo fallback.
**Reviewed:** 12 November 2026

## Image audit

- The public species-image registry currently contains six reviewed reference photos: *Oreochromis niloticus*, *Channa striata*, *Stolephorus indicus*, *Sardinella tawilis*, *Otolithes ruber*, and *Stiphodon palawanensis*. Other species evidence records have no canonical photo fields or approved image assets.
- `My Species` uses photos attached to a person's own catch entries. Those are private journal records, not public identification references; keep them in the existing local storage and do not substitute them for canonical imagery.
- The ignored research render `tmp/pdfs/region02-source-review-20261110/ludong-03.png` is page 141 of Escaño et al. (2022), Table 1. It shows 15 small specimen thumbnails in rows with sample code, locality/date, GenBank accession and sequence identity. The thumbnails vary in lighting, scale and background and are embedded in a table, not supplied as standalone app assets. The article reports these sampled northern Luzon fish as *Cestraeus goldiei* and states CC BY-NC 4.0 at the end of the PDF. Do not copy them into the app by default: the low-resolution table presentation is not a good field-guide reference, and the non-commercial condition would constrain any future commercial use. If Bangwit later explicitly stays non-commercial, a media-specific attribution/rights check could reconsider them.
- A 2018 Darwin Initiative annual-report review notes two Annex 13 janitor-fish photos, but the report does not link them to a named locality, date, event, collector, voucher or catalog number, and the review found no item-specific open reuse license. They are not taxon-verified image records and are excluded. See [the research review](../data/research/philippines/national/reviews/region02-darwin-2018-ar1-janitor-fish-cmg-fid-review-20261111.json) and [the report](https://www.darwininitiative.org.uk/documents/DAR24016/24699/24-016%20AR1%20-%20edited.pdf).

Most Species Explorer records remain text-and-evidence views. Feeding-guide entries use a shared 4:3 photo frame, source credits, and a localized fallback; do not add decorative or unverified images just to fill empty image slots.

## Admission checklist

Add a canonical image only after all of these are recorded:

1. **Taxon identity:** a stable taxon key, accepted scientific name, the authority used for that name, and the date checked. If the accepted name or image identification is disputed, keep the photo out until the conflict is resolved.
2. **Image-to-taxon link:** an authoritative source must explicitly associate the depicted organism with that taxon. A nearby photo, common-name caption, community post or AI identification alone is not enough. For specimen images, preserve the voucher/sample/catalog code that links the image to the source's identification.
3. **Media provenance:** image title or identifier, creator/photographer when available, exact source-item URL, capture date and view/life stage when known, retrieval date, and a SHA-256 for the local original.
4. **Reuse rights:** record the image-level license or written permission, its source URL/reference, and whether commercial reuse and adaptations are allowed. A dataset's metadata license is not automatically the license for each attached photograph. Keep pending, unclear, non-commercial-only, or no-derivatives media outside the app registry unless the project's intended use and the rights explicitly allow it.
5. **Local asset:** store an approved local copy under `public/assets/species/`; do not load third-party image URLs at runtime. Never copy personally submitted catch photos into this folder.

Pending or rejected media belongs in the research review ledger, not the UI registry. A missing photo means “not available here,” not “the species has no image.”

## Visual and accessibility treatment

- Use the shared `SpeciesImage` component and a **4:3 frame** with a one-pixel `--line` border, 8px corners, and `--paper` background. Center the whole animal using `object-fit: contain`; do not crop fins, body outline, diagnostic marks, or scale references to force matching aspect ratios.
- Keep source files intact. Re-encode, recolor, remove backgrounds, or otherwise make a derivative only when the recorded rights permit it. When edits are allowed, retain the original, record the derivative method, and keep colors natural. Do not erase scale bars, specimen labels that carry evidence, or diagnostic features.
- Prefer one clear side view per taxon. Additional views can be added only when they help distinguish life stage, sex, or diagnostic anatomy and each view has its own provenance and rights record. Label drawings/illustrations as such; never use generic art or generated imagery as if it were a verified species photograph.
- Write concise alt text for what is visibly present (for example, view, color pattern, and notable markings), without repeating the neighboring species heading. Show the source, creator when known, license/permission label, and independent identification reference beneath the image.
- When the registry has no cleared image, show the same neutral fish-icon fallback and a localized “No verified species photo” caption. Never substitute Bilog or a different fish.
- Follow the existing light/dark theme tokens, visible keyboard focus for links, reduced-motion behavior, and responsive layout. Do not add a new card-within-card or ornamental shadow treatment.

## Data and offline behavior

- `src/lib/species-images.ts` is the typed registry. Each entry must have `rights.status: "cleared"`, media provenance, an explicit rights record, and a taxonomic identification reference. Use `SpeciesImage` for the display and let it render the common fallback when there is no approved entry.
- Use a stable filename based on the taxon key and media identifier; do not rename files to suggest an identification that the source does not support.
- The photo slot uses fixed 960×720 layout dimensions, lazy loading, a local-only `/assets/species/` path, and the original source file without Next's image optimizer. The shared Serwist image runtime rule is bounded to 64 image entries for up to 30 days; species media is excluded from the install precache so a growing national photo set does not inflate the initial offline bundle. Only recently viewed images may be available offline; nationwide offline photo coverage is not guaranteed.
- Continue to distinguish canonical reference images from catch-log photos in screens, exports and privacy copy. Canonical assets are public app content; personal catch images remain local user data.

## Reviewed source examples

- Escaño et al. (2022), [official NFRDI repository item](https://repository.nfrdi.da.gov.ph/items/405e7034-8af9-4801-b8c1-42dff5c103c9), [article PDF](https://repository.nfrdi.da.gov.ph/bitstreams/9dcc4a58-f0f4-4b61-b14b-ce2ed35640bf/download), and [CC BY-NC 4.0 terms](https://creativecommons.org/licenses/by-nc/4.0/). The paper's table image links sample codes and barcoding findings, but the thumbnails are not app-ready and remain outside the image registry.
- Darwin Initiative 24-016, [Year 1 report](https://www.darwininitiative.org.uk/documents/DAR24016/24699/24-016%20AR1%20-%20edited.pdf). Annex photos remain excluded because image-level identity/locality and reuse rights were not established.

## Candidate screen: *Cestraeus goldiei*

**Reviewed:** 11 November 2026. This is a source/rights screen only; no image is approved or added to the app.

- [FishBase gallery, species ID 15278](https://www.fishbase.se/photos/ThumbnailsSummary.php?ID=15278) lists a FAO photo (`Cegol_u0.gif`). FishBase says the gallery images are low-resolution, high-compression scans, that copyright remains with the photographer/institute, and that reuse requires contacting the contributor for permission. **Disposition: hold pending written image permission and an original-resolution file.**
- [Escaño et al. (2022), Table 1](https://repository.nfrdi.da.gov.ph/bitstreams/9dcc4a58-f0f4-4b61-b14b-ce2ed35640bf/download) contains specimen thumbnails paired to sample codes, collection place/date and COI accessions. The article reports the 25 sequenced samples as *C. goldiei* and carries CC BY-NC 4.0 terms. The thumbnails are too small and uneven for a clear field-guide profile; the non-commercial condition also must remain compatible with Bangwit's future use. **Disposition: retain as research evidence, not a canonical profile image.**
- The [Cybium 2021 paper](https://sfi-cybium.fr/sites/default/files/pdfs-cybium/Cybium%202021%2C%20452%20full.pdf) includes *C. goldiei* diagnostic figures, but states that the relevant figures were adapted from Harrison and Senou and used with permission from FAO/Ian Harrison. **Disposition: do not extract or reuse those figures; seek permission from the rights holders if needed.**
- The [Wikimedia Commons *Cestraeus* category](https://commons.wikimedia.org/wiki/Category:Cestraeus) lists *C. plicatilis* as its only species subcategory; this search did not locate a *C. goldiei*-specific Commons image. **Disposition: no candidate from this search.**

For this first taxon the image registry stays empty. Next acquisition attempt: request permission and an original file for the FishBase FAO image, while continuing to search for individually licensed photographs with independent taxon identification. If neither clears, keep the shared no-photo fallback.

## Approved image review: *Oreochromis niloticus*

**Reviewed:** 11 November 2026. This reference illustrates the accepted species in the feeding-guide entry; its photographed locality is not used as a distribution or occurrence claim.

- The [Wikimedia Commons file record](https://commons.wikimedia.org/wiki/File:Oreochromis_niloticus_Egypt.jpg?oldid=925316833) identifies the fish as *Oreochromis niloticus*, credits photographer Magdy A. Saleh, gives the locality as the Northern Nile Delta, Egypt, and declares CC BY 3.0. The [license terms](https://creativecommons.org/licenses/by/3.0/) allow commercial reuse and adaptation with attribution. The source links to FishBase image `autoctr=13729`.
- The local file is preserved without edits at `public/assets/species/oreochromis-niloticus-commons-925316833.jpg`; dimensions 640 × 416, 49,063 bytes; SHA-256 `ACB689E384BB0F2DEF58E2E5AE5D3E13570578EC7BDC49FEFCC7A99D7866C4D8`.
- The visible image is a clear side view with the body, fins, and markings intact. It is shown with `object-fit: contain` in the shared 4:3 slot. Credit and license appear below it. The accepted-name cross-check uses [WoRMS AphiaID 293639](https://www.marinespecies.org/aphia.php?p=taxdetails&id=293639).

The verified image is registered under `worms:293639` and appears only in the Nile tilapia feeding-guide entry. The other guide species continue to show the localized neutral fallback until their own image identity, media, and reuse rights pass review. No image implies local presence, safe catchability, or diet.

## Approved image review: *Channa striata*

**Reviewed:** 11 November 2026. This is a general visual reference for the accepted species, not evidence of Philippine presence or of presence at any selected fishing ground.

- The [Wikimedia Commons file record](https://commons.wikimedia.org/wiki/File:Channa_striata.jpg?oldid=854138233) labels the image *Channa striata*, identifies BEDO (Thailand) as the creator, and records a single CC BY-SA 4.0 license. Thailand's [Public Relations Department](https://www.prd.go.th/th/content/category/detail/id/9/iid/243135) identifies BEDO as a public organization responsible for biodiversity-based research and resource management. The [CC BY-SA 4.0 terms](https://creativecommons.org/licenses/by-sa/4.0/) permit commercial sharing and adaptation with attribution and a share-alike condition for adaptations.
- The local file is preserved without edits at `public/assets/species/channa-striata-bedo-commons-854138233.jpg`; dimensions 640 × 426, 77,984 bytes; SHA-256 `1F264E64774BECB7D0CA8FFD14D1579D2E58300CAA7356E61FF7AF09ADC2081D`.
- Visual review found a clear side view with head, body, fins, and markings visible. The photo uses the shared 4:3 `object-fit: contain` frame, with BEDO attribution and CC BY-SA 4.0 displayed below it. The accepted-name cross-check uses [WoRMS AphiaID 280130](https://www.marinespecies.org/aphia.php?p=taxdetails&id=280130).

The image is registered under `worms:280130` for the snakehead feeding-guide entry. It is not localized or presented as proof of Philippine occurrence.

## Approved image review: *Stolephorus indicus*

**Reviewed:** 11 November 2026. This is a general visual reference for the accepted species, not evidence of Philippine presence or of presence at any selected fishing ground.

- The [Wikimedia Commons file record](https://commons.wikimedia.org/wiki/File:Stolephorus_indicus.jpg?oldid=942888770) describes the image as *Stolephorus indicus*, credits BEDO (Thailand), and records a single CC BY-SA 4.0 license. The license allows commercial sharing and adaptation with attribution and a share-alike condition for adaptations.
- The local file is preserved without edits at `public/assets/species/stolephorus-indicus-bedo-commons-942888770.jpg`; dimensions 640 × 426, 39,146 bytes; SHA-256 `38F2FFB8D839D9FA4E67873B2B72C3BA574DC76EA3CF40DA95CB426EB87E02A0`.
- Visual review found a clear side view of a slender silver fish with the body outline and reflective lateral stripe visible against a blue background. It uses the shared 4:3 `object-fit: contain` frame without cropping. The Commons record provides the image-to-taxon association; the accepted-name cross-check uses [WoRMS AphiaID 212280](https://www.marinespecies.org/aphia.php?p=taxdetails&id=212280).

The image is registered under `worms:212280` for the Indian anchovy feeding-guide entry. It is not localized or presented as proof of Philippine occurrence.

## Approved image review: *Sardinella tawilis*

**Reviewed:** 11 November 2026. This is an image reference for the accepted species; it does not establish a collection locality or a record at any selected fishing ground.

- The [Wikimedia Commons file record](https://commons.wikimedia.org/wiki/File:Sardinella_tawilis.png?oldid=1184849116) describes the image as *Sardinella tawilis*, credits NFRDI-NFBC, and links to the FishBase tawilis photo gallery. It records a single CC BY 3.0 license, which permits commercial reuse and adaptations with attribution.
- The local file is preserved without edits at `public/assets/species/sardinella-tawilis-nfrdi-commons-1184849116.png`; dimensions 600 × 215, 219,827 bytes; SHA-256 `7C24D58E302FF1885BC0CDCA3AD5FC107415521D217D3FB5BBDD6A6855CE82A2`.
- Visual review found a single whole fish in lateral view, with the body outline, scales, forked tail, and centimeter ruler visible. The source is unusually wide, so it remains uncropped and contained in the shared 4:3 frame; the frame may show more background above and below the fish. The accepted-name cross-check uses [WoRMS AphiaID 1016224](https://www.marinespecies.org/aphia.php?p=taxdetails&id=1016224).
- A separate [tawilis food photograph](https://commons.wikimedia.org/wiki/File:Tawilis_(Sardinella_tawilis),_an_endemic_fish_that_can_only_be_found_in_Taal_Lake.jpg?oldid=1028153313) was not selected: it shows several prepared fish in a dish, not an individually identifiable fish profile.

The image is registered under `worms:1016224` for the tawilis feeding-guide entry. The media record does not establish the image's capture locality or a fishing-ground occurrence.

## Approved image review: *Otolithes ruber*

**Reviewed:** 11 November 2026. This reference photo is not evidence of Philippine presence or of presence at any selected fishing ground.

- The [Wikimedia Commons file record](https://commons.wikimedia.org/wiki/File:OtolithRuberDinhDTran.jpg?oldid=1122106262) labels the image “Silver Teraglin, *Otolithes ruber*,” credits Dinh D. Tran, and records a single CC BY 3.0 license. The license allows commercial reuse and adaptations with attribution. Commons identifies [Fishes of Australia species 670](https://fishesofaustralia.net.au/home/species/670) as the source; this record also identifies the taxon.
- The local file is preserved without edits at `public/assets/species/otolithes-ruber-tran-commons-1122106262.jpg`; dimensions 1,062 × 706, 145,219 bytes; SHA-256 `984F7CA4AFC2E5194C03A05D3FDF8853F780363D7AA6642AA06E9D8900E07816`.
- Visual review found one clear lateral profile with the body, head, and fins visible against a black background. It uses the shared 4:3 `object-fit: contain` frame without cropping. The accepted-name cross-check uses [WoRMS AphiaID 218641](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218641).

The image is registered under `worms:218641` for the tiger-toothed croaker feeding-guide entry. It is not localized or presented as proof of Philippine occurrence.

## Approved image review: *Stiphodon palawanensis*

**Reviewed:** 12 November 2026. This image is a historical visual reference; it does not establish current distribution, catchability, or a specific fishing site's present condition.

- The publisher's [Maeda and Palla (2015) article](https://www.mapress.com/zt/article/download/zootaxa.4018.3.3/37431/38815) labels Figure 5d as a live male *Stiphodon palawanensis* observed at Barake Stream, Aborlan, on 15 May 2015. The first page states that the article is licensed under CC BY 3.0. The [license](https://creativecommons.org/licenses/by/3.0/) permits commercial reuse and adaptations with attribution.
- Visual review found a clear, complete side view with the fish's body, tail, and fins visible against stream rocks. The source image is one six-panel figure, so panel d was isolated to fit the shared species-photo slot. The panel letter remains visible; no fish detail was retouched or removed.
- The extracted source figure is preserved without changes at `data/research/philippines/national/reviews/stiphodon-palawanensis-maeda-palla-fig5-original-2015.jpg` (2,008 × 2,259 px, 1,454,576 bytes; SHA-256 `5E377C65E17D3E72BAC4DDA9AC3C2B4EB7143A4B46106F99AA684EFB27D72233`). The local app image is `public/assets/species/stiphodon-palawanensis-maeda-palla-2015-fig5d.jpg` (1,004 × 753 px, 147,097 bytes; SHA-256 `6B7A5FA0B4CC35401FFCA1A08FD20DDDC5623D5694F5B76E07DFEAA7BAE83B23`). It is a direct panel crop with natural colors retained.
- The accepted-name cross-check uses [WoRMS AphiaID 1006861](https://www.marinespecies.org/aphia.php?p=taxdetails&id=1006861). The visible credit identifies Maeda and Palla (2015), Figure 5d, and marks the panel crop under CC BY 3.0.

The photo is registered under `worms:1006861` for the Palawan goby feeding-guide entry. Its historical locality is source context only, not a current occurrence or catch recommendation.

## Screened Minalin fish panels — not admitted

**Reviewed:** 16 November 2026. See `data/research/philippines/national/reviews/central-luzon-minalin-publisher-media-refresh-20261116.json` and the source table review.

- Baysa et al.'s Appendix A labels fish panels within one small composite grid. The available publisher PDF renders each panel too small for a clear, independently identifiable species profile, and some views do not show a complete diagnostic outline. Cropping a panel would not restore missing resolution.
- The article states CC BY 4.0, but the media still does not meet the standard's visual identity and profile-quality requirements. Its Figure 1 is a boat/gear scene, not a fish reference.
- **Disposition:** no panel or boat photograph was copied, cropped, or registered. Keep the shared no-verified-photo fallback for these taxa unless an independently identified, suitably resolved image clears its own rights review.

## Reviewed historical source figures — La Mesa Reservoir host-fish paper (not admitted)

**Reviewed:** 16 November 2026. See `data/research/philippines/national/reviews/ncr-la-mesa-reservoir-fish-host-crosswalk-20261116.json`.

- The 1991 NAST paper's reviewed figures depict ectoparasites, not standalone fish photographs. The separate SEAFDEC 2001 chapter and abstract reviewed in the same source bundle provide no independently reusable fish portrait.
- **Disposition:** no parasite figure, generic reservoir photo, or uncited fish illustration was added to the species registry. The current approved photo set remains unchanged; future images must match an individual accepted taxon, carry source/creator credit, and have item-level reuse terms suitable for the app.

## Asset-to-registry visual cross-check

**Reviewed:** 24 November 2026. This pass rechecks that the six local files match their registry assignments and visible descriptions, and that their SHA-256 values remain unchanged from the individual reviews. It is not an independent scientific re-identification of the photographed specimens.

| Registry taxon | Visual cross-check |
| --- | --- |
| *Oreochromis niloticus* | Deep-bodied tilapia profile, dark fin markings, and pale underside match the registry alt text. |
| *Channa striata* | Elongated snakehead profile, mottled back, long dorsal fin, and reddish pectoral fin match the registry alt text. |
| *Stolephorus indicus* | Slender silver anchovy with a reflective lateral stripe matches the registry alt text. |
| *Sardinella tawilis* | Whole silvery fish in lateral view with forked tail and centimeter ruler matches the registry alt text. |
| *Otolithes ruber* | Pale, elongated fish with a large eye and visible fins matches the registry alt text. |
| *Stiphodon palawanensis* | Banded goby on stream rock with dorsal-fin spots matches the registry alt text; the source panel marker `d` is retained. |

All six mapped paths resolve to the intended local files, and their current SHA-256 values match the hashes recorded in the individual reviews above. The shared `SpeciesImage` component uses the local registry, a 4:3 `object-fit: contain` frame, and source/creator/license/identification credits; an unregistered taxon continues to receive the neutral fallback. No image was edited or added, and the photo set does not establish local occurrence for any fishing area.

## Held photo candidate: *Stolephorus commersonnii*

**Reviewed:** 12 November 2026.

**Search refreshed:** 24 November 2026.

- The [FishBase gallery](https://nrm-fishbaselinux01.nrm.se/photos/ThumbnailsSummary.php?ID=566) lists individual photos with different photographers and per-image rights; FishBase says to contact contributors for reuse permission. No particular image was cleared from that listing. A [Fishes of Australia photo](https://fishesofaustralia.net.au/home/species/3993) is taxon-labeled but carries a CC BY-NC license, so it does not meet this project's commercial-reuse criterion. The [iNaturalist taxon record](https://api.inaturalist.org/v1/taxa/354106) has a CC BY-NC default photo. The [UMCES media-library item](https://ian.umces.edu/media-library/stolephorus-commersonnii-commersons-anchovy/) is CC BY-SA 4.0 but is a symbol illustration, not a photograph. The [Commons lab photo](https://commons.wikimedia.org/wiki/File:Stolephorus_indicus_(larger_specimens)_with_commerson%27s_anchovy_(smaller_specimens)_in_a_lab.jpg) shows larger *S. indicus* alongside smaller Commerson's anchovies, so it is a mixed-species group and not a clean single-taxon field-guide photo.
- The Mekong River Commission's [2025 fish photo book](https://www.mrcmekong.org/?document_id=01BMXYOAC3MO6MEMDHFFBI6BLIKXQQTRII&download_document=1&name=Fishes-Photo-Book-for-Fish-Abundance-and-Diversity-Monitoring-in-Lower-Mekong-Basin.pdf) includes a labeled *S. commersonnii* photo crediting Sahat Ratmuangkwhang and BOLDsystems. Its terms allow reproduction for educational or nonprofit purposes with acknowledgment and notification to MRC, but prohibit commercial use without written permission; the book does not state a separate item-level license for this photo. **Disposition: do not add it to Bangwit unless image-specific reuse terms are confirmed for the app.**
- The [MCZbase record for MCZ:Ich:6133](https://mczbase.mcz.harvard.edu/guid/MCZ%3AIch%3A6133) links this Mauritius specimen to Hata et al. (2021)'s neotype designation for *S. commersonnii*. The record's current identification is *S. extensus*, with a previous expert identification as *S. commersonnii* by Hata in 2021, so retain that taxonomic context when matching media. Its lateral specimen image ([media 837842](https://mczbase.mcz.harvard.edu/media/RelatedMedia.cfm?media_id=837842)) is explicitly licensed CC BY-NC-SA 4.0, which does not meet Bangwit's commercial-reuse criterion. **Disposition: taxonomically valuable evidence, but not an app asset under the current image policy.**
- Targeted [iNaturalist API photo-license searches](https://api.inaturalist.org/v1/observations?taxon_id=354106&photo_license=cc-by,cc-by-sa) for CC BY and CC BY-SA observations returned no records. This does not rule out future contributions, but no additional candidate cleared the review during this search.
- The refreshed [Wikimedia Commons category](https://commons.wikimedia.org/wiki/Category:Stolephorus_commersonnii) adds no cleared standalone photo. The 1878 [Francis Day plate](https://commons.wikimedia.org/wiki/File:Engraulis_commersonianus_Day_158.jpg) is public domain but its file page explicitly says the depicted name/identity needs verification; a second file is a mixed-species laboratory image, unsuitable as a single-taxon reference. [Ikan bilis tembaga](https://commons.wikimedia.org/wiki/File:Ikan_bilis_tembaga.jpg) is a CC BY 4.0 photo of dried fish, which does not show the diagnostic whole-fish profile needed in Bangwit's photo slot.
- The 2018 [ICAR-CIFRI and Chilika Development Authority fish guide](https://www.chilika.com/documents/publication_1564535640.pdf) shows a species-captioned *S. commersonnii* photo, but the book's copyright page permits unlicensed reproduction only for educational or other non-commercial purposes and requires prior written permission for resale or other commercial purposes. Photo credits are shared across contributors, and no separate license for this particular image was located. **Disposition: hold pending item-level commercial reuse permission.**
- The [IAN Media Library symbol](https://ian.umces.edu/media-library/stolephorus-commersonnii-commersons-anchovy/) is explicitly a 500 × 150 symbol by Jane Thomas under CC BY-SA 4.0, not a photograph. Do not substitute it into the photo slot; it could only be reconsidered as a clearly labeled illustration if Bangwit later supports that media type.

Keep the shared fallback until a standalone photo has verified taxon identity and item-level reuse rights that cover the app's intended distribution. The latest search still found no commercially reusable, standalone photo with a sufficiently supported *S. commersonnii* identification; its historical Indo-Pacific records also need care because later taxonomic work distinguishes several formerly lumped species.

## Held local photo candidate: *Channa striata*, Pila, Laguna

- The [Wikimedia Commons file page](https://commons.wikimedia.org/wiki/File:Channa_striata,_Philippines,_Pila,_Laguna.jpg?oldid=1275447391) records a 3,803 × 1,516 px side-view fish photo by Reyes, R.B., sourced from FishBase image `Chstr_uk.jpg`, with locality metadata Pila, Laguna. Its description associates the file with *Channa striata*.
- The Commons file page displays both CC BY-SA 4.0 and CC BY 4.0 statements in different sections. That conflict needs resolution against the original FishBase contributor terms before reuse. **Disposition: hold; no local copy or registry entry.**

The Pila image remains a sourcing lead only. Its locality is not treated as a new occurrence record or proof that *C. striata* occurs in any selected fishing ground.

## Held source figure — Looc Lake fish assemblage article

**Reviewed:** 24 November 2026. See `data/research/philippines/national/reviews/central-luzon-looc-lake-fish-assemblage-fulltext-review-20261124.json`.

- Figure 3's extracted caption maps panels A–H to the eight fish taxa listed in the article, and the PDF copyright footer states CC BY 4.0. The PDF was not locally rendered, so the panels themselves, their image quality, and the caption-to-image matches have not been visually checked.
- **Disposition:** no panel was copied, cropped, or admitted to the species-image registry. Treat Figure 3 as a research lead only; before any reuse, visually inspect the specific panel, confirm the taxon match and item-level attribution, and retain the source/license trail. Unapproved taxa continue to use the localized neutral fallback.
- Source: [publisher article page](https://www.mbimph.com/index.php/UPJOZ/article/view/5953); [article PDF](https://mbimph.com/index.php/UPJOZ/article/download/5953/9294/9682).

## Reviewed source figure — Marikina River fish-host preprint (not admitted)

**Reviewed:** 16 November 2026. See `data/research/philippines/national/reviews/ncr-marikina-river-fish-hosts-crosswalk-20261116.json`.

- Figure 2 on PDF page 18 has eight caption-labeled fish panels (*Clarias batrachus*, *C. gariepinus*, *Channa striata*, *Monopterus albus*, *Pterygoplichthys pardalis*, *P. disjunctivus*, *Oreochromis niloticus*, and *Sarotherodon melanotheron*) with a 5 cm scale bar. The panel labels agree with the paper's fish table.
- The repository record states CC BY 4.0. The reviewed figure page had no separate third-party credit line. Any later reuse still needs an attribution trail to the paper and a check that the figure license applies to the selected panel.
- **Disposition:** no panel crops or canonical assets were added. These are panels from a research figure, not separately reviewed standalone images. Keep the existing six approved canonical photos unchanged; review standalone framing, display quality, taxon confidence, and visible credit before adding any derivative to `src/lib/species-images.ts`.
