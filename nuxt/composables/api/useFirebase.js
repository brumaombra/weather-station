import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useGlobalStore } from '~/composables/stores/useGlobalStore.js';

let app = null;

// Initialize Firebase
export const initFirebase = async () => {
    try {
        const runtimeConfig = useRuntimeConfig();
        const firebaseConfig = {
            apiKey: runtimeConfig.public.firebaseApiKey,
            authDomain: runtimeConfig.public.firebaseAuthDomain,
            projectId: runtimeConfig.public.firebaseProjectId
        };

        // Init Firebase
        app = initializeApp(firebaseConfig);

        // Add Firebase auth state change listener
        const auth = getAuth();
        const globalStore = useGlobalStore();
        onAuthStateChanged(auth, user => {
            if (user) {
                globalStore.value.user = user; // User is signed in
            } else {
                globalStore.value.user = null; // User is signed out
            }
        });

        return app;
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        throw error;
    }
};

// Login the user with email and password
export const emailPasswordLogin = async (email, password) => {
    try {
        // Check if email and password are provided
        if (!email || !password) {
            throw new Error('Email and password are required.');
        }

        // Check if the user is already logged in
        const globalStore = useGlobalStore();
        const auth = getAuth();
        if (auth.currentUser) {
            globalStore.value.user = auth.currentUser;
            return auth.currentUser;
        }

        // Sign in the user with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        globalStore.value.user = userCredential.user;

        // Get Firebase token
        const token = await userCredential.user.getIdToken();

        // Store token in a cookie
        await useFetch('/api/auth/set-cookie', {
            method: 'POST',
            body: { token }
        });

        // Return the user object
        return userCredential.user;
    } catch (error) {
        // Handle errors based on error codes
        if (error.code === 'auth/user-not-found') {
            throw new Error('User not found. Please check your email.');
        } else if (error.code === 'auth/wrong-password') {
            throw new Error('Incorrect password. Please try again.');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('Invalid email format. Please check your email.');
        } else if (error.code === 'auth/network-request-failed') {
            throw new Error('Network error. Please check your connection.');
        } else if (error.code === 'auth/too-many-requests') {
            throw new Error('Too many requests. Please try again later.');
        } else if (error.code === 'auth/operation-not-allowed') {
            throw new Error('Email/password login is not enabled. Please contact support.');
        } else {
            throw new Error('An unknown error occurred. Please try again.');
        }
    }
};

// Login the user with Google
export const googleLogin = async () => {
    try {
        const globalStore = useGlobalStore();
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        // Sign in with Google
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Get Firebase token
        const token = await user.getIdToken();

        // Store token in a cookie
        await useFetch('/api/auth/set-cookie', {
            method: 'POST',
            body: { token }
        });

        // Update global store
        globalStore.value.user = user;
        return user;
    } catch (error) {
        console.error('Error during Google login:', error);
        throw new Error('Failed to log in with Google. Please try again.');
    }
};

// Logout the user
export const logout = async () => {
    const globalStore = useGlobalStore();
    const auth = getAuth();
    await signOut(auth);
    globalStore.value.user = null;

    // Clear token cookie
    await useFetch('/api/auth/logout', { method: 'POST' });
};

// Return the current user
export const getCurrentUser = async () => {
    const globalStore = useGlobalStore();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
        globalStore.value.user = currentUser;
        return currentUser;
    } else {
        globalStore.value.user = null;
        return null;
    }
};