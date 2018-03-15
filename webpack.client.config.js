const path = require('path');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, 'src', 'client', 'app.js'),
  ],
  node: {
    fs: 'empty',
  },
  plugins: [
    new UglifyJSPlugin(),
  ],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public', 'assets'),
  },
});
