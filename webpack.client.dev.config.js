const path = require('path');
const webpack = require('webpack');
const commonModule = require('./webpack.common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    path.resolve(__dirname, 'client', 'app.js'),
  ],
  plugins: [
    new ExtractTextPlugin('app.css'),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    port: 3001,
    contentBase: './public',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: 'http://127.0.0.1:3001/',
  },
  module: commonModule,
};
