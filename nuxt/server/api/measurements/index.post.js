import { readBody } from 'h3';
import { addMeasurement } from '../../db/measurements.js';
import { validateNewMeasurementData } from '../../utils/utils.js';

export default defineEventHandler(async event => {
    try {
        // Check for the authentication token in the headers
        const runtimeConfig = useRuntimeConfig();
        const authHeader = event.node.req.headers['authorization'];
        if (!authHeader || authHeader !== `Bearer ${runtimeConfig.authToken}`) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized access'
            });
        }

        // Get the measurement from the request body
        const newMeasurement = await readBody(event);

        // Validate the data
        const validData = validateNewMeasurementData(newMeasurement);
        if (!validData) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid data'
            });
        }

        // Add the measurement to the database
        const result = await addMeasurement(validData);
        return result;
    } catch (error) {
        console.error('Error while adding the measurement:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        });
    }
});