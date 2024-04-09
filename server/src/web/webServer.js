import { getMeasurements, updateMeasurement, deleteMeasurement, addMeasurement } from '../db/firebase.js';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Initialize the web server
export const initWebServer = () => {
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
        addMeasurement(measurement).then(() => {
            res.send(measurement);
        }).catch(error => {
            res.status(400).send(error.message)
        });
    });

    // Update a measurement
    app.put('/api/measurements/:id', (req, res) => {
        const { id } = req.params;
        const newData = req.body;
        updateMeasurement(id, newData).then(() => {
            res.send({ id, ...newData })
        }).catch(error => {
            res.status(400).send(error.message)
        });
    });

    // Delete a measurement
    app.delete('/api/measurements/:id', (req, res) => {
        const { id } = req.params;
        deleteMeasurement(id).then(() => {
            res.send({ id })
        }).catch(error => {
            res.status(400).send(error.message)
        });
    });

    // Start the server
    app.listen(port, () => {
        console.log(`Web server listening on port ${port}`);
    });
};