import React from 'react';
import '../styles/components/stats-badge.scss';

const StatsBadge = () => (
  <div className="stats-badge">
    <div className="stats-badge__icon">
      i
    </div>
    <div className="stats-badge__content">
      <div className="stats-badge__counter">
        37
      </div>
      <div className="stats-badge__label">
        UNDER REVIEW
      </div>
    </div>
  </div>
);

export default StatsBadge;
