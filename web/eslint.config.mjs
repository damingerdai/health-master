import { fixupConfigRules } from '@eslint/compat';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  // Next's React plugins still use rule context APIs removed in ESLint 10.
  ...fixupConfigRules([...nextCoreWebVitals, ...nextTypescript]),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts'
    ]
  }
];

export default eslintConfig;
