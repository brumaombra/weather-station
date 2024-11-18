import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcrypt';
import { getUser } from '../../db/sql.js';
import { verifyToken, setAuthTokenCookie } from '../middleware/auth.js';
dotenv.config(); // Load the .env file

const router = express.Router();

// Endpoint for token authentication
router.get('/validateToken', verifyToken, (req, res) => {
    res.json({ message: 'Token is valid' }); // Return the message
});

// Endpoint for user authentication
router.post('/login', async (req, res) => {
    const { username, password } = req.body; // Get the username and password from the request body
    if (!username || !password) { // Validate inputs
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    try {
        const user = await getUser(username); // Get the user from the database
        if (!user) { // Check if the user exists
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
            setAuthTokenCookie(res, user.id); // Set the token in a httpOnly cookie
            res.json({ message: 'Login successful' }); // Success message
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login: ', error);
        return res.status(500).json({ message: 'Error during login' });
    }
});

// Endpoint to logout the user (clears the token cookie)
router.post('/logout', (req, res) => {
    res.clearCookie('authToken'); // Clear the httpOnly cookie
    res.json({ message: 'Logout successful' }); // Return the message
});

export default router;