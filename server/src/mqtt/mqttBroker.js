import { addMeasurement } from '../db/firebase.js';
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
    addMeasurement(packet.payload.toString()); // Add the measurement to Firebase
});

// Start the MQTT broker
export const startMQTTBroker = () => {
    server.listen(port, () => { // Start the MQTT broker
        console.log(`Broker MQTT listening on port ${port}`);
    });
};