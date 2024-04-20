import dotenv from 'dotenv';
import { getMeasurements, updateMeasurement, deleteMeasurements, addMeasurement, getAggregatedDailyMeasurements, getUser } from '../db/sql.js';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
            res.json({ token: token }); // Send the token
        } else {
            res.status(400).json({ message: "Wrong username or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error while logging in" });
    }
});

// Validate the token
app.get('/api/validateToken', verifyToken, (req, res) => {
    res.json({ message: 'Authorized' }); // Return the message
});

// Get all the measurements
app.get('/api/measurements', (req, res) => {
    const params = req.query; // Query parameters
    getMeasurements(params).then(measures => res.json(measures));
});

// Get the aggregated measurements
app.get('/api/aggregatedMeasurements', (req, res) => {
    const params = req.query; // Query parameters
    getAggregatedDailyMeasurements(params).then(measures => res.json(measures));
});

// Add a new measurement
app.post('/api/measurements', (req, res) => {
    const measurement = req.body;
    if (!checkData(measurement)) { // Check if the data is valid
        res.status(400).json({ message: 'Invalid data' });
        return;
    }

    // Add the measurement to Firestore
    addMeasurement(measurement).then(() => {
        res.json(measurement);
    }).catch(error => {
        res.status(400).json({ message: error.message })
    });
});

// Update a measurement
app.put('/api/measurements/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    if (!checkData(newData) || !id) { // Check if the data is valid
        res.status(400).json({ message: 'Invalid data' });
        return;
    }

    // Update the measurement in Firestore
    updateMeasurement(id, newData).then(() => {
        res.json({ id, ...newData })
    }).catch(error => {
        res.status(400).json({ message: error.message })
    });
});

// Delete one or multiple measurements
app.delete('/api/measurements', verifyToken, (req, res) => {
    const { idList } = req.body;
    if (!idList || !Array.isArray(idList) || idList.length === 0) {
        res.status(400).json({ message: 'Invalid data, expected an array of ids' });
        return;
    }

    // Delete the measurement from Firestore
    deleteMeasurements(idList).then(() => {
        res.json(idList) // Send the ID list
    }).catch(error => {
        res.status(400).json({ message: error.message })
    });
});

// Check if the data is valid
const checkData = data => {
    const temperatureValid = data.temperature && Number.isFinite(data.temperature); // Check if the temperature is a number
    const humidityValid = data.humidity && Number.isFinite(data.humidity); // Check if the humidity is a number
    return temperatureValid && humidityValid;
};

// Initialize the web server
export const initWebServer = () => {
    app.listen(port, '0.0.0.0', () => { // Start the server
        console.log(`Web server listening on port ${port}`);
    });
};