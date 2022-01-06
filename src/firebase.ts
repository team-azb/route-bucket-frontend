import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBuwuzk6vGRZs7BNQdSrIU-4lcVMRx_39k",
  authDomain: "route-bucket-dev.firebaseapp.com",
  projectId: "route-bucket-dev",
  storageBucket: "route-bucket-dev.appspot.com",
  messagingSenderId: "816609137730",
  appId: "1:816609137730:web:e40cb4cb567ce8c26809db",
  measurementId: "G-DZXT9VND9L",
};

const firebaseApp = initializeApp(FIREBASE_CONFIG);
export const storage = getStorage(firebaseApp);
