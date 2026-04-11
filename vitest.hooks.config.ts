import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    setupFiles: ['src/test/setup.ts'],
    include: ['src/hooks/*.test.tsx'],
    coverage: {
      provider: 'v8',
      include: [
        'src/hooks/use-navigation-blocker.ts',
        'src/hooks/use-quiz-persistence.ts',
        'src/hooks/use-quiz-state.ts',
      ],
      exclude: ['**/*.stories.*', '**/index.ts', '**/*.d.ts'],
    },
  },
})
