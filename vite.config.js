import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./screen",
  plugins: [react()],
  build: {
    outDir: "../app/build",
    emptyOutDir: true,
  },
});
