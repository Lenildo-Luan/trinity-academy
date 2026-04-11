// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from "@storybook/nextjs-vite";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path, { dirname } from "path";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");

const config: StorybookConfig = {
  stories: [
    "../src/stories/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
          },
        },
      },
    },
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: fs.existsSync(publicDir) ? ["../public"] : [],
  viteFinal: async (config) => {
    // Resolve path aliases to match Next.js configuration
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../src"),
        "@/data/lessons": path.resolve(__dirname, "./mocks/lessons.ts"),
      };
    }
    return config;
  },
};

export default config;
