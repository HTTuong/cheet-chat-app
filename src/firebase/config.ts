import * as firebase from 'firebase/app';

import * as auth from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyBgU3vtfjcLX2hJP38c6a5REecEFsJCihA',
    authDomain: 'chat-app-8816e.firebaseapp.com',
    projectId: 'chat-app-8816e',
    storageBucket: 'chat-app-8816e.appspot.com',
    messagingSenderId: '695307807247',
    appId: '1:695307807247:web:6d6c8dd31109a3f87c917a',
    measurementId: 'G-QG8NHK0VCC',
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);

// connectAuthEmulator(auth.getAuth(), 'http://localhost:9099');
// if (window.location.hostname === 'localhost') {
//     connectFirestoreEmulator(db, 'localhost', 8080);
// }

export { auth, db };
export default firebase;
