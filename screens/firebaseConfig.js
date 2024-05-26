import { initializeApp } from '@firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from '@firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD7CIrHeRUl9t_hS9C-YNzdVu-b0d0-_hA",
  authDomain: "macromentor-bcd7b.firebaseapp.com",
  projectId: "macromentor-bcd7b",
  storageBucket: "macromentor-bcd7b.appspot.com",
  messagingSenderId: "447252129233",
  appId: "1:447252129233:web:ecb7d04f56327866e1ecf0",
  measurementId: "G-0FD5P6TPFG"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
//firebase bağlantıları ve değer döndürme
export { app, db, auth , storage };