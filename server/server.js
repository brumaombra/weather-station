import { startMQTTBroker } from './src/mqtt/mqttBroker.js';
import { initWebServer } from './src/web/webServer.js';

// Initialize the services
const initServices = () => {
    startMQTTBroker(); // Start the MQTT Broker
    initWebServer(); // Start the web server
};

initServices(); // Initialize the services