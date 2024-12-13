import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlParser from 'node-sql-parser';

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
    if (!temperatureValid || !humidityValid || !pressureValid || !gasValid || !pm1Valid || !pm25Valid || !pm10Valid) return { isValid: false }; // Invalid data
    const validMeasurement = { temperature: data.temperature, humidity: data.humidity, pressure: data.pressure, gas: data.gas, pm1: data.pm1, pm25: data.pm25, pm10: data.pm10 }; // Create the valid data
    return { isValid: true, data: validMeasurement }; // Return the valid data
};

// Read file
export const readFile = async (url, filePath) => {
    try {
        if (!url || !filePath) throw new Error('Invalid URL or file path'); // Check if the URL or file path is valid

        // Load the file
        const __filename = fileURLToPath(url);
        const __dirname = path.dirname(__filename);
        const fileLocation = path.resolve(__dirname, filePath);
        const content = await fs.readFile(fileLocation, 'utf-8');
        return content; // Return the content
    } catch (error) {
        console.error(error);
        throw new Error('Error while reading the file');
    }
};

// Check if a SQL query is a SELECT query
export const isSelectQuery = query => {
    try {
        const parser = new sqlParser.Parser();
        const parsed = parser.parse(query); // Parse the query
        return parsed.ast.type === 'select';
    } catch (error) {
        console.error('Error while parsing:', error.message);
        return false;
    }
};