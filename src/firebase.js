// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3bCn1rLiVzL6pp0mrg6McLGZpXHz9gQA",
  authDomain: "faculty-management-1ba76.firebaseapp.com",
  projectId: "faculty-management-1ba76",
  storageBucket: "faculty-management-1ba76.appspot.com",
  messagingSenderId: "1051678948249",
  appId: "1:1051678948249:web:ecb54fdb967d4b1fa77108"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app