# Complete bilingual policy draft snapshot

Prepared: 19 October 2026. **Exact source-copy appendix for review; NOT APPROVED.** No wording was rewritten, no notice was accepted, and no legal adequacy or participant-readiness conclusion is supplied by this export. Read the [privacy packet](../CAVITE_PRIVACY_REVIEW_PACKET.md), [review decisions](../CAVITE_PRIVACY_REVIEW_DECISIONS.md) and [participant notice draft](../CAVITE_PILOT_PARTICIPANT_NOTICE.md) with it.

## Source identity and display scope

- Repository source commit at extraction: `2f08dc7fe01d8b27613613df8e1cc50ff04afe7d`. The seven app sources below matched this commit; concurrent documentation/research edits are outside this app-text snapshot. This identifies reviewed source, not the currently deployed site or a selected pilot release.
- App acknowledgment version: `prototype-6`; browser storage key: `bangwit.policy.2026-09-prototype`. The stored acknowledgment contains a version and acceptance timestamp. Its existence does not establish legal adequacy or pilot-participation consent.
- App date fields are preserved verbatim below: Privacy Notice is dated 19 October 2026; Terms of Use remains dated 17 October 2026, in each language. The extraction date does not change either app date.
- The access dialog renders the complete Privacy Notice, then Terms of Use, followed by the limitations summary, read status, checkbox/button and disclaimer. The combined `/policies` page renders the shared title/introduction/disclaimer and full documents; `/privacy` and `/terms` redirect there.
- Source metadata `tag`/`reviewNotice` is included even where the renderer does not display it: the document renderer uses title, date and sections; the combined page separately displays the Privacy review notice and `settings.policiesTag`. The dialog's label is `policy.tag`. Repeated shared text is listed once per language and applies wherever that source key is rendered.
- The checkbox starts disabled until read completion; continue also requires the checkbox. A language change resets reading/checkbox progress in the gated dialog. These are source facts; they do not certify comprehension, consent or the usability of a particular device.

### Source fingerprints

SHA-256 values are for the exact file bytes read at extraction. Changed bytes mean this snapshot must be checked again; whitespace-only changes can also change a file hash.

| App content / rendering source | SHA-256 |
| --- | --- |
| [src/i18n/dictionaries/en.ts](../../src/i18n/dictionaries/en.ts) | `e0b0edbde9c4550f58c420980d91fb09493152eefb5e28ed091da581e1ccb673` |
| [src/i18n/dictionaries/fil.ts](../../src/i18n/dictionaries/fil.ts) | `c8ae0daa041c44e50f5402d979b28cae15202aceea9930ec1de5075d29275edd` |
| [src/components/bangwit-provider.tsx](../../src/components/bangwit-provider.tsx) | `6f91765b64036c842184b423452af75cf89c9607896cd5c6a1294284ecbe1f65` |
| [src/components/policy-document.tsx](../../src/components/policy-document.tsx) | `f1fb67bea811674456377da29d581165e75ec1c24b0c8817c4960f4050feb8a9` |
| [src/app/policies/page.tsx](../../src/app/policies/page.tsx) | `b3699c9e01d2cdb874d22d65f55fe9c7d934402d8f1e2e0d7168c15a9cf0a247` |
| [src/app/privacy/page.tsx](../../src/app/privacy/page.tsx) | `8d3ba51a9aad25ba50418c605ddd804289a9c250c1ccbf1af58aee7ab47d9aa6` |
| [src/app/terms/page.tsx](../../src/app/terms/page.tsx) | `e10ed5857b03d356905d0be287047c9591069ac35f0be2d7da4ec51dbcbab78c` |

### Exact-copy verification

TypeScript's syntax tree was used to read string literals directly from both dictionaries, preserving Unicode punctuation and decoded string contents without manual retyping. Every leaf string in `policy`, `privacyPage`, `termsPage`, plus `settings.policiesTag`, is exported. en: 11 acknowledgment strings + 1 combined-page label + 11 Privacy sections + 5 Terms sections (including every section heading/paragraph and all four metadata fields per document); fil: 11 acknowledgment strings + 1 combined-page label + 11 Privacy sections + 5 Terms sections (including every section heading/paragraph and all four metadata fields per document). The six provider literals below were separately matched against their source text.

