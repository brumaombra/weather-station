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
            host: process.env.MYSQL_IP,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE_NAME
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
    let query = knex('measurements').select('*'); // Select all columns from the measurements table
    query = query.orderBy(params.orderField || 'timestamp', params.orderDirection || 'desc'); // Add order filter
    query = query.limit(params.limit || 25).offset(params.offset || 0); // For pagination
    if (params.startDate) query = query.where('timestamp', '>=', getMaxAndMinFromDate(new Date(params.startDate)).minDate); // Add start date
    if (params.endDate) query = query.where('timestamp', '<=', getMaxAndMinFromDate(new Date(params.endDate)).maxDate); // Add end date
    return query;
};

// Create the query to get the number of measurements from the database
const createQueryGetMeasurementsCount = params => {
    let query = knex('measurements').count('* as count'); // Count the number of rows in the measurements table
    if (params.startDate) query = query.where('timestamp', '>=', getMaxAndMinFromDate(new Date(params.startDate)).minDate); // Add start date
    if (params.endDate) query = query.where('timestamp', '<=', getMaxAndMinFromDate(new Date(params.endDate)).maxDate); // Add end date
    return query;
};

// Get the measurements from the database
export const getMeasurements = async params => {
    try {
        const query = createQueryGetMeasurements(params); // Create the query
        const queryCount = createQueryGetMeasurementsCount(params); // Create the query to get the number of results
        console.log(query.toString()); // Log the query
        const results = await query; // Execute the query
        const count = await queryCount.first(); // Get the number of results
        return { count: count.count, results: results }; // Return the results and the number of results
    } catch (error) {
        console.error('Error while reading the measurements:', error);
    }
};

// Create the query to get the aggregated measurements from the database
const createQueryGetAggregatedDailyMeasurements = params => {
    let query = knex('measurements').select(knex.raw('DATE(timestamp) as date')); // Select the date column
    query = query.avg('temperature as temperatureAvg').min('temperature as temperatureMin').max('temperature as temperatureMax'); // Add temperature data
    query = query.avg('humidity as humidityAvg').min('humidity as humidityMin').max('humidity as humidityMax'); // Add humidity data
    query = query.groupByRaw('DATE(timestamp)'); // Group by
    query = query.orderBy('date', 'asc'); // Add order filter
    if (params.startDate) query = query.whereRaw('DATE(timestamp) >= ?', [getMaxAndMinFromDate(new Date(params.startDate)).minDate]); // Add start date
    if (params.endDate) query = query.whereRaw('DATE(timestamp) <= ?', [getMaxAndMinFromDate(new Date(params.endDate)).maxDate]); // Add end date
    return query;
};

// Get the aggregated measurements from the database
export const getAggregatedDailyMeasurements = async params => {
    try {
        const query = createQueryGetAggregatedDailyMeasurements(params); // Create the query
        console.log(query.toString()); // Log the query
        const results = await query; // Execute the query
        // const subQueryCount = query.clone().as('sub'); // Create a subquery to get the number of results
        // const count = await knex.count('* as count').from(subQueryCount).first(); // Get the number of results
        return { count: results.length, results: results }; // Return the results and the number of results
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