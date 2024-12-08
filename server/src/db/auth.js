import { knex, logQuery, executeQueryWithReconnection } from './connection.js';

// Get the user from the database
export const getUser = async username => {
    try {
        // Parameters validation
        if (!username) throw new Error('Username is required');

        // Create the query
        const query = knex(`weatherStation_users`).where({ username }).first();
        logQuery(query);

        // Execute the query
        return await executeQueryWithReconnection(query);
    } catch (error) {
        const newError = new Error('Error while reading the user', { cause: error });
        console.error(newError);
        throw newError;
    }
};

// Get the MQTT user from the database
export const getMqttUser = async username => {
    try {
        // Parameters validation
        if (!username) throw new Error('Username is required');

        // Create the query
        const query = knex(`weatherStation_mqttUsers`).where({ username }).first();
        logQuery(query);

        // Execute the query
        return await executeQueryWithReconnection(query);
    } catch (error) {
        const newError = new Error('Error while reading the user', { cause: error });
        console.error(newError);
        throw newError;
    }
};