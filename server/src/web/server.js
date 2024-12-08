import { promisify } from 'util';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import routes from './routes/index.js';
import dotenv from 'dotenv';
dotenv.config(); // Load the .env file

const port = 3000;
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(cors({ // Enable CORS
    origin: process.env.NODE_ENV === 'production' ? 'https://station.bruma.cloud' : 'http://localhost:5173',
    credentials: true
}));

// Initialize routes
routes(app);

// Serve the public folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../public')));

// Middleware for handling exceptions and errors globally
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).json({ status: 'KO', message: 'Internal Server Error' });
});

// Every other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

// Start the web server
export const startWebServer = async () => {
    try {
        const listen = promisify(app.listen.bind(app));
        await listen(port);
        console.log(`Web server listening on port ${port}`);
    } catch (error) {
        console.error(`Error while starting the web server: ${error.message}`);
        throw error;
    }
};