import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.VITE_FIREBASE_API_KEY,
  authDomain: "venuevibe-a1675.firebaseapp.com",
  projectId: "venuevibe-a1675",
  storageBucket: "venuevibe-a1675.appspot.com",
  messagingSenderId: "605698985809",
  appId: "1:605698985809:web:ca6e225a8202acf781cd70",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

//for images and video uploads?
import { getStorage } from "firebase/storage";
const storage = getStorage(app);
export { db, auth, storage };