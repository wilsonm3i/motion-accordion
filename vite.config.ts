import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

const entry = fileURLToPath(new URL("./src/index.ts", import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      entryRoot: "src",
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.build.json",
      exclude: ["tests/**/*"],
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry,
      name: "MotionAccordion",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      cssFileName: "styles",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "framer-motion",
        "@base-ui/react/accordion",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
