/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => {
  const isExample = mode === "example";

  return {
    resolve: {
      alias: {
        reacti8n: resolve(__dirname, "src/index.ts"),
      },
    },
    plugins: isExample
      ? [react()]
      : [
          react(),
          dts({
            include: ["src/**/*.ts", "src/**/*.tsx"],
            exclude: [
              "src/**/*.test.ts",
              "src/**/*.test.tsx",
              "src/tests/**",
              "src/example/**",
            ],
            rollupTypes: true,
          }),
        ],
    build: isExample
      ? {
          outDir: "dist-example",
          emptyOutDir: true,
          rollupOptions: {
            input: resolve(__dirname, "src/example/index.html"),
          },
        }
      : {
          lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "Reacti8n",
            fileName: (format) =>
              format === "es" ? "reacti8n.js" : `reacti8n.${format}`,
            formats: ["es", "cjs"],
          },
          rollupOptions: {
            external: [
              "react",
              "react/jsx-runtime",
              "@formatjs/intl-localematcher",
              "@formatjs/intl-pluralrules",
              "@formatjs/intl-pluralrules/polyfill.js",
              /@formatjs\/intl-pluralrules\/locale-data\/.*/,
            ],
            output: { globals: { react: "React" } },
          },
          sourcemap: true,
        },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/tests/index.ts"],
      coverage: {
        provider: "v8",
        reporter: ["text", "html", "lcov"],
        include: ["src/**/*.ts", "src/**/*.tsx"],
        exclude: [
          "src/**/*.test.ts",
          "src/**/*.test.tsx",
          "src/tests/**",
          "src/example/**",
          "src/index.ts",
          "src/polyfill/index.ts",
        ],
        thresholds: {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  };
});
