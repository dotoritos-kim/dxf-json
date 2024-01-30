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
      jsc: {
        parser: {
          syntax: "typescript",
          tsx: false,
          decorators: true,
          dynamicImport: true
        },
        target: "es2020",
        minify: {
          "compress": true
        }
      },
      isModule: true,
      module: {
        type: "commonjs",
        strict: false,
        strictMode: true,
        lazy: false,
        noInterop: false,
        ignoreDynamic: false
      },
      sourceMaps: true,
      minify: true,
      inlineSourcesContent: true
  }),
  ],
}
