// Timestamp formatter
export const formatTimestamp = timestamp => {
    const date = new Date(timestamp); // Create date object from timestamp
    return date.toLocaleString(); // Format date as a string
};

// Timestamp formatter (If midnight, don't display the time)
export const formatTimestampChart = timestamp => {
    const date = new Date(timestamp); // Create date object from timestamp
    const isMidnightUTC = date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;
    return isMidnightUTC ? date.toLocaleDateString() : date.toLocaleString(); // If midnight, format the date without the time
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

// Format number to K, M, B
export const formatUnitNumber = (num, decimal) => {
    if (typeof num !== 'number') return; // If no data, exit
    const decimals = typeof num === 'number' ? decimal : 2;
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + 'B';
    } if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + 'k';
    } else {
        return num.toFixed(decimals);
    }
};