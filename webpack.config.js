const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');


module.exports = (env, options) => {
    // mode: 'development',
    return {
        entry: './src/main.js',
        output: {
            filename: 'js/main-[chunkhash:8].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        // devtool: 'eval',
        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            port: 9000,
            compress: true,
            historyApiFallback: true,
            hot: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './public/index.html'
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name]-[contenthash:8].css',
            }),
            new CompressionPlugin(),
            new WebpackBuildNotifierPlugin({
                title: 'React',
                showDuration: true,
                onCompileStart: true,
            }),
        ],
        optimization: {
            minimizer: [
                new TerserJSPlugin({
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
        new CssMinimizerPlugin({})
            ],
    },
        module: {
        rules: [
            {
                test: /\.js[x]?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        sourceMaps: true,
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.htm[l]?$/,
                loader: 'html-loader'
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    options.mode == 'development' ? { loader: "style-loader" } : { loader: MiniCssExtractPlugin.loader, options: { publicPath: '/' } },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer(),
                                    cssnano()
                                ]
                            }
                        }
                    },
                    {
                        loader: "resolve-url-loader"
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                outputStyle: "compressed",
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[contenthash:8].[ext]',
                            outputPath: 'fonts/'
                        },
                    }
                ],
            },
            {
                test: /\.(png|jpe?g|svg)$/,
                use: 'file-loader?name=images/[name]-[contenthash:8].[ext]'
            }
        ]
    },
}
};
