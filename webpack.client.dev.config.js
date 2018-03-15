const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = merge({
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    path.resolve(__dirname, 'src', 'client', 'app.js'),
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
  node: {
    fs: 'empty',
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public', 'assets'),
    publicPath: 'http://127.0.0.1:3001/assets/',
  },
}, commonConfig);
