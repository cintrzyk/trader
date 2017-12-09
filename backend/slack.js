import {
  RtmClient,
  WebClient,
  CLIENT_EVENTS,
  RTM_EVENTS,
} from '@slack/client';
import moment from 'moment';
import { slack as config } from '../config/config';
import GithubClient from './github/client';
import { parseGithubPRText } from './github/pr-parser';

const slack = new RtmClient(config.botToken);
const slackWeb = new WebClient(config.botToken);

const getGithubMessage = data => [{
  title: data.title,
  title_link: data.url,
  text: data.body,
  color: '#e1e4e8',
  author_icon: data.user.avatar_url,
  author_link: data.user.url,
  author_name: data.user.login,
  footer: 'Github API',
  footer_icon: 'https://d2bbtvgnhux6eq.cloudfront.net/assets/favicon-github-0332aa660c6548e285079410739397df.png',
  ts: moment(data.created_at).unix(),
  mrkdwn_in: ['pretext', 'text', 'fields'],
  callback_id: 'review_action',
  fields: [
    {
      title: `+${data.additions} -${data.deletions}`,
      value: `LOC changed in *${data.changed_files}* files`,
      short: true,
    },
    {
      title: '#pr-id',
      value: data.id,
      short: true,
    },
    {
      title: `+${data.commits}`,
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
