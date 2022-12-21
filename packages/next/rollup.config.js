import { filesize } from '@redux-eggs-internal/rollup-plugin-filesize'
import eslint from '@rollup/plugin-eslint'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import ts from 'rollup-plugin-ts'

/**
 * @type {object}
 */
const terserOptions = {
  compress: false,
  mangle: false,
  output: {
    beautify: true,
    comments: false,
  },
}

const getDefaultConfig = (tsOptions = {}, addTerser = false) => {
  const plugins = [
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
    filesize(),
  ]

  if (addTerser) {
    plugins.push(terser(terserOptions))
  }

  return { plugins }
}

const config = [
  {
    ...getDefaultConfig(),
    input: './src/server/index.tsx',
    output: {
      file: './dist/index.server.es.js',
      format: 'es',
    },
  },
  {
    ...getDefaultConfig({
      tsconfig: resolvedConfig => ({
        ...resolvedConfig,
        declaration: true,
      }),
    }),
    input: './src/server/index.tsx',
    output: {
      file: './dist/index.server.js',
      format: 'cjs',
    },
  },
  {
    ...getDefaultConfig({ browserslist: ['defaults'] }, true),
    input: './src/client/index.tsx',
    output: {
      file: './dist/index.client.es.js',
      format: 'es',
    },
  },
  {
    ...getDefaultConfig({
      tsconfig: resolvedConfig => ({
        ...resolvedConfig,
        declaration: true,
      }),
    }),
    input: './src/client/index.tsx',
    output: {
      file: './dist/index.client.js',
      format: 'cjs',
    },
  },
]

export default config
