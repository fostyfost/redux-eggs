import { filesize } from '@redux-eggs-internal/rollup-plugin-filesize'
import eslint from '@rollup/plugin-eslint'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import ts from 'rollup-plugin-ts'

/**
 * @type {object}
 */
const terserOptions = {
  compress: {
    pure_getters: true,
    unsafe: true,
    unsafe_arrows: true,
    unsafe_comps: true,
    unsafe_Function: true,
    unsafe_proto: true,
    unsafe_undefined: true,
  },
  format: {
    comments: false,
  },
}

const getDefaultConfig = (dir, format, tsOptions = {}) => ({
  input: {
    index: './src/index.ts',
    'injector/index': './src/injector/index.ts',
    'injector/legacy': './src/injector/legacy.ts',
    'with-eggs/index': './src/with-eggs/index.ts',
    'with-eggs/legacy': './src/with-eggs/legacy.ts',
  },
  output: {
    dir,
    format,
    generatedCode: {
      preset: 'es2015',
      symbols: false,
    },
    strict: false,
    externalLiveBindings: false,
    freeze: false,
    interop: 'esModule',
  },
  plugins: [
    peerDepsExternal({ includeDependencies: true }),
    eslint({
      throwOnError: true,
      throwOnWarning: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    }),
    ts({
      browserslist: false,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      ...tsOptions,
    }),
    terser(terserOptions),
    filesize(),
  ],
})

const config = [
  getDefaultConfig('dist/cjs', 'cjs', {
    tsconfig: resolvedConfig => ({
      ...resolvedConfig,
      declaration: true,
    }),
  }),
  getDefaultConfig('dist/es', 'es'),
]

export default config
