// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXtwuQapmZcMQqDe4dJMtIbkKpurh6YuI",
  authDomain: "tech-fix-aee39.firebaseapp.com",
  projectId: "tech-fix-aee39",
  storageBucket: "tech-fix-aee39.firebasestorage.app",
  messagingSenderId: "302411603163",
  appId: "1:302411603163:web:adfabae8919c4cdd1780fe",
  measurementId: "G-0CY8TJQ4TX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);