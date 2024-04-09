import { addMeasurement } from '../db/firebase.js';
import aedes from 'aedes';
import net from 'net';

// Start the MQTT broker
export const startMQTTBroker = () => {
    const port = 1883;
    const aedesInstance = aedes();
    const server = net.createServer(aedesInstance.handle);

    // Handle new MQTT clients
    aedesInstance.on('client', client => {
        console.log('Client connected:', client.id);
    });

    // Handle incoming MQTT messages
    aedesInstance.on('publish', (packet, client) => {
        if (!client) return; // Ignore messages from unknown clients
        console.log('Message from ', client.id);
        addMeasurement(packet.payload.toString()); // Add the measurement to Firebase
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

    // Start the server
    server.listen(port, () => {
        console.log(`Broker MQTT listening on port ${port}`);
    });
};