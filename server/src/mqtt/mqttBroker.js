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
        const validObject = validateData(jsonData); // Validate the data
        if (validObject) addMeasurement(validObject); // Add the measurement to Firebase
    } catch (error) {
        console.error('Error while parsing the JSON message:', error);
    }
});

// Validate the received data
const validateData = data => {
    const temperatureValid = data.temperature && Number.isFinite(data.temperature); // Check if the temperature is a number
    const humidityValid = data.humidity && Number.isFinite(data.humidity); // Check if the humidity is a number
    if (!temperatureValid || !humidityValid) return false; // Invalid data
    return { temperature: data.temperature, humidity: data.humidity }; // Return a cleaned object
};

// Start the MQTT broker
export const startMQTTBroker = () => {
    server.listen(port, () => { // Start the MQTT broker
        console.log(`Broker MQTT listening on port ${port}`);
    });
};