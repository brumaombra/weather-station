import { spawn } from 'child_process';

// Run a Python script
export const executePython = scriptUrl => {
    return new Promise((resolve, reject) => {
        const pyprog = spawn('python', [scriptUrl]);
        let dataAccumulator = '';
        pyprog.stdout.on('data', data => { dataAccumulator += data.toString(); }); // Create the string from the stream
        pyprog.on('close', code => { code !== 0 ? reject(new Error(`Script exited with code ${code}`)) : resolve(dataAccumulator); }); // Check if the script has ended
        pyprog.stderr.on('data', data => { reject(new Error(data.toString())); }); // Check if there is an error
    });
};

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
    const validMeasurement = { temperature: data.temperature, humidity: data.humidity, pressure: data.pressure, gas: data.gas, pm25: data.pm25, mp10: data.pm10 }; // Create the valid data
    return { isValid: true, data: validMeasurement }; // Return the valid data
};