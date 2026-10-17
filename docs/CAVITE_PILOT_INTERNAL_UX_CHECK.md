# Cavite pilot internal UX check

**Date:** 17 October 2026
**Build under review:** local app at `http://localhost:3000/`
**Status:** narrow internal interface check; not participant research, a usability pilot, or production acceptance.

## Scope

Checked the first-use guide in the local browser using the existing synthetic prototype state. No catch, photo, exact location, participant data, or external message was created or sent. No offline journal was changed.

## Results

- Opened the guide from Help and moved forward through all four steps.
- Moved from step 2 back to step 1.
- Skipped the guide, reopened it from Help, and confirmed that replay starts at step 1.
- Read the first step in English and Filipino, then restored the original English interface setting.
- Confirmed the later steps distinguish status/coverage, device-local catch logging, and My Species.
- Opened the dashboard's catch-group and source disclosures. The source panel exposed the report, table/page, source owner, checked date, and limitations; the dashboard also clearly labeled live warning coverage unavailable and local bay records unverified.
- Repeated the guide check at a simulated 390×844 browser viewport. Steps 1 and 2 fit without vertical overflow, and Back/Skip/Next remained within the viewport; the browser viewport was reset afterward.
- Found that the first step called a browse choice a “Cavite fishing ground” and implied verified records would appear when data is ready. This overstated what the unverified pilot area selection establishes.
- Found the location label rendered as `CaÃ±acao Bay`; corrected the underlying double-encoded label and used one shared area-name list for both the location control and selection state. Verified that Cañacao Bay can be selected and restored Manila Bay afterward.

## Change made

Updated the first-step copy in both languages to describe the choice as an area to browse and explicitly say it does not confirm fishing access or legal water boundaries. The copy also states that verified local species or rules may be unavailable.

Moved Cavite area names to one shared data constant so the map's visible label, selected-area state, and translated subtitle use the same spelling.

## Limits and follow-up

This check verifies guide navigation, copy, and area selection in one local desktop browser, plus the guide's fit in a simulated phone-sized viewport. It does not verify a physical mobile device, touch behavior, screen-reader behavior, participant comprehension, catch saving while offline, reconnect behavior, or production behavior. Those remain separate pilot tasks and require an isolated test profile for any journal writes. Participant recruitment remains closed until the notice, operator/contact, hosting and retention facts, and required review are complete.
