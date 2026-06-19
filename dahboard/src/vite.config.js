import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  // 🚀 Force Vite à utiliser esbuild au lieu de Oxc
  esbuild: {
    exclude: [], // Ne pas exclure les fichiers JSX
  },
  optimizeDeps: {
    force: true, // Force la réindexation
  }
});