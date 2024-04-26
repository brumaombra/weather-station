import aedes from 'aedes';
import net from 'net';
import { addMeasurement } from '../db/sql.js';
import { validateNewMeasurementData } from '../utils/utils.js';

const port = 1883;
const aedesInstance = aedes();
const server = net.createServer(aedesInstance.handle);

// Handle new MQTT clients
aedesInstance.on('client', client => {
    if (!client) return; // Ignore subscriptions from unknown clients
    console.log(`\n----- ${new Date().toLocaleString()} -----`);
    console.log(`Client connected: ${client.id}`);
});

// Handle MQTT subscriptions
aedesInstance.on('subscribe', (subscriptions, client) => {
    if (!client) return; // Ignore subscriptions from unknown clients
    console.log(`Client subscribed: ${client.id}`);
});

// Handle MQTT client disconnections
aedesInstance.on('clientDisconnect', client => {
    if (!client) return; // Ignore subscriptions from unknown clients
    console.log(`Client disconnected: ${client.id}`);
    console.log(`----- ${new Date().toLocaleString()} -----`);
});

// Handle incoming MQTT messages
aedesInstance.on('publish', async (packet, client) => {
    if (!client) return; // Ignore messages from unknown clients
    const topic = packet.topic?.toString() || 'EMPTY';
    const payload = packet.payload?.toString() || '{}';
    console.log(`Message received from client ${client.id} on topic ${topic} with payload ${payload}`);
    await addNewMeasurement(payload, client); // Execute the action
});

// Add a new measurement to the DB
const addNewMeasurement = async (payload, client) => {
    try {
        const parsedPayload = JSON.parse(payload); // Parse the JSON data
        const validation = validateNewMeasurementData(parsedPayload); // Validate the data
        if (!validation.isValid) throw new Error('Invalid data'); // Throw an error if the data is invalid
        await addMeasurement(validation.data); // Add the measurement to the DB
        console.log('New measurement added successfully!'); // Log the success
        aedesInstance.publish({ topic: `station/confirmation/${client.id}`, payload: JSON.stringify({ status: 'OK' }), qos: 0, retain: false }); // Send a confirmation to the client
        console.log(`Confirmation sent to ${client.id}`);
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