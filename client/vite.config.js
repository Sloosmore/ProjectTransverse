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
      "/tscript-api": "http://localhost:5001",
      "/tverse-api": "http://localhost:5001",
      "/awaitDoc-api": "http://localhost:5001",
      "/records-api": "http://localhost:5001",
      "/grabDoc-api": "http://localhost:5001",
      "/settings": "http://localhost:5001",

      "/notes-api": {
        target: "ws://localhost:5001",
        ws: true, // Add this line to handle WebSocket connections
      },
    },
  },
});
