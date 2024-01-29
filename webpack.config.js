import path from "path";

const __dirname = path.resolve();

export default {
    mode: 'production',
    output: {
        path: `${__dirname}/dist`,
        filename: 'bundle.js',
        publicPath: '/',
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
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)?$/,
                exclude: /(node_modules|__tests__)/,
                use: {
                    loader: 'swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: "typescript"
                            }
                        }
                    }
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