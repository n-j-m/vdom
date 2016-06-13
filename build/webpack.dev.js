var webpack = require('webpack')
var config = require('./webpack.config')

config.plugins.push(
  new webpack.HotModuleReplacementPlugin()
)

config.devtool = 'eval'

config.devServer = {
  historApiFallback: true,
  port: 3000,
  noInfo: false,
  inline: true,
  hot: true
}

module.exports = config
