import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDEtvJ9J2TRJEu3V2pCERXXyAG7912vuEg",
  authDomain: "honest-skincare.firebaseapp.com",
  projectId: "honest-skincare",
  storageBucket: "honest-skincare.appspot.com",
  messagingSenderId: "597086215518",
  appId: "1:597086215518:web:824118dc857377f31843cf"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Auth met veilige fallback en platformcheck
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    console.log('Fallback to getAuth():', e.message);
    auth = getAuth(app);
  }
}

// Firestore & Storage
const db = getFirestore(app);
const storage = getStorage(app);
const storageRef = ref(storage, 'images/');

// Exports
export { auth, db, storage, storageRef };
