var path = require('path');
var webpack = require('webpack');
var combineLoaders = require('webpack-combine-loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

const DEVELOPMENT = process.env.NODE_ENV.trim() === 'development';
const PRODUCTION = process.env.NODE_ENV.trim() === 'production';

const extractComponents = new ExtractTextPlugin('styles-[contenthash:10].css');
const extractGlobal = new ExtractTextPlugin('globalStyle-[contenthash:10].css');

if (PRODUCTION) {console.log("in production <===============")};
if (DEVELOPMENT) {console.log("in development <===============")};

var buildEntryPoint = function(entryPoint){
  return [
    'webpack-dev-server/client?http://localhost:8081',
    'webpack/hot/only-dev-server',
    entryPoint
  ]
}

var entry = PRODUCTION
  ? {
    js: ['./src/index.js'],
    jstest1: ['./src/index_test1.js'],
    //vendor: ['./node_modules/react/dist/react']
    vendor: ['react', 'react-dom']
  }
  :
    {
      js: buildEntryPoint('./src/index.js'),
      jstest1: buildEntryPoint('./src/index_test1.js')
    }
  ;

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
        //template: 'index-template.html'
        // because of the InlineManifestWebpackPlugin() below, we renamed index-template.html tp index-template.ejs
        template: 'index-template.ejs',
        filename: 'index.html',
        chunks: ['js', 'vendor'],
        chunksSortMode: 'dependency'
      }),
      new InlineManifestWebpackPlugin({ name: 'webpackManifest' }),

      // the next two plugins generate a new HTML file for Wordpress: index_test1.html
      new HTMLWebpackPlugin({
        //template: 'index-template_test1.html',
        template: 'index-template_test1.ejs',
        filename: 'index_test.html',
        chunks: ['jstest1', 'vendor'],
        chunksSortMode: 'dependency'
      }),
      new InlineManifestWebpackPlugin({ name: 'webpackManifest_test1' }),

      new webpack.NamedModulesPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor', // Specify the common bundle's name.
        minChunks: function (module) {
          //  implicit common vendor chunks: allow only modules in 'node_modules' into vendor chunk
          // this assumes vendor imports exist in the node_modules directory
          return module.context && module.context.indexOf('node_modules') !== -1;
        }
      }),
      //CommonChunksPlugin will now extract all the common modules from vendor and main bundles
      new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest'
          // But since there are no more common modules between them
          // we end up with just the runtime code included in the manifest file
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

var externals = {
  'jquery': 'jQuery',  //jquery is available at the global variable jQuery
  'react': 'React',
  'react-dom': 'ReactDOM'
};


module.exports = {
  externals: externals,
  devtool: 'source-map',
  entry: entry,
  plugins: plugins,
  output: {
    //filename: './bundle.js'
    path: path.join(__dirname, 'dist'),
    publicPath: PRODUCTION ? '/dist/' : '/dist/',
    //filename: PRODUCTION ? '[name].bundle.[hash:12].min.js' : 'bundle.js'
    filename: PRODUCTION ? '[name].[chunkhash].min.js' : '[name].bundle.js'
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
