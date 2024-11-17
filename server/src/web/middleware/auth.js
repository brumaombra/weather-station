import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); // Load the .env file

// Middleware to verify the token
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Get the authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (token == null) return res.status(401).json({ message: "Unauthorized" }); // If there is no token, return 401
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Unauthorized" }); // Error if the token is not valid
        req.user = user; // Set the user in the request
        next(); // Call the next middleware
    });
};