import express from 'express';
import morgan from 'morgan';
import React from 'react';
import * as firebase from 'firebase-admin';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import DashboardApp from '../client/Dashboard';
import Layout from '../client/Layout';
import botRoutes from './routes/bot';
import slack from './slack';


var admin = require("firebase-admin");

const serviceAccount = require("../firebaseAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://trader-f43d0.firebaseio.com"
});

const db = firebase.database();

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
