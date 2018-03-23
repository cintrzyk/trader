import React from 'react';
import PropTypes from 'prop-types';
import FromNowDate from './FromNowDate';
import '../styles/components/waiting-prs.scss';

const WaitingPr = ({ pr, user, tradeAvailableAt }) => (
  <div className="waiting-user">
    <div className="waiting-user__avatar">
      <img src={user.avatar_url} alt={user.login} className="waiting-user__img" />
    </div>
    <div className="waiting-user__content">
      <div className="waiting-user__pr">
        <a href={pr.html_url} className="link">
          {pr.html_url.substring(19)}
        </a>
      </div>
      <div className="waiting-user__name">
        {user.login}
      </div>
      <div className="waiting-user__time">
        <FromNowDate date={tradeAvailableAt} />
      </div>
    </div>
  </div>
);

const WaitingPrs = ({ data }) => {
  const mappedUsers = Object.entries(data).map(d => (
    <WaitingPr
      key={d[0]}
      pr={d[1].data}
      user={d[1].meta.user}
      tradeAvailableAt={d[1].meta.tradeAvailableAt}
    />
  ));

  return (
    <div className="waiting-users">
      {mappedUsers}
    </div>
  );
};

WaitingPrs.defaultProps = {
  icon: 'question',
  label: 'todo',
  value: '--',
};

WaitingPrs.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.node,
  data: PropTypes.shape({}),
};

export default WaitingPrs;
