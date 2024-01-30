import path from "path";
import resolveTypeScriptPluginModule from 'resolve-typescript-plugin';
const __dirname = path.resolve();
const ResolveTypeScriptPlugin = resolveTypeScriptPluginModule;

export default {
    mode: 'production',
    output: {
        path: `${__dirname}/dist`,
        filename: 'bundle.js',
        publicPath: '/',
        chunkFormat: 'module',
        libraryTarget: 'umd'
    },
    experiments: {
        outputModule: true,
    },

    entry: './src/index.ts',
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, './src/'),
        },
        extensions: [
            '.webpack.js',
            '.web.js',
            '.ts',
            '.js',
            '.d.ts',
            '...',
        ],
        modules: ['src', 'node_modules'],
        extensionAlias: {
            '.js': ['.ts', '.tsx', '.js', '.jsx'],
            '.jsx': ['.tsx', '.jsx'],
            '.mjs': ['.mts', '.mjs'],
            '.cjs': ['.cts', '.cjs'],
        },
        plugins: [new ResolveTypeScriptPlugin()]
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)?$/,
                exclude: /(node_modules|__tests__)/,
                use: {
                    loader: 'swc-loader',
                },
            },
        ],
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
}