A read-back comparison decoded each source-marked Markdown block, removed only the Markdown heading prefix where present, and compared the complete ordered key/text list with those source literals. Result: **110/110 exact key/text matches**, with no omitted or extra marked strings. SHA-256 of UTF-8 `JSON.stringify` of that ordered list of `{key,text}` pairs: `a4d29931bfe82e7feecaa9eae3e0ae1859283f6cdcfd85c8e26e9b0d44e387c5`. This is documentation/source parity only; it is not an application test, translation review, hosting check or legal approval.

## English — complete dictionary policy copy

### Access acknowledgment and combined-page labels

**Dialog label** (`policy.tag`)

<!-- source: en.policy.tag -->
Prototype access
<!-- /source -->

**Dialog / combined page title** (`policy.title`)

<!-- source: en.policy.title -->
Privacy Policy & Terms of Use
<!-- /source -->

**Introduction** (`policy.desc`)

<!-- source: en.policy.desc -->
Start with the Privacy Policy, then review the Terms of Use before continuing.
<!-- /source -->

**Before read-completion status** (`policy.readToContinue`)

<!-- source: en.policy.readToContinue -->
Scroll to the end of the combined policy to enable the agreement checkbox.
<!-- /source -->

**Read-completion status** (`policy.readComplete`)

<!-- source: en.policy.readComplete -->
You’ve reached the end. You can now select the agreement checkbox.
<!-- /source -->

**Expandable limitations summary label** (`policy.summaryTitle`)

<!-- source: en.policy.summaryTitle -->
Important prototype limitations
<!-- /source -->

**Expandable limitations summary text** (`policy.summaryText`)

<!-- source: en.policy.summaryText -->
Species coverage, fishing rules, boundaries, weather alerts, and food safety advisories are not yet verified. Do not rely on this prototype to determine whether it is legal or safe to fish or consume your catch.
<!-- /source -->

**Agreement checkbox label** (`policy.agreeCheckbox`)

<!-- source: en.policy.agreeCheckbox -->
I have read and agree to these prototype draft notices. I understand catch records and photos stay in this device's browser storage and that this acknowledgment does not authorize cloud uploads.
<!-- /source -->

**Continue button** (`policy.agreeBtn`)

<!-- source: en.policy.agreeBtn -->
Agree and continue
<!-- /source -->

**Draft disclaimer** (`policy.disclaimer`)

<!-- source: en.policy.disclaimer -->
These bilingual notices are prototype drafts. Joseph Lopez maintains Bangwit and monitors tepezzzz070@gmail.com for privacy and support. Hosting-provider request metadata and log handling still need final review before public launch. This does not authorize cloud uploads of catch records.
<!-- /source -->

**Language selector accessible label** (`policy.selectLanguage`)

<!-- source: en.policy.selectLanguage -->
Select language / Pumili ng wika
<!-- /source -->

**Combined page label** (`settings.policiesTag`)

<!-- source: en.settings.policiesTag -->
Terms & privacy
<!-- /source -->

### Privacy Notice — full text and source metadata

**tag** (`privacyPage.tag`)

<!-- source: en.privacyPage.tag -->
Bangwit prototype · draft
<!-- /source -->

**title** (`privacyPage.title`)

<!-- source: en.privacyPage.title -->
Privacy Notice
<!-- /source -->

**lastUpdated** (`privacyPage.lastUpdated`)

<!-- source: en.privacyPage.lastUpdated -->
Last updated: October 19, 2026 · prototype draft
<!-- /source -->

**reviewNotice** (`privacyPage.reviewNotice`)

<!-- source: en.privacyPage.reviewNotice -->
Prototype policy draft · legal review pending
<!-- /source -->

<!-- source: en.privacyPage.sections.0.heading -->
#### Project Owner and Contact
<!-- /source -->

<!-- source: en.privacyPage.sections.0.content -->
Joseph Lopez maintains the Bangwit prototype and monitors tepezzzz070@gmail.com for privacy questions and support. Do not send private catch backups, photos, exact fishing locations, or passwords by email. The final operator/controller wording and request-handling terms remain under review.
<!-- /source -->

<!-- source: en.privacyPage.sections.1.heading -->
#### Voluntary Support Email
<!-- /source -->

