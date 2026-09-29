import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const api = `http://localhost:${process.env.PORT ?? 3001}`;

export default defineConfig({
  root: "web",
  plugins: [react(), tailwindcss()],
  build: { outDir: "../dist", emptyOutDir: true },
  server: { proxy: { "/api": api, "/files": api } },
});
