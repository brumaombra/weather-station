import aedes from 'aedes';
import net from 'net';
import bcrypt from 'bcrypt';
import { addMeasurement, getMqttUser } from '../db/sql.js';
import { validateNewMeasurementData } from '../utils/utils.js';

const aedesInstance = aedes();
const port = 1883; // Broker port
const server = net.createServer(aedesInstance.handle); // Create the server

// Connection authorization
aedesInstance.authenticate = async (client, username, password, callback) => {
    console.log(`Client ${client.id} is trying to authenticate`);
    if (!username) return callback(new Error(`Client ${client.id} unauthorized`), false); // Error if the username is empty
    try { // Check if the username and password are valid
        const user = await getMqttUser(username); // Get the user from the database
        if (user && await bcrypt.compare(password, user.password)) {
            console.log(`Client ${client.id} is authenticated`);
            callback(null, true); // Success
        } else {
            const error = new Error(`Client ${client.id} unauthorized`);
            error.returnCode = 4; // MQTT connack return code for bad username or password
            console.error(error.message); // Log the error
            callback(error, false); // Unauthorized
        }
    } catch (error) {
        const newError = new Error('Error while authenticating the MQTT user', { cause: error });
        console.error(newError); // Log the error
        callback(newError, false); // Unauthorized
    }
};

// Subscription authorization
aedesInstance.authorizeSubscribe = (client, sub, callback) => {
    callback(null, sub); // Success
};

// Publish authorization
aedesInstance.authorizePublish = (client, packet, callback) => {
    callback(null); // Success
};

// Handle new MQTT clients
aedesInstance.on('client', client => {
    if (!client) return; // Ignore the unknown clients
    console.log(`Client connected: ${client.id} ------------------------ ${new Date().toLocaleString()}`);
});

// Handle MQTT subscriptions
aedesInstance.on('subscribe', (subscriptions, client) => {
    if (!client) return; // Ignore the unknown clients
    console.log(`Client subscribed: ${client.id}`);
});

// Handle MQTT client disconnections
aedesInstance.on('clientDisconnect', client => {
    if (!client) return; // Ignore the unknown clients
    console.log(`Client disconnected: ${client.id} ------------------------ ${new Date().toLocaleString()}`);
});

// Handle incoming MQTT messages
aedesInstance.on('publish', async (packet, client) => {
    if (!client) return; // Ignore the unknown clients
    const topic = packet.topic?.toString() || 'EMPTY';
    const payload = packet.payload?.toString() || '{}';
    console.log(`Message received from client ${client.id} on topic ${topic} with payload ${payload}`);
    await addNewMeasurement(payload); // Execute the action
});

// Add a new measurement to the DB
const addNewMeasurement = async payload => {
    try {
        const parsedPayload = JSON.parse(payload); // Parse the JSON data
        const validation = validateNewMeasurementData(parsedPayload); // Validate the data
        if (!validation.isValid) throw new Error('Invalid data'); // Throw an error if the data is invalid
        await addMeasurement(validation.data); // Add the measurement to the DB
        console.log('New measurement added successfully!'); // Log the success
    } catch (error) {
        console.error('Error while adding the measurement!', error); // Log the error
    }
};

// Start the MQTT broker
export const startMQTTBroker = () => {
    server.listen(port, () => { // Start the MQTT broker
        console.log(`Broker MQTT listening on port ${port}`);
    });
};