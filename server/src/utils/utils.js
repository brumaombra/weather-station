// Check if the date is yesterday
export const dateIsYesterday = date => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toLocaleDateString() === yesterday.toLocaleDateString();
};

// Check if the date in the last 24h
export const dateIsInLast24Hours = date => {
    if (!date || !(date instanceof Date)) return; // If date not correct, exit
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date > yesterday;
};

// Validate the received data
export const validateNewMeasurementData = data => {
    const temperatureValid = typeof data.temperature === 'number' && Number.isFinite(data.temperature);
    const humidityValid = typeof data.humidity === 'number' && Number.isFinite(data.humidity);
    const pressureValid = typeof data.pressure === 'number' && Number.isFinite(data.pressure);
    const gasValid = typeof data.gas === 'number' && Number.isFinite(data.gas);
    const pm25Valid = typeof data.pm25 === 'number' && Number.isFinite(data.pm25);
    const pm10Valid = typeof data.pm10 === 'number' && Number.isFinite(data.pm10);
    if (!temperatureValid || !humidityValid || !pressureValid || !gasValid || !pm25Valid || !pm10Valid) return { isValid: false }; // Invalid data
    const validMeasurement = { temperature: data.temperature, humidity: data.humidity, pressure: data.pressure, gas: data.gas, pm25: data.pm25, pm10: data.pm10 }; // Create the valid data
    return { isValid: true, data: validMeasurement }; // Return the valid data
};