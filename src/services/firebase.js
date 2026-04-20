import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDC1PHjrrB6ZLyhVYe1JhvMsMSkxhKCKJM",
  authDomain: "travel-lens-5f7f7.firebaseapp.com",
  projectId: "travel-lens-5f7f7",
  storageBucket: "travel-lens-5f7f7.firebasestorage.app",
  messagingSenderId: "202512009360",
  appId: "1:202512009360:web:32a68ef82b22a736323015",
  measurementId: "G-EK1R5XX1T1"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
