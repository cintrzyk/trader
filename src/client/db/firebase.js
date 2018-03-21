import firebase from 'firebase';
import 'firebase/firestore';
import { firebaseClient } from 'config/config';

firebase.initializeApp(firebaseClient);
