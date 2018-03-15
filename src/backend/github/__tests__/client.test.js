import Client from 'backend/github/client';
import apiMock from '../__mocks__/api';

const client = new Client();

test('returns Github API response', () => {
  expect.assertions(1);
  const prUrl = 'https://github.com/GITHUB_ORG_NAME/transterra/pull/321';
  const apiUrl = 'repos/GITHUB_ORG_NAME/transterra/pulls/321';

  apiMock.onGet(apiUrl).reply(200);

  return expect(client.fetchPullRequest(prUrl)).resolves.toHaveProperty('status', 200);
});
