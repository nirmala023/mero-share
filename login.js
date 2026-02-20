// login.js
import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    // UI state: loading
    loginBtn.disabled = true;
    btnText.textContent = "Checking...";
    btnLoader.classList.remove('d-none');
    errorMessage.classList.add('d-none');

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // On success, auth.js will handle the redirection via onAuthStateChanged
    } catch (error) {
        console.error("Login Error:", error.code, error.message);

        let friendlyMessage = "Failed to sign in. Please check your credentials.";

        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            friendlyMessage = "Invalid email or password. Please try again.";
        } else if (error.code === 'auth/too-many-requests') {
            friendlyMessage = "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.";
        }

        errorMessage.textContent = friendlyMessage;
        errorMessage.classList.remove('d-none');

        // Reset UI state
        loginBtn.disabled = false;
        btnText.textContent = "Sign In";
        btnLoader.classList.add('d-none');
    }
});
