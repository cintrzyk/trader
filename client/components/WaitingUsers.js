import React from 'react';
import PropTypes from 'prop-types';
import FromNowDate from './FromNowDate';
import '../styles/components/waiting-users.scss';

const WaitingUser = props => (
  <div className="waiting-user">
    <div className="waiting-user__avatar">
      <img src={props.avatar_url} alt={props.login} className="waiting-user__img" />
    </div>
    <div className="waiting-user__content">
      <div className="waiting-user__name">
        {props.login}
      </div>
      <div className="waiting-user__time">
        <FromNowDate date={props.trade_available_at} />
      </div>
    </div>
  </div>
);

const WaitingUsers = ({ data }) => {
  const mappedUsers = data.map(userData => <WaitingUser key={userData.gh_pr_id} {...userData} />);

  return (
    <div className="waiting-users">
      {mappedUsers}
    </div>
  );
};

WaitingUsers.defaultProps = {
  icon: 'question',
  label: 'todo',
  value: '--',
};

WaitingUsers.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.node,
};

export default WaitingUsers;
