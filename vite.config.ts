import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@flowkit/shared-ui/dist/index.css": path.resolve(__dirname, "./packages/shared-ui/src/index.css"),
      "@flowkit/shared-ui": path.resolve(__dirname, "./packages/shared-ui/src/index.ts"),
      "@flowkit/auto-trim-image": path.resolve(__dirname, "./packages/auto-trim-image/src/index.ts"),
      "@flowkit/altitude": path.resolve(__dirname, "./packages/altitude/src/index.ts"),
      "@flowkit/bilibili-subtitle-extractor": path.resolve(__dirname, "./packages/bilibili-subtitle-extractor/src/index.ts"),
      "@flowkit/image-compare-pro": path.resolve(__dirname, "./packages/image-compare-pro/src/index.ts"),
      "@flowkit/logo-dash": path.resolve(__dirname, "./packages/logo-dash/src/index.ts"),
      "@flowkit/video-splitter": path.resolve(__dirname, "./packages/video-splitter/src/index.ts"),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
