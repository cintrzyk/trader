const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
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
};
