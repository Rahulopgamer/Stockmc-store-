import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "asymmetric-bloom-9nzsc",
  appId: "1:628383788429:web:b4c351a10c0b082105a1c4",
  apiKey: "AIzaSyDnG0PA8svVQrOLQifVItvzKTAieZ-ZZEo",
  authDomain: "asymmetric-bloom-9nzsc.firebaseapp.com",
  storageBucket: "asymmetric-bloom-9nzsc.firebasestorage.app",
  messagingSenderId: "628383788429",
  measurementId: "G-placeholder" // Placeholder
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-cdb69857-8748-4bf0-a388-9ae4560c5ae0");
