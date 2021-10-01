import eslint from '@rollup/plugin-eslint'
import ts from '@wessberg/rollup-plugin-ts'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

const config = {
  input: './src/index.ts',
  external: ['process', 'path', 'fs', 'util'],
  plugins: [
    peerDepsExternal({ includeDependencies: true }),
    eslint({
      throwOnError: true,
      throwOnWarning: true,
      include: ['src/**/*'],
    }),
    ts({
      browserslist: false,
      include: ['src/**/*'],
      tsconfig: resolvedConfig => ({
        ...resolvedConfig,
        declaration: true,
      }),
    }),
  ],
  output: {
    file: './dist/index.js',
    format: 'cjs',
  },
}

export default config
