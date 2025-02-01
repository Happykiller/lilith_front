const path = require("path");
const dotenv = require('dotenv');
const webpack = require('webpack');
const { version } = require('./package.json');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const configuration = require("./src/config") ;

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

    // Entry point for the application. This is where Webpack starts bundling.
    entry: "./src/index.tsx",

    output: {
      // The name of the output bundle.
      filename: 'bundle.[contenthash].js',

      // The path to the output directory, where the bundled files will be saved.
      path: path.resolve(__dirname, 'dist'),

      publicPath: '/',
    },

    resolve: { 
      extensions: [".ts", ".tsx", ".js", ".json", '.scss', '.svg'],
      alias: {
        '@src': path.resolve(__dirname, 'src/'),
        '@page': path.resolve(__dirname, 'src/page/'),
        '@component': path.resolve(__dirname, 'src/component/'),
      },
    }, 
    
    module: { 
      rules: [
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack'],
        },
        {  
          test: /\.tsx?$/,  
          loader: "ts-loader" 
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader', // Extract CSS in production
            'css-loader',
            'sass-loader'
          ],
        },
        {
          test: /\.(ico)$/,
          type: 'asset/resource', // Ensures favicon.ico is handled as a static asset
          generator: {
            filename: 'favicon.ico', // Place favicon in the root of the output directory
          },
        },
      ]
    },

    plugins: [
      new FaviconsWebpackPlugin({
        logo: './public/logo.png', // Chemin vers votre logo de base
        mode: 'webapp', // Génère des icônes pour PWA
        devMode: 'webapp', // Utilisation en développement
        favicons: {
          appName: 'Vergo Front',
          appDescription: 'Fitness Coach',
          developerName: 'Fabrice Rosito',
          developerURL: null, // Peut être défini si vous souhaitez une URL
          background: '#ffffff',
          theme_color: '#3367D6',
          icons: {
            android: true, // Génère les icônes pour Android
            appleIcon: true, // Génère les icônes Apple
            appleStartup: false, // Pas nécessaire pour cette utilisation
            favicons: true,
            windows: false, // Peut être désactivé pour des besoins réduits
            yandex: false // Pas nécessaire
          }
        }
      }),

      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          '**/*',        // Par défaut, nettoie tout le contenu de "dist"
          'dist/src/',   // Spécifie explicitement la suppression du dossier "src" dans "dist"
        ],
        verbose: true, // Affiche les fichiers supprimés dans la console (utile pour le débogage)
      }),  // Nettoie le dossier dist avant chaque build

      new HtmlWebpackPlugin({
        template: "./src/index.html",
        favicon: './public/favicon.ico',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
        },
      }),

      new CopyWebpackPlugin({
        patterns: [
          { from: 'public', to: 'public' }, // Copie tout le contenu du dossier public vers /dist/public
        ],
      }),

      // Define global constants for use in the application.
      new webpack.DefinePlugin({
        'process.env.APP_API_TOKEN': JSON.stringify(process.env.APP_API_TOKEN),
        'process.env.APP_WS_URL': JSON.stringify(process.env.APP_WS_URL),
        'process.env.APP_API_URL': JSON.stringify(process.env.APP_API_URL),
        'process.env.VERSION': JSON.stringify(version),
      }),

      isProduction && new MiniCssExtractPlugin({
        filename: 'styles.[contenthash].css' // Output CSS file
      }), // Only add plugin in production
    ],

    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },

    devServer: {
      host: '0.0.0.0',

      allowedHosts: "all",

      port: configuration.config().APP_PORT,

      // Serve static files from the 'public' directory.
      static: {
        directory: path.join(__dirname, 'public'),
      },

      // Redirect 404s to index.html to handle client-side routing
      historyApiFallback: true,
    },
  }
}