import eslint from '@rollup/plugin-eslint'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import ts from 'rollup-plugin-ts'

const config = {
  input: './src/index.ts',
  plugins: [
    nodeResolve(),
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
