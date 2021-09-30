import eslint from '@rollup/plugin-eslint'
import ts from '@wessberg/rollup-plugin-ts'
import filesize from 'rollup-plugin-filesize'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'

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
    filesize({
      showBrotliSize: true,
      showGzippedSize: true,
      showMinifiedSize: true,
      showBeforeSizes: 'release',
    }),
  ]

  if (addTerser) {
    plugins.push(terser(terserOptions))
  }

  return { plugins }
}

const config = [
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
      format: 'es',
    },
  },
  {
    ...getDefaultConfig({ browserslist: ['defaults'] }, true),
    input: './src/client/index.tsx',
    output: {
      file: './dist/index.client.js',
      format: 'es',
    },
  },
]

export default config
