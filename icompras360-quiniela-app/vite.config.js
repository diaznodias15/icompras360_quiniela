import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      "@adapters": "/src/adapters",
      "@components": "/src/components",
      "@constants": "/src/utilities/constants",
      "@context": "/src/context",
      "@icons": "/src/assets/icons",
      "@layouts": "/src/layouts",
      "@pages": "/src/pages",
      "@router": "/src/router",
      "@services": "/src/services",
      "@store": "/src/store",
      "@styles": "/src/styles",
      "@utilities": "/src/utilities",
    },
  },
});
