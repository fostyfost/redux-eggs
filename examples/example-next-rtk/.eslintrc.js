module.exports = {
  extends: ['next'],
  plugins: ['@jambit/typed-redux-saga'],
  rules: {
    'jsx-a11y/anchor-is-valid': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    {
      files: ['./**/*.ts'],
      excludedFiles: ['./**/*.spec.ts', './**/*.test.ts'],
      rules: {
        '@jambit/typed-redux-saga/use-typed-effects': 'error',
        '@jambit/typed-redux-saga/delegate-effects': 'error',
      },
    },
  ],
}
