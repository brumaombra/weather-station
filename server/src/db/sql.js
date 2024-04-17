import dotenv from 'dotenv';
import knexLib from 'knex';
import { getMaxAndMinFromDate } from '../utils/utils.js';
dotenv.config(); // Load the .env file

let knex; // Declare the global variable for the Knex library

// Initialize the MySQL database
export const initMySqlDatabase = async () => {
    knex = knexLib({ // Initialize the Knex library
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            port: 3306,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: 'weather-station'
        }
    });
    
    try { // Test the connection
        const query = knex.raw('SELECT 1'); // Create the query
        await query; // Execute the query
        console.log('Successfully connected to the database');
    } catch (error) {
        console.error('Error while connecting to the database:', error);
    }
};

// Create the query to get the measurements from the database
const createQueryGetMeasurements = params => {
    let query = knex.select('*').from('measurements'); // Select all columns from the measurements table
    query = query.orderBy(params.orderField || 'timestamp', params.orderDirection || 'desc'); // Add order filter
    query = query.limit(params.limit || 25); // Limit the number of results
    if (params.startDate) query = query.where('timestamp', '>=', getMaxAndMinFromDate(new Date(params.startDate)).minDate); // Add start date
    if (params.endDate) query = query.where('timestamp', '<=', getMaxAndMinFromDate(new Date(params.endDate)).maxDate); // Add end date
    return query;
};

// Get the measurements from the database
export const getMeasurements = async params => {
    try {
        const query = createQueryGetMeasurements(params); // Create the query
        console.log(query.toString()); // Log the query
        return await query; // Execute the query
    } catch (error) {
        console.error('Error while reading the measurements:', error);
    }
};

// Update the measurement in the database
export const updateMeasurement = async (id, newData) => {
    try {
        const query = knex('measurements').where('id', id).update(newData); // Create the query
        console.log(query.toString()); // Log the query
        await query; // Execute the query
    } catch (error) {
        console.error('Error while updating the measurement:', error);
    }
};

// Delete one or multiple measurements
export const deleteMeasurements = async idList => {
    try {
        const query = knex('measurements').whereIn('id', idList).delete(); // Create the query
        console.log(query.toString()); // Log the query
        await query; // Execute the query
    } catch (error) {
        console.error('Error while deleting the measurements:', error);
    }
};

// Add a measurement to the database
export const addMeasurement = async measurement => {
    try {
        measurement.timestamp = new Date(); // Set the timestamp
        const query = knex('measurements').insert(measurement); // Create the query
        console.log(query.toString()); // Log the query
        await query; // Execute the query
    } catch (error) {
        console.error('Error while adding the measurement:', error);
    }
};