import {
  RtmClient,
  WebClient,
  CLIENT_EVENTS,
  RTM_EVENTS,
} from '@slack/client';
import moment from 'moment';
import { slack as config } from 'config/config';
import GithubClient from '../github/client';
import { parseGithubPRText } from '../github/pr-parser';
import firebase from '../db/firebase';
import newCodeReviewMessage from './new-code-review-message';

const rtmClient = new RtmClient(config.botToken);
const slackWeb = new WebClient(config.botToken);

rtmClient.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  console.log('Slack RTM client connected!');
});

rtmClient.on(RTM_EVENTS.MESSAGE, (payload) => {
  console.log('Slack RTM message payload:', payload);
  const githubPRUrl = parseGithubPRText(payload.text);

  if (payload.bot_id || !githubPRUrl || githubPRUrl.length === 0) {
    return;
  }

  const githubClient = new GithubClient();

  githubClient.fetchPullRequest(githubPRUrl[0]).then((response) => {
    console.log('Github API PR data:', response.data);
    const {
      additions, id, user, comments, commits, deletions, html_url, locked, merged, state, title,
      updated_at,
    } = response.data;

    firebase.firestore().collection('gh_prs').doc(id.toString()).set({
      additions, id, comments, commits, deletions, html_url, locked, merged, state, title,
      updated_at: moment(updated_at).toDate(),
      user_id: user.id,
    });
    firebase.firestore().collection('gh_users').doc(user.id.toString()).set(user);

    if (state !== 'open') {
      return slackWeb.chat.postMessage(payload.channel, null, {
        as_user: true,
        text: 'Cannot review closed pull request.',
      });
    }

    return slackWeb.chat.postMessage(payload.channel, null, {
      as_user: true,
      attachments: newCodeReviewMessage(response.data),
    }).then((res) => {
      if (res.ok) {
        const messageId = `${payload.channel}__${res.ts}`;
        firebase.firestore().collection('slack_messages').doc(messageId).set({
          id: messageId,
          bot_id: res.message.bot_id,
          channel_id: res.channel,
          team_id: payload.team,
          user_id: payload.user,
          type: payload.type,
          trade_text: payload.text,
          gh_pr_id: id.toString(),
          trade_available_at: moment.unix(res.ts).toDate(),
          trade_created_at: moment.unix(payload.ts).toDate(),
          cr_start_at: null,
          cr_end_at: null,
          cr_user_id: null,
          cr_user_name: null,
          ts: res.ts,
        });
      }
    });
  }).catch((err) => {
    console.log(err);
  });
});

export default rtmClient;
