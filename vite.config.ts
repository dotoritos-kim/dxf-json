import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Avoid circular-import races when test files load parser modules in parallel.
    fileParallelism: false,
  },
})
