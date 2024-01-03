import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // proxy requests that start with /api to the target server
      "/v-api": "http://localhost:5001",
      "/tscript-api": "http://localhost:5001",
    },
  },
});
