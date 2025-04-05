// Get all the measurements
export const getMeasurements = async params => {
    try {
        const data = await $fetch('/api/measurements', { params });
        return data;
    } catch (error) {
        throw new Error('Failed to fetch measurements');
    }
};

// Get all the aggregated measurements
export const getAggregatedMeasurements = async params => {
    try {
        const data = await $fetch('/api/measurements/aggregated', { params });
        return data;
    } catch (error) {
        throw new Error('Failed to fetch aggregated measurements');
    }
};

// Get the last measurement
export const getLastMeasurement = async () => {
    try {
        const data = await $fetch('/api/measurements/last');
        return data;
    } catch (error) {
        throw new Error('Failed to fetch last measurement');
    }
};

// Update a measurement
export const updateMeasurement = async measurement => {
    try {
        const data = await $fetch(`/api/measurements/${measurement.id}`, {
            method: 'PUT',
            body: measurement
        });

        return data;
    } catch (error) {
        throw new Error('Failed to update measurement');
    }
};

// Delete multiple measurements
export const deleteMeasurements = async idList => {
    try {
        const data = await $fetch('/api/measurements', {
            method: 'DELETE',
            body: { idList }
        });

        return data;
    } catch (error) {
        throw new Error('Failed to delete measurements');
    }
};