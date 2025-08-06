import { swc } from 'rollup-plugin-swc3'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.mjs',
      format: 'es',
    },
    {
      file: 'dist/bundle.cjs',
      format: 'cjs',
    },
  ],
  plugins: [
    swc({
      tsconfig: 'tsconfig.build.json',
      jsc: {
        parser: {
          syntax: "typescript",
        },
      },
      isModule: true,
      module: {
        type: "es6",
        strictMode: true
      },
      sourceMaps: true,
      minify: true,
  }),
  ],
}
