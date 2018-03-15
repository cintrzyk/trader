import express from 'express';
import morgan from 'morgan';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { isProduction, isSsrEnabled } from 'config/config';
import DashboardApp from 'client/Dashboard';
import Layout from 'client/Layout';
import './db/firebase';
import botRoutes from './routes/bot';
import githubRoutes from './routes/github';
import slack from './slack';

const app = express();

app.use(morgan('combined'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  const reactHtml = isSsrEnabled ? renderToString(<DashboardApp />) : '';
  const page = renderToStaticMarkup(
    <Layout
      title="Trader"
      assetsDomain={isProduction ? '' : 'http://localhost:3001'}
    >
      {reactHtml}
    </Layout>
  );

  res.send(`<!DOCTYPE html>${page}`);
});

app.use('/bot', botRoutes);
app.use('/github', githubRoutes);

slack.start();

export default app;
