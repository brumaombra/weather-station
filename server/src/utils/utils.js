// Get min and max date from a date
export const getMaxAndMinFromDate = date => {
    let minDate = new Date(date);
    minDate.setHours(0, 0, 0, 0);
    let maxDate = new Date(date);
    maxDate.setHours(23, 59, 59, 999);
    return { minDate, maxDate };
};

// Check if the date is yesterday
export const dateIsYesterday = date => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toLocaleDateString() === yesterday.toLocaleDateString();
};

// Validate the received data
export const validateNewMeasurementData = data => {
    const temperatureValid = typeof data.temperature === 'number' && Number.isFinite(data.temperature);
    const humidityValid = typeof data.humidity === 'number' && Number.isFinite(data.humidity);
    if (!temperatureValid || !humidityValid) return { isValid: false }; // Invalid data
    const validMeasurement = { temperature: data.temperature, humidity: data.humidity }; // Create the valid data
    return { isValid: true, data: validMeasurement }; // Return the valid data
};