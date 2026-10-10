import { createHash } from "node:crypto";
import type { InjectManifestOptions } from "@serwist/turbopack";

const offlineDocuments = ["/~offline", "/catches"];

export const offlinePrecacheOptions = {
  globPatterns: [
    ".next/static/**/*.{js,css,html,ico,apng,png,avif,jpg,jpeg,jfif,pjpeg,pjp,gif,svg,webp,json,webmanifest}",
    "public/**/*",
  ],
  // Source changes cover HTML changes; asset revisions cover the chunks it references.
  templatedURLs: Object.fromEntries(offlineDocuments.map((url) => [url, ["src/**/*.{ts,tsx,css}"]])),
  manifestTransforms: [
    async (entries) => {
      const revision = createHash("sha256")
        .update(JSON.stringify(entries.map(({ url, revision }) => [url, revision]).sort()))
        .digest("hex");
      return {
        manifest: entries.map((entry) => (offlineDocuments.includes(entry.url) ? { ...entry, revision } : entry)),
        warnings: [],
      };
    },
  ],
} satisfies Pick<InjectManifestOptions, "globPatterns" | "templatedURLs" | "manifestTransforms">;
