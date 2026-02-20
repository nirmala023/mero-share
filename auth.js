// auth.js
import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// Check authentication status
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Not logged in, redirect to login page
        // Check if we are not already on the login page to avoid infinite redirect
        if (!window.location.pathname.endsWith('login.html')) {
            window.location.href = 'login.html';
        }
    } else {
        // User is logged in, if we are on login.html, redirect back to index.html
        if (window.location.pathname.endsWith('login.html')) {
            window.location.href = 'index.html';
        }
    }
});

/**
 * Logout function
 */
export async function logout() {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Logout failed:", error);
    }
}
