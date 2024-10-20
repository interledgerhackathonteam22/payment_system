// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
// initializeApp();

// const db = getFirestore();
// Initialize on Google Cloud

// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

// initializeApp({
//   credential: applicationDefault()
// });

// const db = getFirestore();

// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

// const serviceAccount = require('./path/to/serviceAccountKey.json');

// initializeApp({
//   credential: cert(serviceAccount)
// });

// const db = getFirestore();

// const docRef = db.collection('users').doc('alovelace');

// await docRef.set({
//   first: 'Ada',
//   last: 'Lovelace',
//   born: 1815
// });

// const aTuringRef = db.collection('users').doc('aturing');

// await aTuringRef.set({
//   'first': 'Alan',
//   'middle': 'Mathison',
//   'last': 'Turing',
//   'born': 1912
// });

// const snapshot = await db.collection('users').get();
// snapshot.forEach((doc) => {
//   console.log(doc.id, '=>', doc.data());
// });

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /users/{uid} {
//       allow read, write: if request.auth != null && request.auth.uid == uid;
//     }
//   }
// }