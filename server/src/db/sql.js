import dotenv from 'dotenv';
import knexLib from 'knex';
import { dateIsYesterday } from '../utils/utils.js';
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
        console.log(`IP: ${process.env.MYSQL_IP}`);
        console.log(`Port: ${process.env.MYSQL_PORT}`);
        console.log(`User: ${process.env.MYSQL_USER}`);
        console.log(`Database: ${process.env.MYSQL_DATABASE_NAME}`);
        console.log(`Password: ${process.env.MYSQL_PASSWORD}`);
    } catch (error) {
        const newError = new Error('Error while connecting to the database', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Destroy the connection to the database
const destroyConnection = async () => {
    try {
        await knex.destroy(); // Destroy the connection to the database
        console.log('Connection to the database closed');
    } catch (error) {
        const newError = new Error('Error while closing the connection to the database', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Create the query to get the user from the database
const createQueryGetUser = username => {
    const query = knex('users').where({ username }).first(); // Create the query to get the user
    console.log(query.toString()); // Log the query
    return query;
};

// Get the user from the database
export const getUser = async username => {
    try {
        if (!username) throw new Error('Username is required'); // Check if the username is provided
        const result = await executeQueryWithReconnection(() => createQueryGetUser(username)); // Execute the query
        return result; // Return the user
    } catch (error) {
        const newError = new Error('Error while reading the user', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Create the query to get the MQTT user from the database
const createQueryGetMqttUser = username => {
    const query = knex('mqttUsers').where({ username }).first(); // Create the query to get the user
    console.log(query.toString()); // Log the query
    return query;
};

// Get the MQTT user from the database
export const getMqttUser = async username => {
    try {
        if (!username) throw new Error('Username is required'); // Check if the username is provided
        const result = await executeQueryWithReconnection(() => createQueryGetMqttUser(username)); // Execute the query
        return result; // Return the user
    } catch (error) {
        const newError = new Error('Error while reading the user', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Create the query to get the measurements from the database
const createQueryGetMeasurements = params => {
    let query = knex('measurements').select('*'); // Select all columns from the measurements table
    query = query.orderBy(params.orderField || 'timestamp', params.orderDirection || 'desc'); // Add order filter
    if (params.limit) query = query.limit(params.limit); // Limit
    if (params.offset) query = query.offset(params.offset); // Offset
    if (params.startDate) query = query.where('timestamp', '>=', new Date(params.startDate)); // Add start date
    if (params.endDate) query = query.where('timestamp', '<=', new Date(params.endDate)); // Add end date
    if (params.measurementType === 'ano') query = query.where('temperatureAnomaly', true).orWhere('humidityAnomaly', true).orWhere('pressureAnomaly', true).orWhere('gasAnomaly', true).orWhere('pm1Anomaly', true).orWhere('pm25Anomaly', true).orWhere('pm10Anomaly', true);
    if (params.measurementType === 'nor') query = query.where('temperatureAnomaly', false).where('humidityAnomaly', false).where('pressureAnomaly', false).where('gasAnomaly', false).where('pm1Anomaly', false).where('pm25Anomaly', false).where('pm10Anomaly', false);
    console.log(query.toString()); // Log the query
    return query;
};

// Create the query to get the number of measurements from the database
const createQueryGetMeasurementsCount = params => {
    let query = knex('measurements').count('id as count').first(); // Count the number of rows in the measurements table
    if (params.startDate) query = query.where('timestamp', '>=', new Date(params.startDate)); // Add start date
    if (params.endDate) query = query.where('timestamp', '<=', new Date(params.endDate)); // Add end date
    if (params.measurementType === 'ano') query = query.where('temperatureAnomaly', true).orWhere('humidityAnomaly', true).orWhere('pressureAnomaly', true).orWhere('gasAnomaly', true).orWhere('pm1Anomaly', true).orWhere('pm25Anomaly', true).orWhere('pm10Anomaly', true);
    if (params.measurementType === 'nor') query = query.where('temperatureAnomaly', false).where('humidityAnomaly', false).where('pressureAnomaly', false).where('gasAnomaly', false).where('pm1Anomaly', false).where('pm25Anomaly', false).where('pm10Anomaly', false);
    console.log(query.toString()); // Log the query
    return query;
};

// Get the measurements from the database
export const getMeasurements = async params => {
    try {
        if (!params) params = {}; // If no params, assign an empty object
        const results = await executeQueryWithReconnection(() => createQueryGetMeasurements(params)); // Execute the query
        const count = await executeQueryWithReconnection(() => createQueryGetMeasurementsCount(params)); // Execute the query
        return { count: count.count, results: results }; // Return the results and the number of results
    } catch (error) {
        const newError = new Error('Error while reading the measurements', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Create the query to get the aggregated measurements from the database
const createQueryGetAggregatedDailyMeasurements = params => {
    let query = knex('measurements').select(knex.raw('DATE(timestamp) as date')); // Select the date column
    query = query.avg('temperature as temperatureAvg').min('temperature as temperatureMin').max('temperature as temperatureMax'); // Add temperature data
    query = query.avg('humidity as humidityAvg').min('humidity as humidityMin').max('humidity as humidityMax'); // Add humidity data
    query = query.avg('pressure as pressureAvg').min('pressure as pressureMin').max('pressure as pressureMax'); // Add pressure data
    query = query.avg('gas as gasAvg').min('gas as gasMin').max('gas as gasMax'); // Add gas data
    query = query.avg('pm1 as pm1Avg').min('pm1 as pm1Min').max('pm1 as pm1Max'); // Add PM 1 data
    query = query.avg('pm25 as pm25Avg').min('pm25 as pm25Min').max('pm25 as pm25Max'); // Add PM 2.5 data
    query = query.avg('pm10 as pm10Avg').min('pm10 as pm10Min').max('pm10 as pm10Max'); // Add PM 10 data
    query = query.groupByRaw('DATE(timestamp)'); // Group by
    query = query.orderBy('date', 'asc'); // Add order filter
    if (params.startDate) query = query.whereRaw('timestamp >= ?', [new Date(params.startDate)]); // Add start date
    if (params.endDate) query = query.whereRaw('timestamp <= ?', [new Date(params.endDate)]); // Add end date
    console.log(query.toString()); // Log the query
    return query;
};

// Create the query to get the aggregated measurements from the database
const createQueryGetAggregatedDailyMeasurementsSingle = params => {
    let query = knex('measurements').select('timestamp as date'); // Select the date column
    query = query.select('temperature as temperatureAvg').select('temperature as temperatureMin').select('temperature as temperatureMax'); // Add temperature data
    query = query.select('humidity as humidityAvg').select('humidity as humidityMin').select('humidity as humidityMax'); // Add humidity data
    query = query.select('pressure as pressureAvg').select('pressure as pressureMin').select('pressure as pressureMax'); // Add pressure data
    query = query.select('gas as gasAvg').select('gas as gasMin').select('gas as gasMax'); // Add gas data
    query = query.select('pm1 as pm1Avg').select('pm1 as pm1Min').select('pm1 as pm1Max'); // Add PM 1 data
    query = query.select('pm25 as pm25Avg').select('pm25 as pm25Min').select('pm25 as pm25Max'); // Add PM 2.5 data
    query = query.select('pm10 as pm10Avg').select('pm10 as pm10Min').select('pm10 as pm10Max'); // Add PM 10 data
    query = query.orderBy('date', 'asc'); // Add order filter
    if (params.startDate) query = query.whereRaw('timestamp >= ?', [new Date(params.startDate)]); // Add start date
    if (params.endDate) query = query.whereRaw('timestamp <= ?', [new Date(params.endDate)]); // Add end date
    console.log(query.toString()); // Log the query
    return query;
};

// Get the aggregated measurements from the database
export const getAggregatedDailyMeasurements = async params => {
    try {
        const startDate = new Date(params.startDate); // Get the start date
        let results;
        if (dateIsYesterday(startDate)) // Check if the start date is yesterday
            results = await executeQueryWithReconnection(() => createQueryGetAggregatedDailyMeasurementsSingle(params)); // Execute the query
        else
            results = await executeQueryWithReconnection(() => createQueryGetAggregatedDailyMeasurements(params)); // Execute the query
        return { count: results.length, results: results }; // Return the results and the number of results
    } catch (error) {
        const newError = new Error('Error while reading the measurements', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Create the query to get the last measurement from the database
const createQueryGetLastMeasurement = () => {
    const query = knex('measurements').select('*').orderBy('timestamp', 'desc').first(); // Extract the last element
    console.log(query.toString()); // Log the query
    return query;
};

// Create the query to get last week measurement from the database
const createQueryGetLastWeekMeasurement = () => {
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Get the last week
    let query = knex('measurements').select('*').orderBy('timestamp', 'desc').first(); // Extract the last element
    query = query.whereRaw('timestamp <= ?', [lastWeek]); // Add start date
    console.log(query.toString()); // Log the query
    return query;
};

// Get the last measurement from the database
export const getLastMeasurement = async () => {
    try {
        const lastMeasurement = await executeQueryWithReconnection(() => createQueryGetLastMeasurement()); // Execute the query
        const lastWeekMeasurement = await executeQueryWithReconnection(() => createQueryGetLastWeekMeasurement()); // Execute the query
        return { ...lastMeasurement, lastWeek: { ...lastWeekMeasurement } };
    } catch (error) {
        const newError = new Error('Error while reading the measurement', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Create the query to get the aggregated measurements from the database
const createQueryUpdateMeasurements = (id, newData) => {
    const query = knex('measurements').where('id', id).update(newData); // Create the query
    console.log(query.toString()); // Log the query
    return query;
};

// Update the measurement in the database
export const updateMeasurement = async (id, newData) => {
    try {
        const results = await executeQueryWithReconnection(() => createQueryUpdateMeasurements(id, newData)); // Execute the query
        return results; // Return the results
    } catch (error) {
        const newError = new Error('Error while updating the measurement', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Create the query to delete the measurement from the database
const createQueryDeleteMeasurements = idList => {
    const query = knex('measurements').whereIn('id', idList).delete(); // Create the query
    console.log(query.toString()); // Log the query
    return query;
};

// Delete one or multiple measurements
export const deleteMeasurements = async idList => {
    try {
        const results = await executeQueryWithReconnection(() => createQueryDeleteMeasurements(idList)); // Execute the query
        return results; // Return the results
    } catch (error) {
        const newError = new Error('Error while deleting the measurements', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Create the query to add a measurement to the database
const createQueryAddMeasurement = measurement => {
    const query = knex('measurements').insert(measurement); // Create the query
    console.log(query.toString()); // Log the query
    return query;
};

// Add a measurement to the database
export const addMeasurement = async measurement => {
    try {
        const results = await executeQueryWithReconnection(() => createQueryAddMeasurement(measurement)); // Execute the query
        return results; // Return the results
    } catch (error) {
        const newError = new Error('Error while adding the measurement', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Execute a query with reconnection handling
const executeQueryWithReconnection = async queryFunction => {
    try {
        return await queryFunction(); // try to execute the query
    } catch (error) {
        const isConnectionError = error.message.includes('ECONNRESET') || error.cause?.message?.includes('ECONNRESET');
        if (isConnectionError) { // Check if the error is a connection error
            console.error('Connection to MySQL database lost, reconnecting...');
            try { // Handle the reconnection
                await destroyConnection(); // Destroy the connection to the database
                await initMySqlDatabase(); // Try to reconnect to the database
                return await queryFunction(); // Execute the query again
            } catch (reconnectionError) {
                throw reconnectionError;
            }
        } else {
            throw error; // Rethrow the error
        }
    }
};