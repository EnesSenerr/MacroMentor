import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from '@firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD7CIrHeRUl9t_hS9C-YNzdVu-b0d0-_hA",
  authDomain: "macromentor-bcd7b.firebaseapp.com",
  projectId: "macromentor-bcd7b",
  storageBucket: "macromentor-bcd7b.appspot.com",
  messagingSenderId: "447252129233",
  appId: "1:447252129233:web:ecb7d04f56327866e1ecf0",
  measurementId: "G-0FD5P6TPFG"
};

// Firebase uygulamasını başlatın
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const firestore = getFirestore(app);
const storage = getStorage(app);

// auth nesnesini dışa aktarın
export { auth, firestore, storage }; 

