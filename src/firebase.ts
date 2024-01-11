import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCZj1g6P8fQqIrzCM7fJbXf1vHglDfk1js",
  authDomain: "twitter-a5fbe.firebaseapp.com",
  projectId: "twitter-a5fbe",
  storageBucket: "twitter-a5fbe.appspot.com",
  messagingSenderId: "795719215478",
  appId: "1:795719215478:web:5c6c8b40ad8a70e93e3257"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)