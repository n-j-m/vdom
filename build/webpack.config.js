const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = {
  entry: path.resolve('./examples/main.js'),
  output: {
    path: path.resolve('./'),
    filename: 'bundle.js'
  },

  resolve: {
    alias: {
      vdom: path.resolve('./lib', 'index.js')
    }
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      title: require('../package.json').name,
      appMountId: 'root'
    }),
    new ExtractTextPlugin('styles.css')
  ],

  devtool: 'eval',

  devServer: {
    historApiFallback: true,
    port: 3000,
    noInfo: false,
    inline: true,
    hot: true
  }
}

module.exports = config
