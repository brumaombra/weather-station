import { startMQTTBroker } from './src/mqtt/mqttBroker.js';
import { initWebServer } from './src/web/webServer.js';
import { initMySqlDatabase } from './src/db/sql.js';

// Initialize the services
const initServices = () => {
    startMQTTBroker(); // Start the MQTT Broker
    initWebServer(); // Start the web server
    initMySqlDatabase(); // Initialize the MySQL database
};

initServices(); // Initialize the services