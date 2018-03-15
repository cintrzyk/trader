import { github as config } from 'config/config';
import api from './api';

class Client {
  constructor() {
    this.prRegexp = new RegExp(
      `(https:\/\/)?(www\.)?github\.com\/${config.org}\/([a-zA-Z0-9_-]*)\/pull\/([0-9]*)`
    );
  }

  fetchPullRequest(url) {
    const [number, repo, ..._] = url.match(this.prRegexp).reverse();
    return api.get(`repos/${config.org}/${repo}/pulls/${number}`);
  }
}

export default Client;
