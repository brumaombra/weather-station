import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getMeasurements, updateMeasurement, deleteMeasurements, addMeasurement, getAggregatedDailyMeasurements, getLastMeasurement, getUser } from '../db/sql.js';
import { validateNewMeasurementData } from '../utils/utils.js';
import { createTempHumCorrelationData } from '../ml/temperatureHumidity.js';
dotenv.config(); // Load the .env file

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

// Serve the public folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../public')));

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Get the authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (token == null) return res.status(401).json({ message: "Unauthorized" }); // If there is no token, return 401
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Unauthorized" }); // Error if the token is not valid
        req.user = user; // Set the user in the request
        next(); // Call the next middleware
    });
};

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body; // Get the username and password
    try { // Check if the username and password are valid
        const user = await getUser(username); // Get the user from the database
        if (user && await bcrypt.compare(password, user.password)) {
            const secret = process.env.TOKEN_SECRET; // Get the secret from the environment variable
            const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' }); // Create the token
            res.json({ status: 'OK', token: token }); // Success, send the token
        } else {
            const errorMessage = 'Wrong username or password'; // Error message
            console.error(errorMessage); // Log the error
            res.status(400).json({ status: 'KO', message: errorMessage }); // Send the error message
        }
    } catch (error) {
        const errorMessage = 'Error while logging in';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ status: 'KO', message: errorMessage }); // Send the error message
    }
});

// Validate the token
app.get('/api/validateToken', verifyToken, (req, res) => {
    res.json({ status: 'OK', message: 'Authorized' }); // Return the message
});

// Get the measurements
app.get('/api/measurements', async (req, res) => {
    try {
        const params = req.query; // Query parameters
        const measurements = await getMeasurements(params); // Get the measurements from the database
        res.json({ status: 'OK', data: measurements }); // Send the response
    } catch (error) {
        const errorMessage = 'Error while reading the measurements';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ status: 'KO', message: errorMessage }); // Send the error message with status
    }
});

// Get the aggregated measurements
app.get('/api/aggregatedMeasurements', async (req, res) => {
    try {
        const params = req.query; // Query parameters
        const measurements = await getAggregatedDailyMeasurements(params); // Get the measurements from the database
        res.json({ status: 'OK', data: measurements }); // Send the response
    } catch (error) {
        const errorMessage = 'Error while reading the measurements';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ status: 'KO', message: errorMessage }); // Send the error message with status
    }
});

// Get the last measurement
app.get('/api/lastMeasurement', async (req, res) => {
    try {
        const measurement = await getLastMeasurement(); // Get the last measurement from the database
        res.json({ status: 'OK', data: measurement }); // Send the response
    } catch (error) {
        const errorMessage = 'Error while reading the measurement';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ status: 'KO', message: errorMessage }); // Send the error message with status
    }
});

// Add a new measurement
app.post('/api/measurements', async (req, res) => {
    try {
        const newMeasurement = req.body; // Get the measurement from the request body
        const validation = validateNewMeasurementData(newMeasurement); // Validate the data
        if (!validation.isValid) return res.status(400).json({ message: 'Invalid data' }); // If the data is invalid, return 400
        const result = await addMeasurement(validation.data); // Add the measurement to the database
        res.json({ status: 'OK', data: result }); // Send the response
    } catch (error) {
        const errorMessage = 'Error while adding the measurement';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ status: 'KO', message: errorMessage }); // Send the error message with status
    }
});

// Update a measurement
app.put('/api/measurements/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params; // Get the measurement ID from the request parameters
        if (!id) return res.status(400).json({ message: 'Invalid data' }); // If the ID is invalid, return 400
        const newMeasurement = req.body; // Get the measurement from the request body
        const validation = validateNewMeasurementData(newMeasurement); // Validate the data
        if (!validation.isValid) return res.status(400).json({ message: 'Invalid data' }); // If the data is invalid, return 400
        const result = await updateMeasurement(id, validation.data); // Add the measurement to the database
        res.json({ status: 'OK', data: result }); // Send the response
    } catch (error) {
        const errorMessage = 'Error while updating the measurement';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ status: 'KO', message: errorMessage }); // Send the error message with status
    }
});

// Delete one or multiple measurements
app.delete('/api/measurements', verifyToken, async (req, res) => {
    try {
        const { idList } = req.body; // Get the ID list from the request body
        if (!idList || !Array.isArray(idList) || idList.length === 0) return res.status(400).json({ message: 'Invalid data, expected an array of ids' }); // If not an array, return error
        const result = await deleteMeasurements(idList); // Delete the measurements from the database
        res.json({ status: 'OK', data: result }); // Send the response
    } catch (error) {
        const errorMessage = 'Error while deleting the measurement';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ status: 'KO', message: errorMessage }); // Send the error message with status
    }
});

// Get the humidity/temperature correlation
app.get('/api/correlation/temperatureHumidity', async (req, res) => {
    try {
        const data = await createTempHumCorrelationData(); // Create the data
        res.json({ status: 'OK', data: data }); // Send the response
    } catch (error) {
        const errorMessage = 'Error while getting the temperature/humidity correlation data';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ status: 'KO', message: errorMessage }); // Send the error message with status
    }
});

// Middleware for handling exceptions and errors globally
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).json({ status: 'KO', message: 'Internal Server Error' });
});

// Every other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

// Initialize the web server
export const initWebServer = () => {
    app.listen(port, '0.0.0.0', () => { // Start the server
        console.log(`Web server listening on port ${port}`);
    });
};