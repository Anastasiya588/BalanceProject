'use strict'

const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.ts',
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9001,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        assetModuleFilename: 'asset/[hash][ext][query]',
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            baseUrl: '/',

        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static/icons/fontawesome", to: "static/icons/fontawesome"},
                {from: "./node_modules/feather-icons/dist/feather.min.js", to: "static/icons"},
                {from: "./src/styles", to: "styles"},
                {from: "./src/static/images", to: "static/images"},
                {from: "./src/static/fonts", to: "static/fonts"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "js"},
                {from: "./node_modules/jquery/dist/jquery.min.js", to: "js"},
                {from: "./node_modules/chart.js/auto", to: "js/chart.js/auto"},
                {from: "./node_modules/js-datepicker/dist/datepicker.min.css", to: "css"},
                {from: "./node_modules/js-datepicker/dist/datepicker.min.js", to: "js"},
            ],
        }),],
};