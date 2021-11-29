import moment from 'moment'

/**
 * @param  {} data - https://docs.github.com/en/rest/reference/pulls#get-a-pull-request
 */
const newCodeReviewMessage = (data) => [{
  title: data.title,
  title_link: data.html_url,
  text: (data.body || '').split('\n').slice(0,2).join('\n'),
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
      title: `${data.commits}`,
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

export default newCodeReviewMessage;
