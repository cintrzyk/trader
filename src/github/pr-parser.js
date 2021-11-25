import { github as config } from 'config/config';
const PR_REGEXP = new RegExp(`(https:\/\/)?(www\.)?github\.com\/([a-zA-Z0-9_-]*)\/([a-zA-Z0-9_-]*)\/pull\/([0-9]*)`);

export const repoName = (url) => {
  const [_number, repo, ..._] = url.match(PR_REGEXP).reverse();
  return repo;
};

export const prNumber = (url) => {
  const [number, ..._] = url.match(PR_REGEXP).reverse();
  return number;
};

export const parseGithubPRText = (text) => {
  if (!text) { return []; }
  const regexp = new RegExp(`(https:\/\/)?(www\.)?github\.com\/${config.org}\/[a-zA-Z0-9_-]*\/pull\/[0-9]*`);
  return regexp.exec(text);
};
