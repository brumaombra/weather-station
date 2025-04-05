import { getCurrentUser } from '~/server/utils/firebase/firebaseAdmin.js';

export default defineEventHandler(async () => {
    const user = getCurrentUser();
    if (!user) {
        return null;
    }

    return {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
    };
});