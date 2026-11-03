import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The site is served from the root of nithinprasad0.github.io, so base stays "/".
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
});
