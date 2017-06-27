var path = require('path');
var webpack = require('webpack');
var combineLoaders = require('webpack-combine-loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');

const DEVELOPMENT = process.env.NODE_ENV.trim() === 'development';
const PRODUCTION = process.env.NODE_ENV.trim() === 'production';

const extractComponents = new ExtractTextPlugin('styles-[contenthash:10].css');
const extractGlobal = new ExtractTextPlugin('globalStyle-[contenthash:10].css');

if (PRODUCTION) {console.log("in production <===============")};
if (DEVELOPMENT) {console.log("in development <===============")};

var entry = PRODUCTION
  ? ['./src/index.js']
  : [
      './src/index.js',
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://localhost:8081'
  ];

var plugins = PRODUCTION
  ? [
      new webpack.optimize.UglifyJsPlugin(
        // {
        // comments: true,
        // mangle: false,
        // compress: {
        //   warnings: true
        // }
        // }
      ),
      extractComponents,
      extractGlobal,
      new HTMLWebpackPlugin({
        template: 'index-template.html'
      })
    ]
  : [ new webpack.HotModuleReplacementPlugin() ];

plugins.push(
  //pass global variables to the code
  new webpack.DefinePlugin({
    DEVELOPMENT: JSON.stringify(DEVELOPMENT),
    PRODUCTION: JSON.stringify(PRODUCTION)
  })
);

const cssIdentifier = PRODUCTION ? '[hash:base64:10]' : '[path][name]---[local]';

// const cssLoader = PRODUCTION
//   ?   ExtractTextPlugin.extract({
//         loader: 'css-loader?localIdentName=' + cssIdentifier
//       })
//   :   ['style-loader', 'css-loader?localIdentName=' + cssIdentifier];

const cssLoader = PRODUCTION
  ?   extractComponents.extract(
          //'style-loader',
          combineLoaders([
            {
              loader: 'css-loader',
              query: {
                modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            }
          ])
      )
  :   combineLoaders([
        {
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          query: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
        }
      ]);

const cssLoadersGlobal = PRODUCTION
  ?   //['css-loader?localIdentName=[path][name]---[local]']
      extractGlobal.extract(
        combineLoaders([
          {
            loader: 'css-loader',
            query: {
              localIdentName: '[path][name]---[local]'
            }
          }
        ])
      )
  :   ['style-loader', 'css-loader?localIdentName=[path][name]---[local]'];

module.exports = {
  externals: {
    'jquery': 'jQuery'  //jquery is available at the global variable jQuery
  },
  devtool: 'source-map',
  entry: entry,
  plugins: plugins,
  output: {
    //filename: './bundle.js'
    path: path.join(__dirname, 'dist'),
    publicPath: PRODUCTION ? '/dist/' : '/dist/',
    filename: PRODUCTION ? 'bundle.[hash:12].min.js' : 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: [ 'babel-loader' ]
    }, {
      test: /\.(png|jpg|gif)$/,
      exclude: /node_modules/,
      // loaders: ['file-loader'],
      loaders: ['url-loader?limit=10000&name=images/[hash:12].[ext]']
    }, {
      test: /\.css$/,
      exclude: [/node_modules/, path.resolve(__dirname, 'style/globalStyle.css') ],
      //exclude: /node_modules/,
      loader: cssLoader
    }, {
        test: /\globalStyle.css$/,
        exclude: /node_modules/,
        //loaders: ['style-loader', 'css-loader?localIdentName=[path][name]---[local]']
        loaders: cssLoadersGlobal
    }]
  }
};
