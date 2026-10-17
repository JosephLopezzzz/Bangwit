# Cavite pilot baseline — release identity and limits

Reviewed: 17 October 2026
Status: documentation baseline; this file does not declare a new release.

## Source and deployment identity

| Item | Evidence | What it means |
| --- | --- | --- |
| Current checkout at review start | `main`, `2d8fbcf3670fbb1614914ad69bb1263f5ae995db` | This checkout included uncommitted planning-doc edits and a generated `next-env.d.ts` change. |
| Last recorded application source in Production | `43718d65e2c4e1a75346529457365e7288749480`; Vercel deployment `4zT6gvbqj12BVJDNwziTxKXNLK7S`; `https://bangwit.vercel.app/` | This identity was marked Ready in the 15 October record in `docs/MAP_ADVISORIES.md`. It is the last previously recorded application source, not a live check performed for this document. |
| Later recorded Production deployment | documentation commit `6143041`; Vercel deployment `7wYKjmJ6D19SVS9oBjGUps95npgo` | The recorded change was documentation only. It does not include later code changes below. |
| Current source difference from the recorded application source | `package.json`, `src/components/bangwit-provider.tsx`, `src/components/dropdown-select.tsx`, `src/i18n/browser-language.ts`, and associated tests, plus acceptance documentation | Current `main` is not equivalent to the last recorded application release. The latest source changes have not been independently tied to a live deployment here. |

The user reported that the planned tests passed, including mobile, dropdown and installed-app checks. The matching tested commit, complete device/browser details and case-by-case record are not available, so this remains a user-reported result. It is not treated here as proof that current `main` is deployed or that the live site runs those source changes.

## Data and operational state

- Public historical evidence remains 12 records from the reviewed CAS CC0 projection.
- The research ledger contains 52 linked occurrences under 27 candidate names: 12 published, 2 excluded, and 38 pending. The five initial reviews in the current pilot batch remain outside the public snapshot.
- Live advisory coverage remains unavailable. The map preview is fictional and must not be read as a live warning.
- Catch logs and photos remain browser-local. A Git or deployment rollback does not erase IndexedDB; do not clear browser data as a rollback step.
- Terms and Privacy remain prototype drafts. Their public controller/contact and hosting metadata practices are not confirmed.

## Verification boundary

This record was reconciled against the repository history and the cited release records. It did not independently check the live Production deployment, perform a fresh phone run, re-run the complete acceptance suite, deploy, tag, commit or push. Relevant checks for later code/data changes are recorded with those changes.

Before treating a later build as a release, tie the exact built source commit to a Ready deployment, check the deployed origin, and record the changed behavior's desktop/phone/offline evidence. Keep the current user report separate from any new observed pass.

## Rollback reference

The last previously recorded Production application deployment is listed above. If a later release introduces a regression, identify the currently serving deployment in Vercel first, then use the team's authorized rollback/promotion procedure to restore a known-good deployment. Verify the resulting deployment identity. No rollback or deployment action was taken while creating this baseline.

## Tested source checkpoint — 17 October 2026

The source checkpoint for this verification is commit `bb02c5075941bfd4ea81c196488f638b9965c98a` (`feat(pilot): implement Cavite research and policy slice`), pushed to `origin/main`. The following checks were run against that checkout and passed:

| Check | Result |
| --- | --- |
| `npm run test:research` | 18 passed, 0 failed |
| `npm run test:i18n` | 4 passed, 0 failed |
| `npm run test:storage` | 2 passed, 0 failed |
| `npm run test:offline` | 5 passed, 0 failed |
| `npm run test:advisories` | 20 passed, 0 failed |
| `npm run typecheck` | Passed |
| `npm run build` | Passed |

This is source-level verification only. No new Vercel deployment, live-origin check, fresh browser/phone acceptance, or production behavior was verified. The last previously recorded Production application source remains `43718d65e2c4e1a75346529457365e7288749480`; the rollback reference above has not changed. Treat `bb02c50` as tested source, not as a deployed release.
