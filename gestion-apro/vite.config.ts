import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/APPAPRO/",

  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      filename: "manifest.json",
      includeAssets: [
        "favicon.jpeg",
        "icons/icon-192.png",
        "icons/icon-512.png"
      ],
      manifest: {
        name: "Academy Pro",
        short_name: "Academy Pro",
        description: "Plateforme de gestion académique Academy Pro",
        start_url: "/APPAPRO/",
        scope: "/APPAPRO/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#2563eb",
        lang: "fr",
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: {
        enabled: true
      }
    })
  ],

  server: {
    open: true
  }
});