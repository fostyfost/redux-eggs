module.exports = {
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true,
  },
  extends: [
    'react-app',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'react-hooks'],
  rules: {
    'no-console': 'off',
    strict: ['error', 'global'],
    curly: 'warn',
    quotes: ['error', 'single'],
    'simple-import-sort/sort': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
}
