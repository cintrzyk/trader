import Grant from 'grant-express';
import { host, isProduction, google } from './config';

const grant = new Grant({
  server: {
    protocol: isProduction ? 'https' : 'http',
    host,
  },
  google,
});

export default grant;
