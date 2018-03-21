require('dotenv').config();

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  plugins: [
    new ExtractTextPlugin('styles-bundle.css'),
    new webpack.DefinePlugin({
      'process.env.client': {
        FS_API_KEY: JSON.stringify(process.env.FS_API_KEY),
        FS_DATABASE_URL: JSON.stringify(process.env.FS_DATABASE_URL),
        FS_MESSAGING_SENDER_ID: JSON.stringify(process.env.FS_MESSAGING_SENDER_ID),
        FS_PROJECT_ID: JSON.stringify(process.env.FS_PROJECT_ID),
      },
    }),
  ],
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.scss$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        })),
      },
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },
};
