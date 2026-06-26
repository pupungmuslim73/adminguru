import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

// Parse the firebase configuration from env if necessary, or embed it
// Using the config from firebase-applet-config.json
const firebaseConfig = {
  projectId: "gen-lang-client-0011102628",
  appId: "1:856140388074:web:75b062d654c4b53d28e993",
  apiKey: "AIzaSyDhyeKK8u-pKG8AudfvaJn0yU4EhhomDsQ",
  authDomain: "gen-lang-client-0011102628.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-f1c79ee9-3f4c-4f63-829e-4d21109d653a",
  storageBucket: "gen-lang-client-0011102628.firebasestorage.app",
  messagingSenderId: "856140388074"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
