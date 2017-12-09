import axios from 'axios';
import { github as config } from '../../config/config';

const api = axios.create({
  baseURL: 'https://api.github.com/',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `token ${config.token}`,
  },
});

export default api;
