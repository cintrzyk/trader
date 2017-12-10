import webpack from 'webpack';
import webpackConfig from './webpack.server.prod.config';

const compiler = webpack(webpackConfig);

compiler.watch({
  aggregateTimeout: 300, // wait so long for more changes
  poll: true, // use polling instead of native watchers
}, (_err, _stats) => {
  // ...
});
