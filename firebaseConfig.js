import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCvTeii5SXy8vkE0m-d2J3AOwH-aXQDksQ",
    authDomain: "universalyogaapps-fb6fa.firebaseapp.com",
    databaseURL: "https://universalyogaapps-fb6fa-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "universalyogaapps-fb6fa",
    storageBucket: "universalyogaapps-fb6fa.appspot.com",
    messagingSenderId: "443989556768",
    appId: "1:443989556768:web:63431722b788af71170645"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };