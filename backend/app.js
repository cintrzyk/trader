import express from 'express';
import morgan from 'morgan';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import DashboardApp from '../client/Dashboard';
import Layout from '../client/Layout';
import botRoutes from './routes/bot';
import slack from './slack';

const { SSR } = process.env;

const app = express();

app.use(morgan('combined'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  const reactHtml = SSR ? renderToString(<DashboardApp />) : '';
  const page = renderToStaticMarkup(<Layout title="Trader">{reactHtml}</Layout>);

  res.send(`<!DOCTYPE html>${page}`);
});

app.use('/bot', botRoutes);

slack.start();

export default app;
