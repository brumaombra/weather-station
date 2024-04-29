import aedes from 'aedes';
import net from 'net';
import { addMeasurement } from '../db/sql.js';
import { validateNewMeasurementData } from '../utils/utils.js';

const aedesInstance = aedes();
const port = 1883; // Broker port
const server = net.createServer(aedesInstance.handle); // Create the server
const clientWhiteList = ['weather_station']; // List of allowed client IDs

// Connection authorization
aedesInstance.authenticate = (client, username, password, callback) => {
    if (clientWhiteList.includes(client.id)) { // Client in whitelist
        callback(null, true);
    } else { // Client not in whitelist
        const errorMessage = `Unauthorized connection attempt by ${client.id}`;
        console.warning(errorMessage);
        const error = new Error(errorMessage);
        error.returnCode = 4; // MQTT connack return code for bad username or password
        callback(error, false); // Unauthorized
    }
};

// Subscription authorization
aedesInstance.authorizeSubscribe = (client, sub, callback) => {
    if (clientWhiteList.includes(client.id)) { // Client in whitelist
        callback(null, sub);
    } else { // Client not in whitelist
        console.warning(`Unauthorized subscribe attempt by ${client.id}`);
        callback(new Error('Unauthorized'), null); // Unauthorized
    }
};

// Publish authorization
aedesInstance.authorizePublish = (client, packet, callback) => {
    if (clientWhiteList.includes(client.id)) { // Client in whitelist
        callback(null);
    } else { // Client not in whitelist
        console.warning(`Unauthorized publish attempt by ${client.id}`);
        callback(new Error('Unauthorized')); // Unauthorized
    }
};

// Handle new MQTT clients
aedesInstance.on('client', client => {
    console.log(`---------------------------------------------- ${new Date().toLocaleString()}`);
    console.log(`Client connected: ${client.id}`);
});

// Handle MQTT subscriptions
aedesInstance.on('subscribe', (subscriptions, client) => {
    console.log(`Client subscribed: ${client.id}`);
});

// Handle MQTT client disconnections
aedesInstance.on('clientDisconnect', client => {
    console.log(`Client disconnected: ${client.id}`);
    console.log(`---------------------------------------------- ${new Date().toLocaleString()}`);
});

// Handle incoming MQTT messages
aedesInstance.on('publish', async (packet, client) => {
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