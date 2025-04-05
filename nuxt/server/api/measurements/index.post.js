import { readBody } from 'h3';
import { addMeasurement } from '../../db/measurements.js';
import { validateNewMeasurementData } from '../../utils/utils.js';

export default defineEventHandler(async event => {
    try {
        // Get the measurement from the request body
        const newMeasurement = await readBody(event);

        // Validate the data
        const validData = validateNewMeasurementData(newMeasurement);
        if (!validData) {
            return {
                statusCode: 400,
                body: { message: 'Invalid data' }
            };
        }

        // Add the measurement to the database
        const result = await addMeasurement(validData);
        return result;
    } catch (error) {
        console.error('Error while adding the measurement:', error);
        return {
            statusCode: 500,
            body: { message: 'Internal Server Error' }
        };
    }
});