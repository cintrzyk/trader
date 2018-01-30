const path = require('path');
const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = merge({
  entry: ['babel-polyfill', path.resolve(__dirname, 'server.js')],
  target: 'node',
  output: {
    filename: 'server.bundle.js',
    path: __dirname,
  },
  externals: [nodeExternals()],
}, commonConfig);
