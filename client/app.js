import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Dashboard from './Dashboard';

const { SSR } = process.env;

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
    </AppContainer>, container);
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('react-app');

  if (SSR) {
    hydrate(Dashboard, container);
  } else {
    render(Dashboard, container);
  }

  if (module.hot) {
    module.hot.accept('./Dashboard', () => {
      const NewComponent = require('./Dashboard.js').default;
      hotRender(NewComponent, container);
    });
  }
});
