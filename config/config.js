require('dotenv').config();

const {
  GITHUB_TOKEN,
  GITHUB_ORG_NAME,
  SLACK_BOT_TOKEN,
  SLACK_VERIFICATION_TOKEN,
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
