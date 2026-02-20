// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyAnqEyxc-4x55dIxsb52p_FXrARflN9PlI",
    authDomain: "ipo-accounts.firebaseapp.com",
    projectId: "ipo-accounts",
    storageBucket: "ipo-accounts.firebasestorage.app",
    messagingSenderId: "554952351841",
    appId: "1:554952351841:web:448e16bda019554c4a4a20",
    measurementId: "G-R6PLP6PHNM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, analytics };