<!-- source: en.privacyPage.sections.1.content -->
If you email tepezzzz070@gmail.com, Joseph uses your address and message to respond to your privacy or support request. Gmail/Google also processes the email under its own privacy practices. Joseph will retain support correspondence for 90 days after the request is resolved, then delete his working copies and empty Trash. Google's recovery, backup and legal-retention processes are separate. This operating rule and the final notice remain subject to privacy/legal review.
<!-- /source -->

<!-- source: en.privacyPage.sections.2.heading -->
#### Information Stored
<!-- /source -->

<!-- source: en.privacyPage.sections.2.content -->
When you log a catch, the browser may store species names, date, water type, optional spot labels, length, weight, bait, notes, disposition, and photos. The location field is optional and manually entered. The prototype does not collect GPS coordinates.
<!-- /source -->

<!-- source: en.privacyPage.sections.3.heading -->
#### Where Data is Stored
<!-- /source -->

<!-- source: en.privacyPage.sections.3.content -->
Catch logs and photos reside in this device's local browser storage. There are no Bangwit accounts or automatic uploads or synchronization of catch records and photos in this prototype. Policy acknowledgments and preferences are also saved locally.
<!-- /source -->

<!-- source: en.privacyPage.sections.4.heading -->
#### Purpose and Local Retention
<!-- /source -->

<!-- source: en.privacyPage.sections.4.content -->
Local records let you keep a catch journal, view your personal species collection, and back up or restore your entries. Preferences and acknowledgments support your chosen interface and the prototype notice. Local records stay until you delete them or browser data is cleared or evicted. Deleting browser data does not delete previously exported backup files.
<!-- /source -->

<!-- source: en.privacyPage.sections.5.heading -->
#### Hosting Metadata
<!-- /source -->

<!-- source: en.privacyPage.sections.5.content -->
Vercel hosts the website. The hosting provider's processing of website request metadata or logs is separate from local catch storage: opening a page or requesting an advisory can expose technical information such as IP address, browser details, request path, time, and response status to Vercel. The project was checked on October 17, 2026 on Hobby with no configured drains. Vercel documents a one-hour Hobby runtime-log window; this does not establish a deletion deadline for all CDN, security, or other provider metadata. Those retention details and the final notice remain under review.
<!-- /source -->

<!-- source: en.privacyPage.sections.6.heading -->
#### Public Advisories and Source Links
<!-- /source -->

<!-- source: en.privacyPage.sections.6.content -->
The map requests public advisories from this website and may cache a validated public snapshot in browser storage. That request contains no catch entries, photos, spot labels, profile fields, or GPS coordinates. The public cache is excluded from catch backups and is cleared by Settings erasure; an old copy does not confirm current conditions. Live warnings remain unavailable. Opening an external source link visits that provider's website and its own privacy practices apply.
<!-- /source -->

<!-- source: en.privacyPage.sections.7.heading -->
#### Sharing and Access
<!-- /source -->

<!-- source: en.privacyPage.sections.7.content -->
There is no community feed or public sharing in this build. Anyone with access to this browser profile and device may view stored records. Browser storage does not provide automatic encryption. Please use device screen locks and avoid recording sensitive locations.
<!-- /source -->

<!-- source: en.privacyPage.sections.8.heading -->
#### Backup, Export, and Deletion
<!-- /source -->

<!-- source: en.privacyPage.sections.8.content -->
You can create a local JSON backup under Settings. This file includes catch details, photo data, notes, and any optional manually entered location text. Store downloaded backup files securely. You can also restore backups into an empty journal or delete local journal data, preferences, acknowledgments, and the public advisory cache from Settings. Joseph cannot retrieve or erase your device-local journal remotely; contact the support inbox for guidance without sending the backup itself.
<!-- /source -->

<!-- source: en.privacyPage.sections.9.heading -->
#### Changes to Data Handling
<!-- /source -->

<!-- source: en.privacyPage.sections.9.content -->
If accounts, analytics, social features, external services, or cloud sync are added in the future, this notice will be revised and appropriate notice and consent addressed. Acceptance of this prototype notice does not grant permission for future cloud catch-data uploads.
<!-- /source -->

<!-- source: en.privacyPage.sections.10.heading -->
#### Limitations
<!-- /source -->

<!-- source: en.privacyPage.sections.10.content -->
This notice is a prototype draft, not legal approval. It must undergo qualified legal review and be completed with the operator's confirmed hosting and data-handling facts before any public release.
<!-- /source -->

