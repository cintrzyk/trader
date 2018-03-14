import moment from 'moment';
import { WebClient } from '@slack/client';
import * as PrCollection from '../../../db/collections/pull-requests';
import firebase from '../../../db/firebase';
import { slack as config } from '../../../../config/config';

const slackWeb = new WebClient(config.botToken);
const db = firebase.firestore();

const closed = async (payload) => {
  console.log('Handle pull request close event!', payload);
  const { pull_request } = payload;
  const prId = pull_request.id.toString();

  if (pull_request.merged_at) {
    PrCollection.updateDoc(prId, {
      updated_at: moment(pull_request.updated_at).toDate(),
      closed_at: moment(pull_request.closed_at).toDate(),
      state: pull_request.state,
    });
  } else {
    PrCollection.deleteDoc(prId);
  }

  const batch = db.batch();
  const codeReviewRequests = await db.collection('slack_messages')
    .where('gh_pr_id', '==', prId)
    .where('cr_end_at', '==', null) // check if set
    .get();

  codeReviewRequests.forEach((d) => {
    const { channel_id, ts } = d.data();
    slackWeb.chat.delete(ts, channel_id); // delete from slack channels
    batch.delete(d.ref); // delete from firebase
  });

  return batch.commit();
};

export default closed;
