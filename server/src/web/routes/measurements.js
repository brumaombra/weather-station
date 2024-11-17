import express from 'express';
import { getMeasurements, updateMeasurement, deleteMeasurements, addMeasurement, getAggregatedDailyMeasurements, getLastMeasurement } from '../../db/sql.js';
import { validateNewMeasurementData } from '../../utils/utils.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get the measurements
router.get('/', async (req, res) => {
    try {
        const params = req.query; // Query parameters
        const measurements = await getMeasurements(params); // Get the measurements from the database
        res.json(measurements); // Send the response
    } catch (error) {
        const errorMessage = 'Error while reading the measurements';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ message: errorMessage }); // Send the error message with status
    }
});

// Get the aggregated measurements
router.get('/aggregated', async (req, res) => {
    try {
        const params = req.query; // Query parameters
        const measurements = await getAggregatedDailyMeasurements(params); // Get the measurements from the database
        res.json(measurements); // Send the response
    } catch (error) {
        const errorMessage = 'Error while reading the measurements';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ message: errorMessage }); // Send the error message with status
    }
});

// Get the last measurement
router.get('/last', async (req, res) => {
    try {
        const measurement = await getLastMeasurement(); // Get the last measurement from the database
        res.json(measurement); // Send the response
    } catch (error) {
        const errorMessage = 'Error while reading the measurement';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ message: errorMessage }); // Send the error message with status
    }
});

// Add a new measurement
router.post('/', async (req, res) => {
    try {
        const newMeasurement = req.body; // Get the measurement from the request body
        const validation = validateNewMeasurementData(newMeasurement); // Validate the data
        if (!validation.isValid) return res.status(400).json({ message: 'Invalid data' }); // If the data is invalid, return 400
        const result = await addMeasurement(validation.data); // Add the measurement to the database
        res.json(result); // Send the response
    } catch (error) {
        const errorMessage = 'Error while adding the measurement';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ message: errorMessage }); // Send the error message with status
    }
});

// Update a measurement
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params; // Get the measurement ID from the request parameters
        if (!id) return res.status(400).json({ message: 'Invalid data' }); // If the ID is invalid, return 400
        const newMeasurement = req.body; // Get the measurement from the request body
        const validation = validateNewMeasurementData(newMeasurement); // Validate the data
        if (!validation.isValid) return res.status(400).json({ message: 'Invalid data' }); // If the data is invalid, return 400
        const result = await updateMeasurement(id, validation.data); // Add the measurement to the database
        res.json(result); // Send the response
    } catch (error) {
        const errorMessage = 'Error while updating the measurement';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ message: errorMessage }); // Send the error message with status
    }
});

// Delete one or multiple measurements
router.delete('/', verifyToken, async (req, res) => {
    try {
        const { idList } = req.body; // Get the ID list from the request body
        if (!idList || !Array.isArray(idList) || idList.length === 0) return res.status(400).json({ message: 'Invalid data, expected an array of ids' }); // If not an array, return error
        const result = await deleteMeasurements(idList); // Delete the measurements from the database
        res.json(result); // Send the response
    } catch (error) {
        const errorMessage = 'Error while deleting the measurement';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ message: errorMessage }); // Send the error message with status
    }
});

export default router;