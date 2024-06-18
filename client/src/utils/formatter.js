// Timestamp formatter
export const formatTimestamp = timestamp => {
    const date = new Date(timestamp); // Create date object from timestamp
    return date.toLocaleString(); // Format date as a string
};

// Timestamp formatter (If midnight, don't display the time)
export const formatTimestampChart = timestamp => {
    const date = new Date(timestamp); // Create date object from timestamp

    /*
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let hours = date.getHours();
    let minutes = date.getMinutes();
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours === '00' && minutes === '00' ? `${day}/${month}` : `${day}/${month} ${hours}:${minutes}`;
    */

    return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0 ? date.toLocaleDateString() : date.toLocaleString(); // If midnight, format the date without the time
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