### Terms of Use — full text and source metadata

**tag** (`termsPage.tag`)

<!-- source: en.termsPage.tag -->
Bangwit prototype · draft
<!-- /source -->

**title** (`termsPage.title`)

<!-- source: en.termsPage.title -->
Terms of Use
<!-- /source -->

**lastUpdated** (`termsPage.lastUpdated`)

<!-- source: en.termsPage.lastUpdated -->
Last updated: October 17, 2026 · prototype draft
<!-- /source -->

**reviewNotice** (`termsPage.reviewNotice`)

<!-- source: en.termsPage.reviewNotice -->
Prototype policy draft · legal review pending
<!-- /source -->

<!-- source: en.termsPage.sections.0.heading -->
#### 1. Prototype Only
<!-- /source -->

<!-- source: en.termsPage.sections.0.content -->
This Bangwit build is for testing interface design and local catch journaling. Species records, fishery boundaries, access points, fishing regulations, closed seasons, protected-species and protected-area restrictions, diet information, bait or method suggestions, and weather, flood, or red-tide alerts are not yet verified.
<!-- /source -->

<!-- source: en.termsPage.sections.1.heading -->
#### 2. Do Not Rely on This for Safety or Legal Decisions
<!-- /source -->

<!-- source: en.termsPage.sections.1.content -->
No information in this prototype guarantees that fishing is legal or safe, that a species may be harvested, or that a catch is safe to consume. Always consult current advisories from BFAR, PAGASA, local government units, and relevant authorities. In emergencies, contact local emergency services immediately.
<!-- /source -->

<!-- source: en.termsPage.sections.2.heading -->
#### 3. Personal Records
<!-- /source -->

<!-- source: en.termsPage.sections.2.content -->
You are solely responsible for the accuracy of information entered into your personal catch log. Catch records and photos remain in this device's browser storage and are not automatically uploaded or synced to Bangwit. They may be lost if browser data is cleared or evicted.
<!-- /source -->

<!-- source: en.termsPage.sections.3.heading -->
#### 4. No Service Guarantee
<!-- /source -->

<!-- source: en.termsPage.sections.3.content -->
This prototype is provided as-is, may change without notice, and may be unavailable offline or online at times. Do not rely on it for navigation, emergency communications, or real-time advisory services.
<!-- /source -->

<!-- source: en.termsPage.sections.4.heading -->
#### 5. Modifications and Future Services
<!-- /source -->

<!-- source: en.termsPage.sections.4.content -->
Terms may change as verified data, user accounts, sharing, external services, or cloud synchronization are added. Appropriate notice and consent will be addressed before processing data in new ways. This draft does not substitute for qualified legal review prior to public launch.
<!-- /source -->

## Filipino — complete dictionary policy copy

### Access acknowledgment and combined-page labels

**Dialog label** (`policy.tag`)

<!-- source: fil.policy.tag -->
Prototype access
<!-- /source -->

**Dialog / combined page title** (`policy.title`)

<!-- source: fil.policy.title -->
Privacy Notice at Terms of Use
<!-- /source -->

**Introduction** (`policy.desc`)

<!-- source: fil.policy.desc -->
Basahin muna ang Privacy Notice, kasunod ang Terms of Use bago magpatuloy.
<!-- /source -->

**Before read-completion status** (`policy.readToContinue`)

<!-- source: fil.policy.readToContinue -->
I-scroll hanggang dulo ang pinagsamang policy para ma-enable ang checkbox.
<!-- /source -->

**Read-completion status** (`policy.readComplete`)

<!-- source: fil.policy.readComplete -->
Nakarating ka na sa dulo. Maaari mo nang i-check ang kahon.
<!-- /source -->

**Expandable limitations summary label** (`policy.summaryTitle`)

<!-- source: fil.policy.summaryTitle -->
Mahahalagang limitasyon ng prototype
<!-- /source -->

**Expandable limitations summary text** (`policy.summaryText`)

<!-- source: fil.policy.summaryText -->
Hindi pa verified ang species coverage, fishing rules, boundaries, weather alerts, o food-safety guidance. Huwag gamitin ito para magpasya kung legal o ligtas mangisda o kung ligtas kainin ang huli.
<!-- /source -->

**Agreement checkbox label** (`policy.agreeCheckbox`)

