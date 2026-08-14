import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Teruskan semua request /api ke backend Express lokal
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      // Teruskan juga /uploads (foto produk dll)
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
    // Jangan watch folder api/ — itu Vercel Serverless Functions
    watch: {
      ignored: ["**/api/**"],
    },
  },
  // Batasi scan dependensi hanya ke src/ — jangan sentuh folder api/ (Vercel Functions)
  optimizeDeps: {
    entries: ["src/**/*.{js,jsx,ts,tsx}"],
  },
});
