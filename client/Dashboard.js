import React, { Component } from 'react';
import firebase from 'firebase';
import moment from 'moment';
import StatsBadge from './components/StatsBadge';
import Panel from './components/Panel';
import WaitingUsers from './components/WaitingUsers';

class Dashboard extends Component {
  state = {
    pending: 0,
    unassigned: 0,
    doneToday: [],
    waitingUsers: [],
  };

  db = firebase.firestore();
  limit = 200; // do not load too many documents

  componentDidMount() {
    this.listenToUnassigned();
    this.listenToPending();
    this.listenToAvgTimeToday();
    this.listenToWaitingUsers();
  }

  componentWillUnmount() {
    this.unsubscribeUnassigned();
    this.unsubscribePending();
    this.unsubscribeAvgTimeToday();
    this.unsubscribeWaitingUsers();
  }

  listenToUnassigned() {
    this.unsubscribeUnassigned = this.db.collection('slack_messages')
      .where('cr_user_id', '==', null)
      .limit(this.limit)
      .onSnapshot(snap => this.setState({ unassigned: snap.size }));
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

  listenToWaitingUsers() {
    this.unsubscribeWaitingUsers = this.db.collection('slack_messages')
      .where('cr_user_id', '==', null)
      .orderBy('trade_available_at', 'desc')
      .limit(10)
      .onSnapshot((snap) => {
        snap.docChanges.forEach((change) => {
          const { gh_pr_id, trade_available_at } = change.doc.data();

          if (change.type === 'removed') {
            this.setState(prevState => ({
              ...prevState,
              waitingUsers: prevState.waitingUsers.filter(u => u.gh_pr_id !== gh_pr_id),
            }));
          }

          if (change.type === 'added') {
            this.db.collection('gh_prs').doc(gh_pr_id).get().then((prDoc) => {
              const userId = prDoc.data().user_id;
              this.db.collection('gh_users').doc(userId.toString()).get().then((userDoc) => {
                this.setState((prevState) => {
                  const users = prevState.waitingUsers.filter(u => u.id !== userId);

                  return {
                    ...prevState,
                    waitingUsers: users.concat({
                      ...userDoc.data(),
                      trade_available_at,
                    }),
                  };
                });
              });
            });
          }
        });
      });
  }

  avgTimeInSecToday() {
    const data = this.state.doneToday;
    const bySeconds = data.map(d => moment(d.cr_end_at).diff(d.cr_start_at, 'seconds'));
    const avgInSeconds = (bySeconds.reduce((a, accu) => a + accu, 0) / data.length) || 0;
    return `${moment.duration(avgInSeconds, 'seconds').asMinutes().toFixed(1)}m`;
  }

  render() {
    return (
      <div>
        <div className="badge-container">
          <StatsBadge
            label="Unassigned"
            icon="question-circle-o"
            value={this.state.unassigned}
          />
          <StatsBadge
            label="Ongoing"
            icon="clock-o"
            value={this.state.pending}
          />
          <StatsBadge
            label="Completed Today"
            icon="check"
            value={this.state.doneToday.length}
          />
          <StatsBadge
            label="Avg Time"
            icon="bar-chart"
            value={this.avgTimeInSecToday()}
          />
        </div>
        {!!this.state.waitingUsers.length &&
          <Panel title="Waiting for review">
            <WaitingUsers data={this.state.waitingUsers} />
          </Panel>
        }
      </div>
    );
  }
}

export default Dashboard;
