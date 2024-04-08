import aedes from 'aedes';
import net from 'net';

const port = 1883;
const aedesInstance = aedes();
const server = net.createServer(aedesInstance.handle);

// Handle new MQTT clients
aedesInstance.on('client', client => {
    console.log('Client connesso:', client.id);
});

// Handle incoming MQTT messages
aedesInstance.on('publish', (packet, client) => {
    if (client) {
        console.log('Messaggio pubblicato da', client.id);
        console.log('Topic:', packet.topic);
        console.log('Payload:', packet.payload.toString());
    }
});

// Handle MQTT subscriptions
aedesInstance.on('subscribe', (subscriptions, client) => {
    if (client) {
        console.log('Sottoscrizione da', client.id);
        console.log('Sottoscrizioni:', subscriptions);
    }
});

// Handle MQTT client disconnections
aedesInstance.on('clientDisconnect', client => {
    console.log('Client disconnesso:', client.id);
});

// Start the MQTT broker
export const startMQTTBroker = () => {
    server.listen(port, () => {
        console.log(`Broker MQTT listening on port: ${port}`);
    });
};