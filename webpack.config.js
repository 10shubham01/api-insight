const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        popup: './src/popup.jsx',
        background: './src/chrome/background.js',
        inject: './src/chrome/inject.js',
        injected: './src/chrome/injected.js',
        contentscript: './src/chrome/contentscript.js',


    },
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader", 
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require("tailwindcss"),
                                    require("autoprefixer"),
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "public" },
            ],
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
