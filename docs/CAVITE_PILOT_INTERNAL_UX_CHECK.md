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
- Found that the first step called a browse choice a “Cavite fishing ground” and implied verified records would appear when data is ready. This overstated what the unverified pilot area selection establishes.

## Change made

Updated the first-step copy in both languages to describe the choice as an area to browse and explicitly say it does not confirm fishing access or legal water boundaries. The copy also states that verified local species or rules may be unavailable.

## Limits and follow-up

This check verifies guide navigation and copy in one local desktop browser. It does not verify mobile layout, screen-reader behavior, participant comprehension, catch saving while offline, reconnect behavior, or production behavior. Those remain separate pilot tasks and require an isolated test profile for any journal writes. Participant recruitment remains closed until the notice, operator/contact, hosting and retention facts, and required review are complete.
