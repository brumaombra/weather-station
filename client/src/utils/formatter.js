// Timestamp formatter
export const formatTimestamp = timestamp => {
    if (!timestamp || typeof timestamp.seconds !== 'number' || typeof timestamp.nanoseconds !== 'number') return; // Return an empty string if not valid
    const millisecondsFromSeconds = timestamp.seconds * 1000; // Convert seconds to milliseconds
    const millisecondsFromNanoseconds = timestamp.nanoseconds / 1000000; // Convert nanoseconds to milliseconds
    const totalMilliseconds = millisecondsFromSeconds + millisecondsFromNanoseconds; // Add seconds and nanoseconds to get total milliseconds
    const date = new Date(totalMilliseconds); // Create Date object from total milliseconds
    return date.toLocaleString(); // Format date as a string
};

// Date formatter
export const formatDate = timestamp => {
    if (!timestamp || typeof timestamp.seconds !== 'number' || typeof timestamp.nanoseconds !== 'number') return; // Return an empty string if not valid
    const millisecondsFromSeconds = timestamp.seconds * 1000; // Convert seconds to milliseconds
    const millisecondsFromNanoseconds = timestamp.nanoseconds / 1000000; // Convert nanoseconds to milliseconds
    const totalMilliseconds = millisecondsFromSeconds + millisecondsFromNanoseconds; // Add seconds and nanoseconds to get total milliseconds
    const date = new Date(totalMilliseconds); // Create Date object from total milliseconds
    return date.toLocaleDateString(); // Format date as a string
};

// Temperature formatter
export const formatTemperature = temperature => {
    return temperature.toFixed(2); // Round to 2 decimal places
};

// Humidity formatter
export const formatHumidity = humidity => {
    return humidity.toFixed(2); // Round to 2 decimal places
};