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
    const pm1Valid = typeof data.pm1 === 'number' && Number.isFinite(data.pm1);
    const pm25Valid = typeof data.pm25 === 'number' && Number.isFinite(data.pm25);
    const pm10Valid = typeof data.pm10 === 'number' && Number.isFinite(data.pm10);
    if (!temperatureValid || !humidityValid || !pressureValid || !gasValid || !pm1Valid || !pm25Valid || !pm10Valid) {
        return false; // Invalid data
    }

    // Create the valid data
    const validMeasurement = {
        temperature: data.temperature,
        humidity: data.humidity,
        pressure: data.pressure,
        gas: data.gas,
        pm1: data.pm1,
        pm25: data.pm25,
        pm10: data.pm10
    };

    return validMeasurement; // Return the valid data
};

// Calculate the percentage difference
export const getPercentageDifference = (oldValue, newValue) => {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
};