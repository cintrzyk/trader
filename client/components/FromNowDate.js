import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class FromNowDate extends Component {
  componentDidMount() {
    this.intervalId = setInterval(this.update, 1000);
  }

  update = () => this.forceUpdate()

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <span title={this.props.date.toString()}>
        {moment(this.props.date).fromNow()}
      </span>
    );
  }
}

FromNowDate.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
};

export default FromNowDate;
