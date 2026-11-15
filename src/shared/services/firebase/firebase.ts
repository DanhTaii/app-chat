// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDQxXWmspJOQLwZagq3_LstHDksZDnhCbE",
    authDomain: "chat-app-video-call-2200f.firebaseapp.com",
    projectId: "chat-app-video-call-2200f",
    storageBucket: "chat-app-video-call-2200f.firebasestorage.app",
    messagingSenderId: "859246877783",
    appId: "1:859246877783:web:7c41b66612e87eb2795712",
    measurementId: "G-432F16VWKW",
    databaseURL:"https://chat-app-video-call-2200f-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Realtime Database
export const database = getDatabase(app);

export default app;