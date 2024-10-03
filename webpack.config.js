const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const PlitziPlugin = require('@plitzi/plitzi-webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const pluginSchema = require('./src/component/pluginSchema.json');
const PACKAGE = require('./package.json');

const DESTINATION = path.resolve(__dirname, './dist/');

const PluginName = 'demo';

const build = (env, args) => {
  const devMode = args.mode !== 'production';
  const onlyGzip = env.onlyGzip || false;
  const onlyAnalyze = env.onlyAnalyze || false;
  const watch = env.watch || false;

  const modules = {
    entry: { [PluginName]: './src/component/index.js' },
    output: {
      path: DESTINATION,
      library: `PlitziPlugin${PluginName.charAt(0).toUpperCase() + PluginName.slice(1)}`,
      filename: 'plitzi-plugin-[name].js',
      chunkFilename: 'plitzi-plugin-chunk-[name].js',
      libraryTarget: 'umd',
      crossOriginLoading: 'anonymous',
      globalObject: "(typeof self !== 'undefined' ? self : this)",
      publicPath: 'auto'
    },
    watch,
    devServer: {
      allowedHosts: 'all',
      compress: false,
      hot: true,
      liveReload: false,
      historyApiFallback: true,
      static: {
        directory: path.join(__dirname, 'dist')
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      },
      port: 3999
    },
    module: {
      rules: [
        {
          test: /(\.jsx|\.js)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]], // [classic] will disable new JSX compiler and [automatic] will enable it
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime',
                env.WEBPACK_SERVE && 'react-refresh/babel'
              ].filter(Boolean)
            }
          }
        },
        {
          test: /\.(png|jpg|gif|svg|...)$/,
          loader: 'url-loader',
          exclude: /(node_modules|bower_components)/
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {}
            },
            { loader: 'css-loader', options: {} },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: devMode
              }
            }
          ],
          exclude: /(node_modules|bower_components)/
        }
      ]
    },
    plugins: [
      new PlitziPlugin({ isPlugin: true }),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(PACKAGE.version)
      }),
      new MiniCssExtractPlugin({
        filename: 'plitzi-plugin-[name].css',
        chunkFilename: 'plitzi-plugin-chunk-[name].css'
      }),
      new WebpackAssetsManifest({
        output: 'plugin-manifest.json',
        integrity: true,
        integrityHashes: ['sha384'],
        sortManifest: false,
        transform: assets => ({
          author: 'Carlos Rodriguez <crodriguez@plitzi.com>',
          created: new Date().toLocaleDateString(),
          updated: new Date().toLocaleDateString(),
          version: `v${PACKAGE.version}`,
          root: PluginName,
          runtime: {
            scope: `PlitziPlugin${PluginName.charAt(0).toUpperCase() + PluginName.slice(1)}`,
            module: 'Plugin'
          },
          definition: {
            name: "Plitzi's Demo Plugin",
            description: '',
            owner: 'Plitzi',
            verified: true,
            license: 'MIT',
            website: 'https://plitzi.com',
            backgroundColor: '#4422ee',
            icon: 'https://cdn.plitzi.com/resources/img/favicon.svg'
          },
          pluginSchema,
          assets: Object.values(assets).reduce((acum, asset) => {
            return {
              ...acum,
              [asset.src]: {
                ...asset,
                type: asset.src.endsWith('.js') ? 'script' : 'style',
                srcPath: `/plitzi-plugin-${PluginName}/${asset.src}`
              }
            };
          }, {})
        })
      }),
      new CompressionPlugin({
        algorithm: 'gzip',
        filename: onlyGzip ? '[path][base]' : '[path][base].gz',
        deleteOriginalAssets: onlyGzip,
        test: /\.js$|\.css$|\.html$/,
        threshold: 1024,
        minRatio: 0.8
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    ],
    stats: {
      colors: true
    }
  };

  if (env.WEBPACK_SERVE) {
    modules.plugins.push(new ReactRefreshWebpackPlugin());
  }

  if (devMode) {
    modules.devtool = 'source-map';
  } else {
    modules.plugins.push(
      new CleanWebpackPlugin(),
      new FileManagerPlugin({
        events: {
          onEnd: {
            archive: [{ source: './dist', destination: `./dist/plitzi-plugin-${PluginName}.zip` }]
          }
        }
      })
    );
    modules.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: /(webpackIgnore:true|webpackIgnore: true)/
            }
          },
          extractComments: false
        })
      ]
    };
  }

  if (onlyAnalyze) {
    modules.plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 4000 }));
  }

  return modules;
};

module.exports = [build];
