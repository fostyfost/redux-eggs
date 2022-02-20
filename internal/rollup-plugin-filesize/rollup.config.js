import eslint from '@rollup/plugin-eslint'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import ts from 'rollup-plugin-ts'

const config = {
  input: './src/index.ts',
  external: ['fs', 'path', 'process', 'util', 'zlib'],
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
