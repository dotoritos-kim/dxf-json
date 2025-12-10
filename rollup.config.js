import { swc } from 'rollup-plugin-swc3'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/esm/bundle.mjs',
      format: 'es',
    },
    {
      file: 'dist/cjs/bundle.cjs',
      format: 'cjs',
    },
  ],
  plugins: [
    swc({
      tsconfig: 'tsconfig.json',
      jsc: {
        parser: {
          syntax: 'typescript',
        },
      },
      isModule: true,
      module: {
        type: 'es6',
        strictMode: true,
      },
      sourceMaps: true,
      minify: true,
    }),
  ],
}
