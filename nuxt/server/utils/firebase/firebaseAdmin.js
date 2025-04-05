import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let app = null;

// Initialize Firebase
export const initFirebase = async () => {
    try {
        // Import the Firebase JSON file
        const { default: firebaseServiceAccount } = await import('./firebaseServiceAccount.json', { assert: { type: 'json' } });
        if (!firebaseServiceAccount) {
            throw new Error('Firebase service account JSON file not found');
        }

        // Initialize Firebase
        app = initializeApp({ credential: cert(firebaseServiceAccount) });
        console.log('Firebase initialized successfully');
        return app;
    } catch (error) {
        console.error('Error while initializing Firebase', error);
        throw error;
    }
};

// Return the Firebase app instance
export const getAppInstance = () => {
    if (!app) {
        throw new Error('Firebase app is not initialized. Call initFirebase() first.');
    }

    return app;
};

// Return the Firebase auth instance
export const getFirebaseAuth = () => {
    if (!app) {
        throw new Error('Firebase app is not initialized. Call initFirebase() first.');
    }

    return getAuth(app);
};

// Get current user
export const getCurrentUser = () => {
    const auth = getAuth(app);
    return auth.currentUser;
};

// Check Firebase session
export const checkFirebaseSession = async event => {
    const token = getCookie(event, "auth_token"); // Get token from cookies
    if (!token) {
        throw new Error('No token provided');
    }

    try {
        const auth = getAuth(app);
        const decodedToken = await auth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        throw error;
    }
};