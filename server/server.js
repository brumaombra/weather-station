import { getMeasurements, addMeasurement } from "./src/db/firebase.js";
import { startMQTTBroker } from "./src/mqtt/mqttBroker.js";

startMQTTBroker(); // Start the MQTT Broker
getMeasurements().then(misure => { // Get the measurements from the database
    console.log(misure);
});