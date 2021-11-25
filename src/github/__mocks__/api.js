import MockAdapter from 'axios-mock-adapter';
import api from 'github/api';

export default new MockAdapter(api);
