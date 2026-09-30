# Bangwit

Next.js, TypeScript, and Tailwind CSS remake for the Cavite pilot. The UI, local catch journal, collection, onboarding, first-use guide, draft policy gate, and local backup/restore flow are in place. Verified species coverage, legal guidance, live alerts, and fully tested offline reload behavior are not available yet.

## Local development

Use Node.js 22.6 or newer to run the storage test script.

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. The older prototype remains at `../bangwit` and uses separate browser storage because its origin and port differ.

## Checks

```powershell
npm run typecheck
npm run lint
npm run format:check
npm run test:storage
npm run build
npm run start
```

The old prototype at `http://127.0.0.1:4173` and this remake at `http://localhost:4174` have separate browser storage. To migrate existing catches, open `http://127.0.0.1:4173/migration.html` on the old origin, download its private JSON backup, then restore it from Settings in the remake while the remake's journal is empty. The backup contains photos and optional spot labels; keep it private. Do not clear the old browser data until the restored entries and images have been checked.

The policy pages are drafts for the prototype, not final legal advice. The app does not need API credentials for these local features. Never put private keys in a `NEXT_PUBLIC_` variable.
