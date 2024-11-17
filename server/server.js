import { initMySqlDatabase } from './src/db/sql.js';
import { startMqttBroker } from './src/mqtt/mqttBroker.js';
import { startWebServer } from './src/web/webServer.js';

// Initialize the services
const initServices = async () => {
    try {
        await initMySqlDatabase(); // Initialize the MySQL database
        await startMqttBroker(); // Start the MQTT Broker
        await startWebServer(); // Start the web server
    } catch (error) {
        console.error('Error initializing services:', error.message);
    }
};

initServices(); // Initialize the services