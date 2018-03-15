import MockAdapter from 'axios-mock-adapter';
import api from 'backend/github/api';

export default new MockAdapter(api);
