import { createSerwistRoute } from "@serwist/turbopack";

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  cwd: process.cwd(),
  globDirectory: process.cwd(),
  globFollow: false,
  globPatterns: [
    ".next/static/**/*.{js,css,html,ico,apng,png,avif,jpg,jpeg,jfif,pjpeg,pjp,gif,svg,webp,json,webmanifest}",
    "public/**/*",
  ],
  additionalPrecacheEntries: [{ url: "/~offline", revision: "bangwit-m1" }],
  swSrc: "src/app/sw.ts",
  useNativeEsbuild: false,
  esbuildOptions: { sourcemap: false },
});
