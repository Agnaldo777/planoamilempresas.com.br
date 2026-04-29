import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: [
      'src/**/__tests__/**/*.test.ts',
      'src/**/__tests__/**/*.test.tsx',
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/lib/operadoras/**/*.ts',
        'src/types/**/*.ts',
        'src/components/schema/**/*.tsx',
        'src/components/network/**/*.tsx',
      ],
      exclude: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx'],
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
        'src/components/schema/OrganizationJsonLd.tsx': {
          lines: 90,
          branches: 90,
          functions: 90,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@/types': path.resolve(__dirname, './src/types'),
      '@/lib/operadoras': path.resolve(__dirname, './src/lib/operadoras'),
      '@/data/operadoras': path.resolve(__dirname, './src/data/operadoras'),
      '@/components/network': path.resolve(__dirname, './src/components/network'),
      '@/components/schema': path.resolve(__dirname, './src/components/schema'),
      '@/content': path.resolve(__dirname, './src/content'),
      '@/config/seo': path.resolve(__dirname, './src/config/seo.ts'),
      '@': path.resolve(__dirname, './'),
    },
  },
});
