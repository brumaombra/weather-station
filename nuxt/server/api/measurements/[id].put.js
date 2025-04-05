import { readBody } from 'h3';
import { updateMeasurement } from '../../db/measurements.js';
import { validateNewMeasurementData } from '../../utils/utils.js';
import { checkFirebaseSession } from '../../utils/firebase/firebaseAdmin.js';

export default defineEventHandler(async event => {
    try {
        // Middleware to check Firebase session
        await checkFirebaseSession(event);

        // Get the measurement ID from the request parameters
        const { id } = event.context.params;
        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid data, measurement ID is required'
            });
        }

        // Get the measurement data from the request body
        const newMeasurement = await readBody(event);

        // Validate the data
        const validData = validateNewMeasurementData(newMeasurement);
        if (!validData) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid data'
            });
        }

        // Update the measurement in the database
        const result = await updateMeasurement(id, validData);

        // Return the updated measurement
        return result;
    } catch (error) {
        const errorMessage = 'Error while updating the measurement';
        console.error(errorMessage, error);
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || errorMessage
        });
    }
});