import React, { Component, Fragment } from 'react';
import firebase from 'firebase';
import moment from 'moment';
import StatsBadge from './components/StatsBadge';
import Panel from './components/Panel';
import WaitingPrs from './components/WaitingPrs';

class Dashboard extends Component {
  state = {
    pending: 0,
    unassigned: [],
    doneToday: [],
    waitingPrs: {},
  };

  db = firebase.firestore();
  limit = 200; // do not load too many documents

  componentDidMount() {
    this.listenToUnassigned();
    this.listenToPending();
    this.listenToAvgTimeToday();
    this.listenToWaitingPrs();
  }

  componentWillUnmount() {
    this.unsubscribeUnassigned();
    this.unsubscribePending();
    this.unsubscribeAvgTimeToday();
    this.unsubscribeWaitingUsers();
  }

  onWaitingPrAdded = async ({ prId, tradeAvailableAt }) => {
    const prDoc = await this.db.collection('gh_prs').doc(prId).get();
    const userId = prDoc.data().user_id;
    const userDoc = await this.db.collection('gh_users').doc(userId.toString()).get();

    this.setState(prevState => ({
      waitingPrs: {
        ...prevState.waitingPrs,
        [prId]: {
          data: prDoc.data(),
          meta: {
            tradeAvailableAt,
            user: userDoc.data(),
          },
        },
      },
    }));
  }

  onWaitingPrRemoved = (prId) => {
    this.setState(prevState => ({
      waitingPrs: prevState.waitingPrs.filter(u => u.gh_pr_id !== prId),
    }));
  }

  onWaitingPrsChange = snap => snap.docChanges.forEach((change) => {
    const { gh_pr_id: prId, trade_available_at: tradeAvailableAt } = change.doc.data();
    switch (change.type) {
      case 'removed':
        this.onWaitingPrRemoved(prId);
        break;
      case 'added':
        this.onWaitingPrAdded({ prId, tradeAvailableAt });
        break;
      default:
    }
  })

  listenToUnassigned() {
    this.unsubscribeUnassigned = this.db.collection('slack_messages')
      .where('cr_user_id', '==', null)
      .limit(this.limit)
      .onSnapshot((snap) => {
        snap.docChanges.forEach((change) => {
          switch (change.type) {
            case 'added': {
              const prId = change.doc.data().gh_pr_id;

              if (!this.state.unassigned.includes(prId)) {
                this.setState(prevState => ({
                  unassigned: prevState.unassigned.concat(prId),
                }));
              }
              break;
            }
            case 'removed':
              this.setState(prevState => ({
                unassigned: prevState.unassigned.filter(id => id !== change.doc.data().gh_pr_id),
              }));
              break;
            default:
          }
        });
      });
  }

  listenToPending() {
    this.unsubscribePending = this.db.collection('slack_messages')
      .where('cr_start_at', '>=', new Date('1990')) // check if set
      .where('cr_end_at', '==', null)
      .orderBy('cr_start_at', 'desc')
      .limit(this.limit)
      .onSnapshot(snap => this.setState({ pending: snap.size }));
  }

  listenToAvgTimeToday() {
    this.unsubscribeAvgTimeToday = this.db.collection('slack_messages')
      .where('cr_end_at', '>=', moment().startOf('day').toDate())
      .where('cr_end_at', '<=', moment().endOf('day').toDate())
      .limit(this.limit)
      .onSnapshot((snap) => {
        if (!snap.size) {
          this.setState({ doneToday: [] });
          return;
        }
        const data = [];
        snap.forEach(doc => data.push(doc.data()));
        this.setState({ doneToday: data });
      });
  }

  listenToWaitingPrs() {
    this.unsubscribeWaitingUsers = this.db.collection('slack_messages')
      .where('cr_user_id', '==', null)
      .orderBy('trade_available_at', 'desc')
      .limit(25)
      .onSnapshot(this.onWaitingPrsChange);
  }

  avgTimeInSecToday() {
    const data = this.state.doneToday;
    const bySeconds = data.map(d => moment(d.cr_end_at).diff(d.cr_start_at, 'seconds'));
    const avgInSeconds = (bySeconds.reduce((a, accu) => a + accu, 0) / data.length) || 0;

    return moment().subtract(avgInSeconds, 's').toNow(true);
  }

  render() {
    return (
      <Fragment>
        <div className="badge-container">
          <StatsBadge
            label="Waiting"
            icon="users"
            value={this.state.unassigned.length}
          />
          <StatsBadge
            label="Ongoing"
            icon="tasks"
            value={this.state.pending}
          />
          <StatsBadge
            label="Completed Today"
            icon="check-circle"
            value={this.state.doneToday.length}
          />
          <StatsBadge
            label="Avg Time Spent"
            icon="clock-o"
            value={this.avgTimeInSecToday()}
          />
        </div>
        {!!Object.keys(this.state.waitingPrs).length &&
          <Panel title="Waiting for review">
            <WaitingPrs data={this.state.waitingPrs} />
          </Panel>
        }
      </Fragment>
    );
  }
}

export default Dashboard;
