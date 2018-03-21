require('dotenv').config();

export const github = {
  token: process.env.GITHUB_TOKEN,
  org: process.env.GITHUB_ORG_NAME,
};

export const slack = {
  botToken: process.env.SLACK_BOT_TOKEN,
  verificationToken: process.env.SLACK_VERIFICATION_TOKEN,
};

export const firebaseServiceAccount = {
  type: 'service_account',
  project_id: process.env.FS_PROJECT_ID,
  private_key_id: process.env.FS_PRIVATE_KEY_ID,
  private_key: process.env.FS_PRIVATE_KEY,
  client_email: process.env.FS_CLIENT_EMAIL,
  client_id: process.env.FS_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://accounts.google.com/o/oauth2/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FS_CLIENT_X509_CERT_URL,
};

export const firebaseClient = {
  apiKey: process.env.FS_API_KEY,
  databaseUrl: process.env.FS_DATABASE_URL,
  messagingSenderId: process.env.FS_MESSAGING_SENDER_ID,
  project_id: process.env.FS_PROJECT_ID,
};

export const port = process.env.PORT;

export const isProduction = process.env.NODE_ENV === 'production';
export const isSsrEnabled = process.env.SSR === true;
