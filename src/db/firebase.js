import * as firebase from 'firebase-admin';
import { firebaseServiceAccount } from 'config/config';

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseServiceAccount),
});

export default firebase;
