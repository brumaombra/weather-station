import { getMeasurements, updateMeasurement, deleteMeasurement, addMeasurement } from '../db/firebase.js';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const port = 3000;
app.use(express.json());

// Serve the public folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../public')));

// Get all the measurements
app.get('/api/measurements', (req, res) => {
    getMeasurements().then(misure => res.json(misure));
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

// Delete a measurement
app.delete('/api/measurements/:id', (req, res) => {
    const { id } = req.params;
    if (!id) { // Check if the data is valid
        res.status(400).send({ message: 'Invalid data' });
        return;
    }

    // Delete the measurement from Firestore
    deleteMeasurement(id).then(() => {
        res.send({ id })
    }).catch(error => {
        res.status(400).send({ message: error.message })
    });
});

// Check if the data is valid
const checkData = data => {
    const temperatureValid = data.temperature && Number.isFinite(data.temperature); // Check if the temperature is a number
    const humidityValid = data.humidity && Number.isFinite(data.humidity); // Check if the humidity is a number
    const timestampValid = data.timestamp && !isNaN(Date.parse(data.timestamp)); // Check if the timestamp is a valid date
    return temperatureValid && humidityValid && timestampValid;
};

// Initialize the web server
export const initWebServer = () => {
    app.listen(port, () => { // Start the server
        console.log(`Web server listening on port ${port}`);
    });
};