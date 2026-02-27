import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from 'path';

const config: StorybookConfig = {
  stories: [
    "../src/components/**/*.mdx",
    "../src/stories/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    // Resolve path aliases to match Next.js configuration
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../src"),
        // Mock auth context for Storybook
        "@/contexts/auth-context": path.resolve(
          __dirname,
          "./mocks/auth-context.tsx",
        ),
      };
    }
    return config;
  },
};

export default config;