<!-- source: fil.policy.agreeCheckbox -->
Nabasa at sinasang-ayunan ko ang mga draft notice para sa prototype. Nauunawaan kong sa browser storage ng device na ito nananatili ang catch records at photos, at hindi pahintulot sa cloud upload ang acknowledgment na ito.
<!-- /source -->

**Continue button** (`policy.agreeBtn`)

<!-- source: fil.policy.agreeBtn -->
Sumang-ayon at magpatuloy
<!-- /source -->

**Draft disclaimer** (`policy.disclaimer`)

<!-- source: fil.policy.disclaimer -->
Draft para sa prototype ang mga notice na ito sa Filipino at English. Si Joseph Lopez ang namamahala sa Bangwit at nagmo-monitor ng tepezzzz070@gmail.com para sa privacy at support. Kailangan pa ng final review ang pagproseso ng hosting provider sa request metadata at logs bago public launch. Hindi ito pahintulot na i-upload sa cloud ang mga tala at larawan ng huli.
<!-- /source -->

**Language selector accessible label** (`policy.selectLanguage`)

<!-- source: fil.policy.selectLanguage -->
Pumili ng wika / Select language
<!-- /source -->

**Combined page label** (`settings.policiesTag`)

<!-- source: fil.settings.policiesTag -->
Terms & privacy
<!-- /source -->

### Privacy Notice — full text and source metadata

**tag** (`privacyPage.tag`)

<!-- source: fil.privacyPage.tag -->
Bangwit prototype · draft
<!-- /source -->

**title** (`privacyPage.title`)

<!-- source: fil.privacyPage.title -->
Privacy Notice
<!-- /source -->

**lastUpdated** (`privacyPage.lastUpdated`)

<!-- source: fil.privacyPage.lastUpdated -->
Huling inayos: Oktubre 19, 2026 · prototype draft
<!-- /source -->

**reviewNotice** (`privacyPage.reviewNotice`)

<!-- source: fil.privacyPage.reviewNotice -->
Draft ng prototype policy · kailangan pa ng legal review
<!-- /source -->

<!-- source: fil.privacyPage.sections.0.heading -->
#### Project owner at contact
<!-- /source -->

<!-- source: fil.privacyPage.sections.0.content -->
Si Joseph Lopez ang namamahala sa Bangwit prototype at nagmo-monitor ng tepezzzz070@gmail.com para sa privacy questions at support. Huwag mag-email ng pribadong catch backup, larawan, eksaktong fishing location, o password. Nasa review pa ang final na pagtukoy sa operator/controller at ang paraan ng paghawak sa requests.
<!-- /source -->

<!-- source: fil.privacyPage.sections.1.heading -->
#### Kusang Pag-email sa Support
<!-- /source -->

<!-- source: fil.privacyPage.sections.1.content -->
Kung mag-email ka sa tepezzzz070@gmail.com, gagamitin ni Joseph ang iyong email address at mensahe para tumugon sa privacy o support request mo. Pinoproseso rin ng Gmail/Google ang email ayon sa sarili nitong privacy practices. Itatago ni Joseph ang support correspondence nang 90 araw matapos maresolba ang request, pagkatapos ay buburahin ang kaniyang working copies at aalisin ang mga ito sa Trash. Hiwalay ang recovery, backup at legal-retention processes ng Google. Kailangan pa ng privacy/legal review ang operating rule na ito at ang final notice.
<!-- /source -->

<!-- source: fil.privacyPage.sections.2.heading -->
#### Anong impormasyon ang mase-save
<!-- /source -->

<!-- source: fil.privacyPage.sections.2.content -->
Kapag nag-log ka ng huli, maaaring itago ng browser ang pangalan ng species, petsa, uri ng tubig, opsyonal na spot label, haba, timbang, pain, notes, catch status, at larawan. Opsyonal ang location field at ikaw ang naglalagay nito. Hindi kinukuha ng prototype ang GPS.
<!-- /source -->

<!-- source: fil.privacyPage.sections.3.heading -->
#### Saan ito naka-save
<!-- /source -->

<!-- source: fil.privacyPage.sections.3.content -->
Nasa lokal na browser storage ng device na ito ang catch log at photos. Walang Bangwit account o awtomatikong upload o sync ng catch records at photos sa prototype. Naka-save rin locally ang Terms acknowledgment at optional preferences.
<!-- /source -->

