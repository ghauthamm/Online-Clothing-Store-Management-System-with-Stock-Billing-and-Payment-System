// Firebase Configuration and Initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAYSww7rIbk3BOjOLmCotTFNNGqxL_XCK0",
  authDomain: "clothing-store-e-commerce-app.firebaseapp.com",
  databaseURL: "https://clothing-store-e-commerce-app-default-rtdb.firebaseio.com",
  projectId: "clothing-store-e-commerce-app",
  storageBucket: "clothing-store-e-commerce-app.firebasestorage.app",
  messagingSenderId: "955076419062",
  appId: "1:955076419062:web:ff77da23004d11e5567bd7",
  measurementId: "G-94Q2LMJBVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
