import knexLib from 'knex';

const runtimeConfig = useRuntimeConfig(); // Get the runtime configuration
const MAX_RETRY_ATTEMPTS = 5; // Maximum number of retry attempts for reconnection
let knex; // Global variable for the Knex library

// Check the required environment variables
const checkRequiredEnvVariables = () => {
    const requiredEnvVariables = ['mysqlIp', 'mysqlPort', 'mysqlUser', 'mysqlPassword', 'mysqlDatabase'];
    const missingEnvVariables = requiredEnvVariables.filter(variable => !runtimeConfig[variable]);
    if (missingEnvVariables.length) {
        const errorMessage = `Missing environment variables: ${missingEnvVariables.join(', ')}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}

// Initialize the MySQL database
export const initMySqlDatabase = async () => {
    try {
        checkRequiredEnvVariables(); // Check the required environment variables

        // Initialize the Knex library
        knex = knexLib({
            client: 'mysql2',
            connection: {
                host: runtimeConfig.mysqlIp,
                port: runtimeConfig.mysqlPort,
                user: runtimeConfig.mysqlUser,
                password: runtimeConfig.mysqlPassword,
                database: runtimeConfig.mysqlDatabase,
                typeCast: typeCast // Format the values after reading them from the database
            }, pool: {
                min: 0, // Minimum number of connections
                max: 7, // Maximum number of connections
                acquireTimeoutMillis: 60000, // Maximum time to acquire a connection
                createTimeoutMillis: 30000, // Maximum time to create a connection
                idleTimeoutMillis: 30000, // Maximum time a connection can be idle
                createRetryIntervalMillis: 200 // Time to wait before retrying to create a connection
            }
        });

        // Test the connection
        await knex.raw('SELECT 1');
        console.log('Successfully connected to the database');
    } catch (error) {
        console.error('Error while connecting to the database', error);
        throw error; // Throw the error
    }
};

// Format the values after reading them from the database
const typeCast = (field, next) => {
    if (field.type === 'TINY' && field.length === 1) { // Convert TINYINT(1) to boolean
        return field.string() === '1';
    }
    return next();
};

// Get the Knex object
export const getKnex = () => {
    return knex;
};

// Destroy the connection to the database
const destroyConnection = async () => {
    try {
        await knex.destroy(); // Destroy the connection to the database
        console.log('Connection to the database closed');
    } catch (error) {
        console.error('Error while closing the connection to the database', error);
        throw error; // Throw the error
    }
};

// Execute a query with reconnection handling
export const executeQueryWithReconnection = async (query, retryCount = 0) => {
    try {
        return await query; // Try to execute the query
    } catch (error) {
        const isConnectionError = error.message.includes('ECONNRESET') || error.cause?.message?.includes('ECONNRESET');
        if (isConnectionError && retryCount < MAX_RETRY_ATTEMPTS) { // Check if the error is a connection error
            console.error(`Connection to MySQL database lost, reconnection attempt ${retryCount + 1} of ${MAX_RETRY_ATTEMPTS}...`);
            await destroyConnection(); // Destroy the connection to the database
            await initMySqlDatabase(); // Reconnect to the database
            return executeQueryWithReconnection(query, retryCount + 1); // Retry the query
        }
        throw error; // Rethrow the error
    }
};

// Log the query
export const logQuery = query => {
    if (runtimeConfig.logQueries) { // Log only in development
        console.log(query.toString());
    }
};

// Check the connection to the database
export const checkDbConnection = async () => {
    try {
        const query = knex.raw('SELECT 1'); // Create a test query
        await executeQueryWithReconnection(query); // Test the connection
    } catch (error) {
        console.error('Error while checking the connection to the database', error);
        throw error; // Throw the error
    }
};