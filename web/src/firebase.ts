// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCZxHuwWF55T1hhXl_0CIu1B19IqOLy0u4',
  authDomain: 'go-sandbox-datty-in.firebaseapp.com',
  projectId: 'go-sandbox-datty-in',
  storageBucket: 'go-sandbox-datty-in.firebasestorage.app',
  messagingSenderId: '164182424870',
  appId: '1:164182424870:web:07d3c3e75bd85ab861d5e7',
  measurementId: 'G-4DN8B9KM98',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//const analytics = getAnalytics(app);
export const auth = getAuth(app);
