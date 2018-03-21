import path from 'path';

require('dotenv-safe').config({
  path: path.resolve(process.cwd(), '.env.test'),
  example: path.resolve(process.cwd(), '.env.sample'),
});
