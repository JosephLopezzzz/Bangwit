# Local request observation — partial follow-up

Observed: 19 October 2026, Asia/Manila. **Partial technical evidence only; the current-release hosted traffic check remains open.** This is not a privacy/legal approval, a complete no-transmission result, or pilot acceptance.

## Source and actions

The existing local production build at `http://127.0.0.1:4194` was built from `d6c6d2ecfb2dea626148ca88b8a7391d6a6ffa46`, acknowledgment `prototype-6`. Documentation checkpoint `2f08dc7` does not change that app source. The in-app browser profile retained the single synthetic catch/photo from the [same-origin upgrade test](CAVITE_POLICY_UPGRADE_ACCEPTANCE.md); its draft acknowledgment had already been explicitly authorized and completed. No additional notice was accepted, no real journal was used, and no record was saved, restored, deleted or cleared in this follow-up.

With the supported page-target Network observer enabled, confirmed the synthetic-backup dialog, visited My Catches, Explore, Species, My Species and Settings, reloaded Settings, then returned to the existing catch details. The app displayed its backup-downloaded message; no resulting file path or new backup bytes were independently inspected in this follow-up. The earlier upgrade test's two inspected backups remain separate evidence.

## Observed request subset

| Observation | Recorded result |
| --- | --- |
| HTTP(S) request events retained | 39, all GET to the local test origin |
| Retained requests reporting post data/body entries | 0 |
| External HTTP(S) origins among retained requests | 0 |
| Local `blob:` image request events | 4; these are separate from HTTP(S) traffic |
| Advisory response observed | `/api/advisories`: HTTP 503; live coverage remained unavailable |
| Loading failures among retained events | 0 |
| Final visible journal state | One synthetic catch, TEST photo, `7 in`, `2 lbs`, fake location and original notes |

The session artifact `outputs/qa-policy-upgrade/local-traffic-partial.json` contains sanitized request paths/methods/body flags, step receipts and truncation flags; headers, query values and response bodies are excluded. `followup-preserved-catch.jpg` shows the final synthetic details. Both artifacts stay outside Git.

## Capture limits and harness events

- The Settings full-reload read reported `truncated: true`: older events were evicted. **The retained request subset cannot establish that the entire flow made no external or write requests.** Route-step reads separately reported no truncation. Missing events are not reconstructed or counted as observed.
- An earlier capture attempt was discarded after a download-event wait timed out and reset the observer session. A subsequent direct confirmation completed visibly without waiting for that event. Only the fresh, retained capture above is counted; its final observation receipt is `2026-10-19T15:44:47.702Z`.
- `ServiceWorker.enable` is unsupported through this debugger interface. No worker-target traffic/control/cache/activation proof, raw IndexedDB read, offline transition, reconnect, installed-app or physical-device check was performed.
- The capture covers a local page target after prior setup. It does not cover initial policy acceptance, a new save or restore, other targets, hosted Preview/Production, server-side feed calls, host/CDN logs, extensions or browser/provider telemetry. No external source link was followed.

Retain the source inventory and older dated traffic checks with their original scope. A complete supported capture on the selected fixed HTTPS build/origin, covering the relevant page and worker flow without event loss, is still needed before closing the hosted technical privacy gate. No access protection, network setting or deployment was changed here.
