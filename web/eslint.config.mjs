import { createBrowserConfig } from '../eslint.base.config.mjs';
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...createBrowserConfig(),

  // Next.js 配置
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Web 特定规则
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
