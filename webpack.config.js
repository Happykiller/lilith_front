// webpack.config.js
const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const { version } = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Load environment variables from .env and .env.local files
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

module.exports = (env, argv) => {
  console.log(`Webpack:process.env.APP_MODE => '${process.env.APP_MODE}'`);

  // Determine if the build mode is production or development
  const isProduction = process.env.APP_MODE === 'prod';

  return {
    // Set the mode for Webpack. 'production' enables optimizations, 'development' is for debugging.
    mode: isProduction ? 'production' : 'development',

    entry: './src/index.tsx',

    output: {
      // The name of the output bundle.
      filename: 'bundle.[contenthash].js',

      // The path to the output directory, where the bundled files will be saved.
      path: path.resolve(__dirname, 'dist'),

      publicPath: '/',
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@page': path.resolve(__dirname, 'src/page'),
        '@stores': path.resolve(__dirname, 'src/stores'),
        '@usecases': path.resolve(__dirname, 'src/usecases'),
        '@components': path.resolve(__dirname, 'src/components'),
      },
    },

    module: {
      rules: [
        { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
        {
          test: /\.(s[ac]ss|css)$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader', // Extract CSS in production
            'css-loader',
          ],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: './src/public/favicon.ico',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
        },
      }),

      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/public', to: '' }, // Copie les favicons et le manifest dans le dossier de build
        ],
      }),

      new webpack.DefinePlugin({
        APP_CONFIG: JSON.stringify({
          mode: process.env.APP_MODE,
          api_url: process.env.APP_API_URL,
          ws_url: process.env.APP_WS_URL,
          token: process.env.APP_API_TOKEN,
          version: version,
        }),
      }),

      isProduction && new MiniCssExtractPlugin({
        filename: 'styles.[contenthash].css' // Output CSS file
      }),
    ],

    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      historyApiFallback: true,
      port: process.env.APP_PORT ?? '8080',
      hot: true,
      open: true,
    },
  }
};
