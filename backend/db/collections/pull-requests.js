import firebase from '../firebase';

const collection = firebase.firestore().collection('gh_prs');

export const setDoc = (id, payload) => {
  const docId = id.toString();

  return collection.doc(docId).set(payload);
};

export const updateDoc = (id, payload) => {
  const docId = id.toString();

  return collection.doc(docId).update(payload);
};

export const deleteDoc = (id) => {
  const docId = id.toString();

  return collection.doc(docId).delete();
};

export default {};