<!-- source: fil.privacyPage.sections.4.heading -->
#### Layunin at lokal na retention
<!-- /source -->

<!-- source: fil.privacyPage.sections.4.content -->
Ginagamit ang local records para sa catch journal, personal species collection, at pag-backup o restore ng entries. Para sa napili mong interface at prototype notice ang preferences at acknowledgments. Mananatili ang local records hanggang burahin mo o ma-clear o ma-evict ang browser data. Hindi nabubura ang dating exported backup files kapag binura ang browser data.
<!-- /source -->

<!-- source: fil.privacyPage.sections.5.heading -->
#### Hosting metadata
<!-- /source -->

<!-- source: fil.privacyPage.sections.5.content -->
Vercel ang host ng website. Hiwalay sa local catch storage ang pagproseso ng hosting provider sa request metadata at logs: kapag nagbukas ng page o humiling ng advisory, maaaring maproseso ng Vercel ang technical information gaya ng IP address, browser details, request path, oras, at response status. Na-check noong Oktubre 17, 2026 na Hobby ang project at walang configured drains. Ayon sa Vercel, isang oras ang Hobby runtime-log window; hindi nito itinatakda kung kailan buburahin ang lahat ng CDN, security, o iba pang provider metadata. Nasa review pa ang retention ng mga iyon at ang final notice.
<!-- /source -->

<!-- source: fil.privacyPage.sections.6.heading -->
#### Public advisories at source links
<!-- /source -->

<!-- source: fil.privacyPage.sections.6.content -->
Humihiling ang map ng public advisories mula sa website na ito at maaaring mag-cache ng validated public snapshot sa browser storage. Walang catch entries, larawan, spot label, profile fields, o GPS coordinates sa request na iyon. Hindi kasama sa catch backups ang public cache at nabubura ito sa Settings erasure; hindi patunay ng kasalukuyang kondisyon ang lumang copy. Unavailable pa ang live warnings. Kapag binuksan ang external source link, pupunta ka sa website ng provider at ang sarili nitong privacy practices ang iiral doon.
<!-- /source -->

<!-- source: fil.privacyPage.sections.7.heading -->
#### Pagbabahagi at access
<!-- /source -->

<!-- source: fil.privacyPage.sections.7.content -->
Walang community feed o public sharing sa build na ito. Ang sinumang may access sa browser profile at device na iyon ay maaaring makakita ng local data. Hindi awtomatikong nagbibigay ang browser storage ng encryption o hiwalay na account protection. Gumamit ng screen lock at huwag mag-log ng sensitibong lokasyon kung ayaw mong naroon ito.
<!-- /source -->

<!-- source: fil.privacyPage.sections.8.heading -->
#### Pag-backup, pag-export, at pagbura
<!-- /source -->

<!-- source: fil.privacyPage.sections.8.content -->
Maaari kang gumawa ng local JSON backup sa Settings. Kasama rito ang catch details, photos, notes, at anumang optional na location text na ikaw ang naglagay. Ingatan ang na-download na file. Maaari mo itong i-restore sa empty Bangwit journal o burahin ang local journal data, preferences, acknowledgments, at public advisory cache sa Settings. Hindi kayang kunin o burahin ni Joseph nang remote ang journal sa device mo; humingi ng gabay sa support inbox nang hindi ipinapadala ang backup mismo.
<!-- /source -->

<!-- source: fil.privacyPage.sections.9.heading -->
#### Pagbabago sa data handling
<!-- /source -->

<!-- source: fil.privacyPage.sections.9.content -->
Kung magdagdag sa hinaharap ng accounts, analytics, sharing, external services, o cloud sync, babaguhin ang notice at magbibigay ng angkop na impormasyon at hihingi ng consent. Hindi pahintulot sa future cloud upload ng catch data ang pagtanggap sa prototype notice na ito.
<!-- /source -->

<!-- source: fil.privacyPage.sections.10.heading -->
#### Limitasyon
<!-- /source -->

<!-- source: fil.privacyPage.sections.10.content -->
Prototype draft lang ang notice na ito at hindi ito legal approval. Kailangan ito ng qualified legal review at kailangang punan ng kumpirmadong detalye tungkol sa operator, hosting, at aktuwal na paghawak sa data bago ilunsad sa publiko.
<!-- /source -->

### Terms of Use — full text and source metadata

