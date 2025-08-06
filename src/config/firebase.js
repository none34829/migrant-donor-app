import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRHQMHhOY7KLWSgXWTR7vFxVjBC9JZnn8",
  authDomain: "migrant-donor-app.firebaseapp.com",
  projectId: "migrant-donor-app",
  storageBucket: "migrant-donor-app.firebasestorage.app",
  messagingSenderId: "702204700231",
  appId: "1:702204700231:web:3b7d6d1d196604773d7362"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 