import React from 'react';
import PropTypes from 'prop-types';
import FromNowDate from './FromNowDate';
import '../styles/components/waiting-prs.scss';

const WaitingPr = ({ pr, user, tradeAvailableAt }) => (
  <div className="waiting-pr">
    <div className="waiting-pr__avatar">
      <img src={user.avatar_url} alt={user.login} className="waiting-pr__img" />
    </div>
    <div className="waiting-pr__content">
      <div>
        <a href={pr.html_url} target="_blank" className="link">
          {pr.html_url.substring(19)}
        </a>
        <span className="waiting-pr__line-changed green">+{pr.additions}</span>
        <span className="waiting-pr__line-changed red">-{pr.deletions}</span>
      </div>
      <div className="waiting-pr__name">
        <i className="fa fa-github" />{' '}
        <a href={user.html_url} target="_blank" className="link">
          {user.login}
        </a>
      </div>
      <div className="waiting-pr__time">
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
    <div className="waiting-prs">
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
