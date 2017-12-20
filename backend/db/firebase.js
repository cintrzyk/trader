import * as firebase from 'firebase-admin';

const serviceAccount = require('../../firebaseAccountKey.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

export default firebase;
