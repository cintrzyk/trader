import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/stats-badge.scss';

const StatsBadge = props => (
  <div className="stats-badge">
    <div className="stats-badge__marker">
      <div className="stats-badge__icon">
        <i className={`fa fa-${props.icon} fa-2x`} />
      </div>
    </div>
    <div className="stats-badge__content">
      <div className="stats-badge__counter">
        {props.value}
      </div>
      <div className="stats-badge__label">
        {props.label}
      </div>
    </div>
  </div>
);

StatsBadge.defaultProps = {
  icon: 'question',
  label: 'todo',
  value: '--',
};

StatsBadge.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.node,
};

export default StatsBadge;
