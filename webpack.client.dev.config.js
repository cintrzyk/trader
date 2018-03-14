const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = merge({
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    path.resolve(__dirname, 'client', 'app.js'),
  ],
  plugins: [
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
}, commonConfig);
