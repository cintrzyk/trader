import express from 'express';
import morgan from 'morgan';
import React from 'react';
import session from 'express-session';
import 'newrelic';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { appSecret, isProduction, isSsrEnabled } from 'config/config';
import grant from 'config/grant';
import DashboardApp from 'client/Dashboard';
import LoginPage from 'client/LoginPage';
import Layout from 'client/Layout';
import firebase from './db/firebase';
import botRoutes from './routes/bot';
import githubRoutes from './routes/github';
import oauthRoutes from './routes/oauth';
import slack from './slack';

const FirestoreStore = require('firestore-store')(session);

const app = express();

app.use(morgan('combined'));
app.use(express.static('public'));
app.use(session({
  name: 'trader_session',
  store: new FirestoreStore({ database: firebase.firestore() }),
  secret: appSecret,
  resave: true,
  saveUninitialized: true,
}));
app.use(grant);

app.get('/', (req, res) => {
  let page = '';

  if (req.session.userId) {
    const reactHtml = isSsrEnabled ? renderToString(<DashboardApp />) : '';
    page = renderToStaticMarkup(
      <Layout
        title="Trader"
        assetsDomain={isProduction ? '' : 'http://localhost:3001'}
      >
        {reactHtml}
      </Layout>
    );
  } else {
    page = renderToStaticMarkup(<LoginPage />);
  }

  return res.send(`<!DOCTYPE html>${page}`);
});

app.use('/bot', botRoutes);
app.use('/github', githubRoutes);
app.use('/oauth', oauthRoutes);

slack.start();

export default app;
