const path = require('path');

function tryResolve_(url, sourceFilename) {
    // Put require.resolve in a try/catch to avoid node-sass failing with cryptic libsass errors
    // when the importer throws
    try {
        return require.resolve(url, {
            paths: [path.dirname(sourceFilename)]
        });
    } catch (e) {
        return '';
    }
}

function tryResolveScss(url, sourceFilename) {
    // Support omission of .scss and leading _
    const normalizedUrl = url.endsWith('.scss') ? url : `${url}.scss`;
    return tryResolve_(normalizedUrl, sourceFilename) ||
        tryResolve_(path.join(path.dirname(normalizedUrl), `_${path.basename(normalizedUrl)}`),
            sourceFilename);
}

function materialImporter(url, prev) {
    if (url.startsWith('@material')) {
        const resolved = tryResolveScss(url, prev);
        return {
            file: resolved || url
        };
    }
    return {
        file: url
    };
}

const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
    devtool: 'source-map',
    entry: {
        index: './src/index.js',
        services: './src/services.js',
        contacts: './src/contacts.js'
    },
    output: {
        
        filename: '[name].bundle.js',
        path: buildPath
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',

                options: {
                    presets: ['env']
                }
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.(scss|css|sass)$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        // translates CSS into CommonJS
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        // Runs compiled CSS through postcss for vendor prefixing
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            importer: materialImporter
                        },
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                },
            },

            {
                test: /\.(png|jpeg|jpg|gif)$/,
                use: [{
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/images/',
                            name: '[name].[ext]',
                        },
                    },
                    // {
                    //   loader: 'image-webpack-loader',
                    // },
                ],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            //entry: 'index',
            template: './src/index.html',
            inject: true,
            chunks: 'index',
            filename: 'index.html'
        }),

        new HtmlWebpackPlugin({
            //entry: 'index',
            template: './src/aboutUs.html',
            inject: true,
            chunks: 'index',
            filename: 'aboutUs.html'
        }),
        new HtmlWebpackPlugin({
            //entry: 'contacts',
            template: './src/contacts.html',
            inject: true,
            chunks: 'contacts',
            filename: 'contacts.html'
        }),
        new HtmlWebpackPlugin({
            //entry: 'services',
            template: './src/services.html',
            inject: true,
            chunks: 'services',
            filename: 'services.html'
        }),
        new CleanWebpackPlugin(buildPath),

        new MiniCssExtractPlugin({
            filename: '[name].styles.css'
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                map: {
                    inline: false,
                },
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        }),

        new WorkboxPlugin.GenerateSW({
            // Exclude images from the precache
            exclude: [/\.(?:png|jpg|jpeg|svg)$/],

            // Define runtime caching rules.
            runtimeCaching: [{
                // Match any request ends with .png, .jpg, .jpeg or .svg.
                urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

                // Apply a cache-first strategy.
                handler: 'CacheFirst',

                options: {
                    // Use a custom cache name.
                    cacheName: 'images',

                    // Only cache 10 images.
                    expiration: {
                        maxEntries: 10,
                    },
                },
            }],
        }),

    ],
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};
