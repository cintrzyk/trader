import Client from '../../backend/github/client';
import apiMock from '../__mocks__/api';

const client = new Client();

test('returns valid github response', () => {
  expect.assertions(1);
  console.log('!!!!!!', `https://github.com/${process.env.GITHUB_ORG_NAME}/transterra/pull/321`);
  const url = `https://github.com/${process.env.GITHUB_ORG_NAME}/transterra/pull/321`;

  return expect(client.fetchPullRequest(url)).resolves.toEqual('Paul');
});
