import aedes from 'aedes';
import net from 'net';
import { addMeasurement } from '../db/sql.js';
import { validateNewMeasurementData } from '../utils/utils.js';

const port = 1883;
const aedesInstance = aedes();
const server = net.createServer(aedesInstance.handle);

// Handle new MQTT clients
aedesInstance.on('client', client => {
    console.log('Client connected:', client.id);
});

// Handle MQTT subscriptions
aedesInstance.on('subscribe', (subscriptions, client) => {
    if (!client) return; // Ignore subscriptions from unknown clients
    console.log('Client subscribed: ', client.id);
});

// Handle MQTT client disconnections
aedesInstance.on('clientDisconnect', client => {
    console.log('Client disconnected:', client.id);
});

// Handle incoming MQTT messages
aedesInstance.on('publish', async (packet, client) => {
    // if (!client) return; // Ignore messages from unknown clients
    console.log('Message from ', client?.id);
    console.log('Payload: ', packet.payload.toString());
    try { // Try to parse the JSON message
        const newMeasurement = JSON.parse(packet.payload.toString()); // Parse the JSON data
        const validation = validateNewMeasurementData(newMeasurement); // Validate the data
        if (!validation.isValid) throw new Error('Invalid data'); // Throw an error if the data is invalid
        await addMeasurement(validation.data); // Add the measurement to the DB
    } catch (error) {
        console.error('Error while adding the measurement', error); // Log the error
    }
});

// Start the MQTT broker
export const startMQTTBroker = () => {
    server.listen(port, () => { // Start the MQTT broker
        console.log(`Broker MQTT listening on port ${port}`);
    });
};