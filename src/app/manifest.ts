import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Sri Sai Baba Tool Rental",
    short_name: "Tool Rental",
    description: "Tool rental management app for inventory, rentals, returns, and history.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdfdff",
    theme_color: "#0f766e",
    categories: ["business", "productivity"],
    lang: "en",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/install-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Desktop dashboard overview",
      },
      {
        src: "/screenshots/install-mobile.png",
        sizes: "540x1200",
        type: "image/png",
        label: "Mobile active rentals view",
      },
    ],
  };
}