**tag** (`termsPage.tag`)

<!-- source: fil.termsPage.tag -->
Bangwit prototype · draft
<!-- /source -->

**title** (`termsPage.title`)

<!-- source: fil.termsPage.title -->
Terms of Use
<!-- /source -->

**lastUpdated** (`termsPage.lastUpdated`)

<!-- source: fil.termsPage.lastUpdated -->
Huling inayos: Oktubre 17, 2026 · prototype draft
<!-- /source -->

**reviewNotice** (`termsPage.reviewNotice`)

<!-- source: fil.termsPage.reviewNotice -->
Draft ng prototype policy · kailangan pa ng legal review
<!-- /source -->

<!-- source: fil.termsPage.sections.0.heading -->
#### 1. Prototype lamang
<!-- /source -->

<!-- source: fil.termsPage.sections.0.content -->
Ang Bangwit build na ito ay pang-testing ng interface at local catch journal. Hindi pa verified ang species records, fishery boundaries, access points, fishing rules, closed seasons, protected-species at protected-area restrictions, impormasyon tungkol sa diet, mungkahi sa pain o paraan ng pangingisda, at weather, flood, o red-tide alerts.
<!-- /source -->

<!-- source: fil.termsPage.sections.1.heading -->
#### 2. Huwag gawing batayan ng kaligtasan o legal na desisyon
<!-- /source -->

<!-- source: fil.termsPage.sections.1.content -->
Walang impormasyon sa prototype na garantiya na legal o ligtas mangisda, na puwedeng hulihin ang isang species, o na ligtas kainin ang isang catch. Tingnan ang kasalukuyang abiso ng BFAR, PAGASA, LGU, protected-area authorities, at iba pang kaukulang ahensiya. Sa panganib o aksidente, makipag-ugnayan agad sa lokal na emergency services.
<!-- /source -->

<!-- source: fil.termsPage.sections.2.heading -->
#### 3. Personal na tala
<!-- /source -->

<!-- source: fil.termsPage.sections.2.content -->
Ikaw ang responsable sa katumpakan ng mga impormasyong inilagay mo sa personal na catch log. Mananatili sa browser storage ng device na ito ang catch records at photos; hindi awtomatikong ia-upload o isi-sync ang mga ito sa Bangwit. Maaari silang mawala kapag binura o na-evict ang browser data.
<!-- /source -->

<!-- source: fil.termsPage.sections.3.heading -->
#### 4. Walang garantiya ng serbisyo
<!-- /source -->

<!-- source: fil.termsPage.sections.3.content -->
Maaaring magbago o hindi gumana ang prototype at maaaring wala itong internet o offline access sa ilang oras. Huwag umasa rito bilang navigation, emergency communications, o real-time advisory service.
<!-- /source -->

<!-- source: fil.termsPage.sections.4.heading -->
#### 5. Mga pagbabago at susunod na serbisyo
<!-- /source -->

<!-- source: fil.termsPage.sections.4.content -->
Maaaring magbago ang mga tuntunin kapag nagdagdag ng verified data, accounts, sharing, external services, o cloud sync. Magbibigay ng angkop na abiso at aalamin ang consent bago magproseso ng data sa bagong paraan. Hindi kapalit ng qualified legal review bago public launch ang draft na ito.
<!-- /source -->

## Provider-defined acknowledgment labels and failure messages

These literal labels/messages are outside the dictionary. Failure text is a possible alert, not evidence that an error occurred during this preparation.

**provider.language.fil**

<!-- source: provider.language.fil -->
Filipino
<!-- /source -->

**provider.language.en**

<!-- source: provider.language.en -->
English
<!-- /source -->

**provider.preferenceReadError.fil**

<!-- source: provider.preferenceReadError.fil -->
Hindi mabasa ang browser preferences. Local storage may be unavailable.
<!-- /source -->

**provider.preferenceReadError.en**

<!-- source: provider.preferenceReadError.en -->
Could not read browser preferences. Local storage may be unavailable.
<!-- /source -->

**provider.policySaveError.fil**

<!-- source: provider.policySaveError.fil -->
Hindi ma-save ang pag-acknowledge. Tingnan ang browser storage settings at subukan ulit.
<!-- /source -->

**provider.policySaveError.en**

<!-- source: provider.policySaveError.en -->
Could not save policy agreement.
<!-- /source -->
