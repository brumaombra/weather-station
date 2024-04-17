import { getMeasurements, updateMeasurement, deleteMeasurements, addMeasurement, getAggregatedDailyMeasurements } from '../db/sql.js';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

// Serve the public folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../public')));

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
        res.status(400).send({ message: 'Invalid data' });
        return;
    }

    // Add the measurement to Firestore
    addMeasurement(measurement).then(() => {
        res.send(measurement);
    }).catch(error => {
        res.status(400).send({ message: error.message })
    });
});

// Update a measurement
app.put('/api/measurements/:id', (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    if (!checkData(newData) || !id) { // Check if the data is valid
        res.status(400).send({ message: 'Invalid data' });
        return;
    }

    // Update the measurement in Firestore
    updateMeasurement(id, newData).then(() => {
        res.send({ id, ...newData })
    }).catch(error => {
        res.status(400).send({ message: error.message })
    });
});

// Delete one or multiple measurements
app.delete('/api/measurements', (req, res) => {
    const { idList } = req.body;
    if (!idList || !Array.isArray(idList) || idList.length === 0) {
        res.status(400).send({ message: 'Invalid data, expected an array of ids' });
        return;
    }

    // Delete the measurement from Firestore
    deleteMeasurements(idList).then(() => {
        res.send(idList) // Send the ID list
    }).catch(error => {
        res.status(400).send({ message: error.message })
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
    app.listen(port, () => { // Start the server
        console.log(`Web server listening on port ${port}`);
    });
};