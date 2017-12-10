import React, { Component } from 'react';
import firebase from 'firebase';
import moment from 'moment';
import StatsBadge from './components/StatsBadge';

class Dashboard extends Component {
  state = {
    items: [],
  };
  firebaseRef = firebase.database().ref('pr');

  componentWillMount() {
    this.firebaseRef.on('child_added', (dataSnap) => {
      this.setState(prevState => ({ items: [...prevState.items, dataSnap.val()] }));
    });
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  aggregateInHours() {
    const res = {};
    const getHour = date => moment.unix(date).format('H');
    [...Array(24).keys()].forEach((hour) => {
      const reducer = (accu, range) => {
        accu[hour] = accu[hour] || 0;
        if (getHour(range.startAt) <= hour && hour <= getHour(range.endAt) <= hour) {
          accu[hour]++;
        }
        return accu;
      };
      res[hour] = this.state.items.reduce(reducer, {});
    });

    return res;
  }

  render() {
    return (
      <div>
        <div className="badge-container">
          <StatsBadge />
          <StatsBadge />
          <StatsBadge />
          <StatsBadge />
        </div>
      </div>
    );
  }
}

export default Dashboard;
