import * as firebase from 'firebase-admin';

const serviceAccount = require('../../firebaseAccountKey.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://trader-f43d0.firebaseio.com',
});

const db = firebase.database();

export default db;
