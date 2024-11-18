import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); // Load the .env file

const tokenSecretKey = process.env.TOKEN_SECRET || 'superSecretKey'; // Secret key for JWT

// Middleware to verify the token
export const verifyToken = (req, res, next) => {
    const token = req.cookies?.authToken; // Get the token from the httpOnly cookie
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try { // Try to verify the token
        req.data = jwt.verify(token, tokenSecretKey); // Verify the token
        next(); // Call the next middleware
    } catch (error) {
        res.status(403).json({ message: 'Unauthorized' }); // Error if the token is not valid
    }
};

// Create and set the token in a httpOnly cookie
export const setAuthTokenCookie = (res, userId) => {
    const token = jwt.sign({ userId }, tokenSecretKey, { expiresIn: '24h' }); // Create a JWT token

    // Set the token in a httpOnly cookie
    res.cookie('authToken', token, {
        httpOnly: true, // Prevents JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax', // Enable cross-site cookies
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/' // Path for the cookie
    });

    return token;
};