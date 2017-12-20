import React, { Component } from 'react';
import firebase from 'firebase';
import moment from 'moment';
import StatsBadge from './components/StatsBadge';
import Panel from './components/Panel';

class Dashboard extends Component {
  state = {
    pending: 0,
    unassigned: 0,
    doneToday: [],
  };

  db = firebase.firestore();

  componentDidMount() {
    this.listenToUnassigned();
    this.listenToPending();
    this.listenToAvgTimeToday();
  }

  componentWillUnmount() {
    this.unsubscribeUnassigned();
    this.unsubscribePending();
    this.unsubscribeAvgTimeToday();
  }

  listenToUnassigned() {
    this.unsubscribeUnassigned = this.db.collection('slack_messages')
      .where('cr_user_id', '>=', 2)
      .limit(1000)
      .onSnapshot(snap => this.setState({ unassigned: snap.size }));
  }

  listenToPending() {
    this.unsubscribePending = this.db.collection('slack_messages')
      .where('cr_start_at', '>=', new Date('1990')) // check if set
      .where('cr_end_at', '==', null)
      .limit(1000)
      .onSnapshot(snap => this.setState({ pending: snap.size }));
  }

  listenToAvgTimeToday() {
    this.unsubscribeAvgTimeToday = this.db.collection('slack_messages')
      .where('cr_end_at', '>=', moment().startOf('day').toDate())
      .where('cr_end_at', '<=', moment().endOf('day').toDate())
      .limit(1000)
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
            icon="github"
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
        <Panel title="Code Review over time">
        </Panel>
      </div>
    );
  }
}

export default Dashboard;
