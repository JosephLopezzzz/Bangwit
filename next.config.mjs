import { withSerwist } from "@serwist/turbopack";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

const nextConfig = withSerwist({
  reactStrictMode: true,
  turbopack: {
    root: projectRoot,
  },
});

export default nextConfig;
