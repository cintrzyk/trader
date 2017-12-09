import React, { Component } from 'react';
import firebase from 'firebase';

class Dashboard extends Component {
  state = { items: [] };
  firebaseRef = firebase.database().ref('events');

  componentWillMount() {
    this.firebaseRef.on('child_added', (dataSnap) => {
      this.setState(prevState => ({ items: [...prevState.items, dataSnap.val()] }));
    });
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  render() {
    return (
      <div>
        {
          this.state.items.map(item => (
            <div key={item.id}>{item.id}: {item.timestamp}</div>
          ))
        }
      </div>
    );
  }
}

export default Dashboard;
