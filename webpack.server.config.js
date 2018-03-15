const path = require('path');
const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, 'server.js'),
  ],
  target: 'node',
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new UglifyJSPlugin(),
  ],
  externals: [nodeExternals()],
});
