/**
 * ESLint flat config — Next.js 16 + ESLint 9 + TypeScript-ESLint 8
 *
 * Substitui versão anterior que usava FlatCompat.extends('next/core-web-vitals')
 * — que dava `TypeError: Converting circular structure to JSON` em ESLint 9.
 *
 * Solução: usar `@next/eslint-plugin-next` direto + `typescript-eslint` flat config.
 */

import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. Pastas/arquivos ignorados
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      '**/*.d.ts',
      'sanity/dist/**',
      'next-env.d.ts',
      'coverage/**',
    ],
  },

  // 2. TypeScript ESLint recomendado (parser TS + regras base)
  ...tseslint.configs.recommended,

  // 3. Next.js core-web-vitals + React rules
  {
    files: ['**/*.{ts,tsx,mjs,js,jsx}'],
    plugins: {
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // React 19 — não precisa importar React em JSX
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // TypeScript já valida
      'react/no-danger': 'error', // protege contra XSS
      'react/no-danger-with-children': 'error',

      // Overrides do projeto
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
    },
  },

  // 4. Tests podem ter regras mais relaxadas
  {
    files: ['**/__tests__/**', '**/*.test.{ts,tsx,mjs,js}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // 5. JSON-LD injection via dangerouslySetInnerHTML é LEGÍTIMA em arquivos
  //    SEO/schema (única forma de inserir <script type="application/ld+json">
  //    no React). Conteúdo é sempre JSON.stringify de objetos controlados.
  //    Override também cobre pages que injetam schema inline (Story 1.4 canary,
  //    Stories Epic 7 rede credenciada, etc.)
  {
    files: [
      '**/components/seo/**/*.{ts,tsx}',
      '**/app/page.tsx',
      '**/app/**/page.tsx',
    ],
    rules: {
      'react/no-danger': 'off',
    },
  },
);
