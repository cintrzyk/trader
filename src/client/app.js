import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { isSsrEnabled } from 'config/config';
import Dashboard from './Dashboard';
import './db/firebase';
import './styles/app.scss';

const hydrate = (Component, container) => {
  ReactDOM.hydrate(<Component />, container);
};

const render = (Component, container) => {
  ReactDOM.render(<Component />, container);
};

const hotRender = (Component, container) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>, container
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('react-app');

  if (isSsrEnabled) {
    hydrate(Dashboard, container);
  } else {
    render(Dashboard, container);
  }

  if (module.hot) {
    module.hot.accept('./Dashboard', () => {
      // eslint-disable-next-line global-require
      const NewComponent = require('./Dashboard.js').default;
      hotRender(NewComponent, container);
    });
  }
});
