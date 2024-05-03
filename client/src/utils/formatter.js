// Timestamp formatter
export const formatTimestamp = timestamp => {
    const date = new Date(timestamp); // Create date object from timestamp
    return date.toLocaleString(); // Format date as a string
};

// Date formatter
export const formatDate = timestamp => {
    const date = new Date(timestamp); // Create date object from timestamp
    return date.toLocaleDateString(); // Format date as a string
};

// Format from JS date to YYYY-MM-DD + TIME
export const formatJsDateToIsoStringDate = (date, includeTime) => {
    if (!date) return; // If no date, exit
    return includeTime ? date.toISOString() : date.toISOString().split('T')[0]; // Format date as a string
};

// Temperature formatter
export const formatTemperature = temperature => {
    return temperature.toFixed(1); // Round to 2 decimal places
};

// Humidity formatter
export const formatHumidity = humidity => {
    return humidity.toFixed(1); // Round to 2 decimal places
};