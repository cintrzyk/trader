import {
  RtmClient,
  WebClient,
  CLIENT_EVENTS,
  RTM_EVENTS,
} from '@slack/client';
import { slack as config } from '../config/config';
import GithubClient from './github/client';
import { parseGithubPRText } from './github/pr-parser';

const slack = new RtmClient(config.botToken);
const slackWeb = new WebClient(config.botToken);

const getGithubMessage = data => [{
  title: 'TTM-234 Slack API Documentation <http://wp.pl|#12>',
  text: '.. to allow the `bundle install` to finish installing gems successfully.\n',
  color: '#e1e4e8',
  author_icon: 'https://avatars3.githubusercontent.com/u/2749593?v=4',
  author_link: 'http://wp.pl',
  author_name: 'berniechiu',
  footer: 'Github API',
  footer_icon: 'https://d2bbtvgnhux6eq.cloudfront.net/assets/favicon-github-0332aa660c6548e285079410739397df.png',
  ts: 123456789,
  mrkdwn_in: ['pretext', 'text', 'fields'],
  callback_id: 'review_action',
  fields: [
    {
      title: '+23 -2',
      value: 'LOC changed in *12* files',
      short: true,
    },
    {
      title: '+123',
      value: 'Commits',
      short: true,
    },
  ],
  actions: [{
    name: 'review',
    text: ':eyeglasses: Code review',
    type: 'button',
    value: 'review',
  }],
}];

slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  console.log('Slack RTM client connected!');
});

slack.on(RTM_EVENTS.MESSAGE, (payload) => {
  console.log('Slack RTM message payload:', payload);
  const githubPRUrl = parseGithubPRText(payload.text);

  if (!githubPRUrl || githubPRUrl.length === 0) {
    return;
  }

  const githubClient = new GithubClient();

  githubClient.fetchPullRequest(githubPRUrl[0]).then((response) => {
    console.log('Github API PR data:', response.data);
    return slackWeb.chat.postMessage(payload.channel, null, {
      as_user: true,
      attachments: getGithubMessage(response.data),
    });
  }).catch((err) => {
    console.log(err);
  });
});

export default slack;
