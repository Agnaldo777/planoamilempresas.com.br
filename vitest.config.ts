import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['src/**/__tests__/**/*.test.ts', 'src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/operadoras/**/*.ts', 'src/types/**/*.ts'],
      exclude: ['**/__tests__/**', '**/*.test.ts'],
      thresholds: {
        'src/lib/operadoras/amil/rede-credenciada-loader.ts': {
          lines: 80,
          branches: 80,
          functions: 80,
          statements: 80,
        },
        'src/lib/operadoras/amil/slugs.ts': {
          lines: 85,
          branches: 85,
          functions: 85,
          statements: 85,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@/types': path.resolve(__dirname, './src/types'),
      '@/lib/operadoras': path.resolve(__dirname, './src/lib/operadoras'),
      '@/data/operadoras': path.resolve(__dirname, './src/data/operadoras'),
      '@': path.resolve(__dirname, './'),
    },
  },
});
