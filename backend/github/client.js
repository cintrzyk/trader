import api from './api';
import { github as config } from '../../config/config';

class Client {
  prRegexp() {
    return new RegExp(`(https:\/\/)?(www\.)?github\.com\/${config.org}\/([a-zA-Z0-9_-]*)\/pull\/([0-9]*)`);
  }

  fetchPullRequest(url) {
    const [number, repo, ..._] = url.match(this.prRegexp()).reverse();
    console.log('eee', number, repo)
    return api.get(`repos/${config.org}/${repo}/pulls/${number}`);
  }
}

export default Client;
