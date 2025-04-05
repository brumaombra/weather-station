import { getAggregatedDailyMeasurements } from '../../db/measurements.js';

export default defineEventHandler(async event => {
    try {
        const params = getQuery(event);
        const measurements = await getAggregatedDailyMeasurements(params);
        return measurements || [];
    } catch (error) {
        console.error('Failed to get measurements data', error);
        throw error;
    }
});