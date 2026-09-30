import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bangwit",
    short_name: "Bangwit",
    description: "Bawat huli, may kuwento.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f8f7",
    theme_color: "#f5f8f7",
    icons: [
      {
        src: "/assets/bilog.png",
        sizes: "1254x1254",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
