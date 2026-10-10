import { createSerwistRoute } from "@serwist/turbopack";
import { offlinePrecacheOptions } from "@/lib/offline-precache";

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  cwd: process.cwd(),
  globDirectory: process.cwd(),
  globFollow: false,
  ...offlinePrecacheOptions,
  swSrc: "src/app/sw.ts",
  useNativeEsbuild: false,
  esbuildOptions: { sourcemap: false },
});
