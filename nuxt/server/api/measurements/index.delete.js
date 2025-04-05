import { readBody } from 'h3';
import { deleteMeasurements } from '../../db/measurements.js';
import { checkFirebaseSession } from '../../utils/firebase/firebaseAdmin.js';

export default defineEventHandler(async event => {
    try {
        // Middleware to check Firebase session
        await checkFirebaseSession(event);

        // Get the ID list from the request body
        const { idList } = await readBody(event);

        // Validate the input data
        if (!idList || !Array.isArray(idList) || idList.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid data, expected an array of ids'
            });
        }

        // Delete the measurements from the database
        const result = await deleteMeasurements(idList);
        return result;
    } catch (error) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Error while deleting the measurements'
        });
    }
});