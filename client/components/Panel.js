import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/panel.scss';

const Panel = props => (
  <div className="panel">
    <div className="panel__title">
      {props.title}
    </div>
    <div className="panel__content">
      {props.children}
    </div>
  </div>
);

Panel.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default Panel;
