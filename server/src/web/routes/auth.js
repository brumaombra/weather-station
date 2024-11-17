import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUser } from '../../db/sql.js';
import { verifyToken } from '../middleware/auth.js';
dotenv.config(); // Load the .env file

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body; // Get the username and password
    try { // Check if the username and password are valid
        const user = await getUser(username); // Get the user from the database
        if (user && await bcrypt.compare(password, user.password)) {
            const secret = process.env.TOKEN_SECRET; // Get the secret from the environment variable
            const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' }); // Create the token
            res.json({ token: token }); // Success, send the token
        } else {
            const errorMessage = 'Wrong username or password'; // Error message
            console.error(errorMessage); // Log the error
            res.status(400).json({ message: errorMessage }); // Send the error message
        }
    } catch (error) {
        const errorMessage = 'Error while logging in';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ message: errorMessage }); // Send the error message
    }
});

// Validate the token
router.get('/validateToken', verifyToken, (req, res) => {
    res.json({ message: 'Authorized' }); // Return the message
});

export default router;