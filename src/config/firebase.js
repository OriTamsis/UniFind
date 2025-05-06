import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDqNOVItP6SnYdu8PIa4puHLdCy2Vv8QvQ",
  authDomain: "unifind-9a0ce.firebaseapp.com",
  projectId: "unifind-9a0ce",
  storageBucket: "unifind-9a0ce.firebasestorage.app",
  messagingSenderId: "1093162733490",
  appId: "1:1093162733490:web:bbbfa98b7cf1ae8d689eab",
  measurementId: "G-X0Y6EFXB1M"
};


const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 