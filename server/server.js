import { startMqttBroker } from './src/mqtt/mqttBroker.js';
import { initWebServer } from './src/web/webServer.js';
import { initMySqlDatabase } from './src/db/sql.js';

// Initialize the services
const initServices = () => {
    startMqttBroker(false); // Start the MQTT Broker
    initWebServer(); // Start the web server
    initMySqlDatabase(); // Initialize the MySQL database
};

initServices(); // Initialize the services