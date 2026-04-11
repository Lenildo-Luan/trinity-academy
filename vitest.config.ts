import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, defineProject } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));
const isCoverageRun = process.argv.includes("--coverage");

// More info at: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(dirname, "src"),
    },
  },
  test: {
    projects: [
      defineProject({
        resolve: {
          alias: {
            "@": path.join(dirname, "src"),
          },
        },
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.{test,spec}.{ts,tsx}"],
          exclude: ["**/*.stories.*"],
          setupFiles: ["src/test/setup.ts"],
        },
      }),
      ...(!isCoverageRun
        ? [
            defineProject({
              plugins: [
                storybookTest({ configDir: path.join(dirname, ".storybook") }),
              ],
              test: {
                name: "storybook",
                browser: {
                  enabled: true,
                  headless: true,
                  provider: playwright(),
                  instances: [{ browser: "chromium" }],
                },
                setupFiles: [".storybook/vitest.setup.ts"],
              },
            }),
          ]
        : []),
    ],
    coverage: {
      provider: "v8",
      include: ["src/data/lessons.ts", "src/data/courses.ts"],
      exclude: ["**/*.stories.*", "**/index.ts", "**/*.d.ts"],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
        perFile: true,
      },
    },
  },
});
