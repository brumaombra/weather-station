import dotenv from 'dotenv';
import knexLib from 'knex';
import { getMaxAndMinFromDate, dateIsYesterday } from '../utils/utils.js';
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
        await knex.raw('SELECT 1'); // Execute the query correctly
        console.log('Successfully connected to the database');
    } catch (error) {
        const errorMessage = 'Error while connecting to the database';
        console.error(errorMessage, error); // Log the error
        throw new Error(errorMessage); // Throw the error
    }
};

// Get the user from the database
export const getUser = async username => {
    try {
        if (!username) throw new Error(); // Check if the username is provided
        const query = knex('users').where({ username }); // Create the query to get the user
        const result = await query.first(); // Execute the query and return the first result
        return result; // Return the user
    } catch (error) {
        const errorMessage = 'Error while reading the user';
        console.log(errorMessage, error); // Log the error
        throw new Error(errorMessage); // Throw the error
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
        const errorMessage = 'Error while reading the measurements';
        console.log(errorMessage, error); // Log the error
        throw new Error(errorMessage); // Throw the error
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

// Create the query to get the aggregated measurements from the database
const createQueryGetAggregatedDailyMeasurementsSingle = params => {
    let query = knex('measurements').select('timestamp as date'); // Select the date column
    query = query.select('temperature as temperatureAvg').select('temperature as temperatureMin').select('temperature as temperatureMax'); // Add temperature data
    query = query.select('humidity as humidityAvg').select('humidity as humidityMin').select('humidity as humidityMax'); // Add humidity data
    query = query.orderBy('date', 'asc'); // Add order filter
    if (params.startDate) query = query.whereRaw('DATE(timestamp) >= ?', [getMaxAndMinFromDate(new Date(params.startDate)).minDate]); // Add start date
    if (params.endDate) query = query.whereRaw('DATE(timestamp) <= ?', [getMaxAndMinFromDate(new Date(params.endDate)).maxDate]); // Add end date
    return query;
};

// Get the aggregated measurements from the database
export const getAggregatedDailyMeasurements = async params => {
    try {
        const startDate = new Date(params.startDate); // Get the start date
        const query = dateIsYesterday(startDate) ? createQueryGetAggregatedDailyMeasurementsSingle(params) : createQueryGetAggregatedDailyMeasurements(params); // Create the query
        console.log(query.toString()); // Log the query
        const results = await query; // Execute the query
        return { count: results.length, results: results }; // Return the results and the number of results
    } catch (error) {
        const errorMessage = 'Error while reading the measurements';
        console.log(errorMessage, error); // Log the error
        throw new Error(errorMessage); // Throw the error
    }
};

// Update the measurement in the database
export const updateMeasurement = async (id, newData) => {
    try {
        const query = knex('measurements').where('id', id).update(newData); // Create the query
        console.log(query.toString()); // Log the query
        const results = await query; // Execute the query
        return results; // Return the results
    } catch (error) {
        const errorMessage = 'Error while updating the measurement';
        console.log(errorMessage, error); // Log the error
        throw new Error(errorMessage); // Throw the error
    }
};

// Delete one or multiple measurements
export const deleteMeasurements = async idList => {
    try {
        const query = knex('measurements').whereIn('id', idList).delete(); // Create the query
        console.log(query.toString()); // Log the query
        const results = await query; // Execute the query
        return results; // Return the results
    } catch (error) {
        const errorMessage = 'Error while deleting the measurements';
        console.log(errorMessage, error); // Log the error
        throw new Error(errorMessage); // Throw the error
    }
};

// Add a measurement to the database
export const addMeasurement = async measurement => {
    try {
        measurement.timestamp = new Date(); // Set the timestamp
        const query = knex('measurements').insert(measurement); // Create the query
        console.log(query.toString()); // Log the query
        const results = await executeQueryWithReconnection(() => query); // Execute the query
        // const results = await query; // Execute the query
        return results; // Return the results
    } catch (error) {
        const errorMessage = 'Error while adding the measurement';
        const newError = new Error(errorMessage, { cause: error }); // Save the old error to the stack
        console.log(errorMessage, newError); // Log the error
        throw newError; // Throw the error
        // const errorMessage = 'Error while adding the measurement';
        // console.log(errorMessage, error); // Log the error
        // throw new Error(errorMessage); // Throw the error
    }
};

// Execute a query with reconnection handling
const executeQueryWithReconnection = async queryFunction => {
    try {
        return await queryFunction(); // try to execute the query
    } catch (error) {
        const isConnectionError = error.message.includes('ECONNRESET') || error.cause?.message?.includes('ECONNRESET');
        if (!isConnectionError) throw error; // Throw the error if it's not a connection error
        console.log('Connection to MySQL database lost, reconnecting...');
        try {
            await initMySqlDatabase(); // Try to reconnect to the database
            return await queryFunction(); // Execute the query again
        } catch (reconnectionError) {
            throw reconnectionError;
        }
    }
};