import { fileURLToPath } from "node:url";
import { withSerwist } from "@serwist/turbopack";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

const nextConfig = withSerwist({
  reactStrictMode: true,
  turbopack: {
    root: projectRoot,
  },
  headers() {
    return [
      {
        source: "/serwist/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }],
      },
    ];
  },
});

export default nextConfig;
