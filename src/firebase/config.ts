import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBA1Aun9WnO--6fLDyU8s2jimhbVIVYjNA",
  authDomain: "progrify-ef9f9.firebaseapp.com",
  projectId: "progrify-ef9f9",
  storageBucket: "progrify-ef9f9.appspot.com",
  messagingSenderId: "641846162158",
  appId: "1:641846162158:web:8c626d8ad48d7550baf9ff",
  measurementId: "G-52TFN1CRXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;