require('dotenv').config();

const {
  GITHUB_TOKEN,
  GITHUB_ORG_NAME,
  NODE_ENV,
  SLACK_BOT_TOKEN,
  SLACK_VERIFICATION_TOKEN,
  SSR,
  PORT,
} = process.env;


export const github = {
  token: GITHUB_TOKEN,
  org: GITHUB_ORG_NAME,
};

export const slack = {
  botToken: SLACK_BOT_TOKEN,
  verificationToken: SLACK_VERIFICATION_TOKEN,
};

export const port = PORT;

export const isProduction = NODE_ENV === 'production';
export const isSsrEnabled = SSR === true;
