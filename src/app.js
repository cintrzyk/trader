import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import 'newrelic';
import { appSecret } from 'config/config';
import firebase from './db/firebase';
import botRoutes from './routes/bot';
import githubRoutes from './routes/github';
import slackRtmClient from './slack/rtm-client';

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

app.get('/', (req, res) => {

});

app.use('/bot', botRoutes);
app.use('/github', githubRoutes);

slackRtmClient.start();

export default app;
