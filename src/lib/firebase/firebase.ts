import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAuosxuKfvVrWdqeMtFAetxejVBBeeXHFs",
  authDomain: "agrimarket-7quyf.firebaseapp.com",
  projectId: "agrimarket-7quyf",
  storageBucket: "agrimarket-7quyf.appspot.com",
  messagingSenderId: "1079117222665",
  appId: "1:1079117222665:web:7466113853f2212c0e39d8",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


export { app, db, storage, auth };
