import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
// https://vitejs.dev/config/
let config;

if (process.env.NODE_ENV === "production") {
  // Production config
  config = defineConfig({
    plugins: [react()],
    // other production-specific config...
  });
} else {
  // Development config
  config = defineConfig({
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        "/tscript-api": process.env.VITE_HTTP_SERVER_URL,
        "/tverse-api": process.env.VITE_HTTP_SERVER_URL,
        "/awaitDoc-api": process.env.VITE_HTTP_SERVER_URL,
        "/records-api": process.env.VITE_HTTP_SERVER_URL,
        "/grabDoc-api": process.env.VITE_HTTP_SERVER_URL,
        "/settings": process.env.VITE_HTTP_SERVER_URL,
        "/notes-api": {
          target: process.env.VITE_WS_SERVER_URL,
          ws: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
}

export default config;
