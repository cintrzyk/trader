const path = require('path');
const nodeExternals = require('webpack-node-externals');
const commonModule = require('./webpack.common.js');

module.exports = {
  entry: path.resolve(__dirname, 'server.js'),
  target: 'node',
  plugins: [],
  output: {
    filename: 'server.build.js',
    path: __dirname,
  },
  module: commonModule,
  externals: [nodeExternals()],
};
