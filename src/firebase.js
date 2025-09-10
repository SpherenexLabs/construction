// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCty-CgPrhqum_gpP0HIbNsMme2B-qd-Kw",
  authDomain: "constructions-d1258.firebaseapp.com",
  projectId: "constructions-d1258",
  storageBucket: "constructions-d1258.firebasestorage.app",
  messagingSenderId: "466913926188",
  appId: "1:466913926188:web:c41c43f5848d4a99460589",
  measurementId: "G-DRGCXJF55W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;