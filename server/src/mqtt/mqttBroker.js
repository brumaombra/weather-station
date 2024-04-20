import { addMeasurement } from '../db/sql.js';
import aedes from 'aedes';
import net from 'net';

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
aedesInstance.on('publish', (packet, client) => {
    if (!client) return; // Ignore messages from unknown clients
    console.log('Message from ', client.id);
    console.log('Topic: ', packet.topic);
    console.log('Payload: ', packet.payload.toString());
    if (packet.topic !== 'station/newReading') return; // Ignore non-reading messages
    try { // Try to parse the JSON message
        const jsonData = JSON.parse(packet.payload.toString()); // Parse the JSON data
        addMeasurement(jsonData); // Add the measurement to Firebase
    } catch (error) {
        console.error('Error while parsing the JSON message: ', error);
    }
});

// Start the MQTT broker
export const startMQTTBroker = () => {
    server.listen(port, () => { // Start the MQTT broker
        console.log(`Broker MQTT listening on port ${port}`);
    });
};