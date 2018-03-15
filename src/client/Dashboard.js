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

  onWaitingUserAdded = async ({ prId, tradeAvailableAt }) => {
    const prDoc = await this.db.collection('gh_prs').doc(prId).get();
    const userId = prDoc.data().user_id;
    const userDoc = await this.db.collection('gh_users').doc(userId.toString()).get();

    this.setState((prevState) => {
      const users = prevState.waitingUsers.filter(u => u.id !== userId);
      return {
        waitingUsers: users.concat({
          ...userDoc.data(),
          gh_pr_id: prId,
          trade_available_at: tradeAvailableAt,
        }),
      };
    });
  }

  onWaitingUserRemoved = (prId) => {
    this.setState(prevState => ({
      waitingUsers: prevState.waitingUsers.filter(u => u.gh_pr_id !== prId),
    }));
  }

  onWaitingUserChange = snap => snap.docChanges.forEach((change) => {
    const { gh_pr_id: prId, trade_available_at: tradeAvailableAt } = change.doc.data();
    switch (change.type) {
      case 'removed':
        this.onWaitingUserRemoved(prId);
        break;
      case 'added':
        this.onWaitingUserAdded({ prId, tradeAvailableAt });
        break;
      default:
    }
  })

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
      .onSnapshot(this.onWaitingUserChange);
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
