import { getLastMeasurement } from '~/server/db/measurements.js';

export default defineEventHandler(async event => {
    try {
        const params = getQuery(event);
        const measurement = await getLastMeasurement(params);
        return measurement || {};
    } catch (error) {
        console.error('Failed to get measurements data', error);
        throw error;
    }
});