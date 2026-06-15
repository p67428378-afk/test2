// AUTO-MANAGED baseline ESLint flat config (created only when none exists).
// Minimal + JSX-aware so the quality gate can lint the project. Replace with a
// project-specific config (e.g. eslint-plugin-react) as needed.
import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'build/**', 'coverage/**', 'node_modules/**', '*.config.*'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
    },
  },
];
