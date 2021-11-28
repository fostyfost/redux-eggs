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

const getDefaultConfig = (tsOptions = {}) => ({
  input: './src/index.ts',
  plugins: [
    peerDepsExternal({ includeDependencies: true }),
    eslint({
      throwOnError: true,
      throwOnWarning: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    }),
    ts({
      browserslist: ['defaults'],
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      ...tsOptions,
    }),
    terser(terserOptions),
    filesize(),
  ],
})

const config = [
  {
    ...getDefaultConfig({
      tsconfig: resolvedConfig => ({
        ...resolvedConfig,
        declaration: true,
      }),
    }),
    output: {
      file: './dist/index.js',
      format: 'cjs',
    },
  },
  {
    ...getDefaultConfig(),
    output: {
      file: './dist/index.es.js',
      format: 'es',
    },
  },
]

export default config
