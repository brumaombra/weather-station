#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME680.h>
#include <PMS.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <esp_sleep.h>
#include <utils.h>
#include <AsyncMqttClient.h>

// PIN
#define PMS_TX_PIN 17 // PMS7003 TX pin
#define PMS_RX_PIN 16 // PMS7003 RX pin

// Global variables
const char ssid[] = ""; // WiFi SSID
const char password[] = ""; // WiFi password
const char mqttUsername[] = ""; // MQTT user
const char mqttPassword[] = ""; // MQTT password
const char mqttClientId[] = "weather_station"; // MQTT client ID
const char mqttServer[] = "85.235.149.166"; // MQTT broker IP address
const int mqttPort = 1883; // MQTT broker port
RTC_DATA_ATTR bool setupDone = false; // First boot flag
RTC_DATA_ATTR float temperatureAvg = 0; // Average temperature value
RTC_DATA_ATTR float humidityAvg = 0; // Average humidity value
RTC_DATA_ATTR float pressureAvg = 0; // Average pressure value
RTC_DATA_ATTR float gasAvg = 0; // Average gas value
RTC_DATA_ATTR float pm1Avg = 0; // Average PM1 value
RTC_DATA_ATTR float pm25Avg = 0; // Average PM2.5 value
RTC_DATA_ATTR float pm10Avg = 0; // Average PM10 value
RTC_DATA_ATTR byte measurementsCount = 0; // Number of measurements taken
const byte measurementsBeforePublishing = 6; // Number of measurements before publishing
const unsigned long readingInterval = 600; // Reading interval in seconds
const bool devMode = false; // Enable development mode
bool mqttConnected = false; // MQTT connection status
bool confirmationReceived = false; // Confirmation received 
uint16_t lastPacketId = 0; // Last MQTT packet ID

// Objects
Adafruit_BME680 bme; // BME680 sensor
HardwareSerial pmsSerial(1); // Create a serial object for PMS7003
PMS pms(pmsSerial); // PMS object
PMS::DATA data; // Sensor data
AsyncMqttClient mqttClient; // MQTT client object

// Connect to Wi-Fi
bool connectToWifi() {
	if (ssid == NULL || password == NULL || strlen(ssid) == 0 || strlen(password) == 0) { // Check if the SSID or password is empty
        if (devMode) Serial.println("SSID or Password is empty");
        while (1) delay(1000); // Block the program
    }

	// Begin connecting to Wi-Fi
	WiFi.begin(ssid, password); // Start the connection to Wi-Fi
	if (devMode) Serial.print("Connecting to Wi-Fi");
	while (WiFi.status() != WL_CONNECTED) { // Wait for Wi-Fi connection
		if (devMode) Serial.print(".");
		delay(500);
	}
	if (devMode) Serial.print(" Connected with IP: ");
	if (devMode) Serial.println(WiFi.localIP());
	return true;
}

// Handle the MQTT connection event
void onMqttConnect(bool sessionPresent) {
  	if (devMode) Serial.println("Connected to the MQTT broker");
  	mqttConnected = true; // Set MQTT connected flag
}

// Handle the MQTT disconnection event
void onMqttDisconnect(AsyncMqttClientDisconnectReason reason) {
	if (devMode) Serial.println("Disconnected from the MQTT broker");
	mqttConnected = false; // Set MQTT connected flag
}

// Handle the MQTT message event
void onMqttMessage(char* topic, char* payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total) {
    if (devMode) Serial.println("New message received");
}

// Handle the MQTT publish event
void onMqttPublish(uint16_t packetId) {
	if (packetId == lastPacketId) { // Check if the packet ID matches the last packet ID
        if (devMode) Serial.println("Acknowledgment received from the MQTT broker!");
        confirmationReceived = true; // Set confirmation received flag
    }
}

// Connecting to MQTT broker
bool connectToMQTT() {
	if (WiFi.status() != WL_CONNECTED) return false; // Check if the WiFi is connected
	if (devMode) Serial.println("Connecting to MQTT...");
	mqttClient.onConnect(onMqttConnect); // Set the MQTT connection event handler
    mqttClient.onDisconnect(onMqttDisconnect); // Set the MQTT disconnection event handler
	mqttClient.onMessage(onMqttMessage); // Set the MQTT message event handler
	mqttClient.onPublish(onMqttPublish); // Set the MQTT publish event handler
	mqttClient.setClientId(mqttClientId); // Set the client ID
	mqttClient.setCredentials(mqttUsername, mqttPassword); // Setting MQTT credentials
	mqttClient.setServer(mqttServer, mqttPort); // Set the MQTT broker server and port
	mqttClient.connect(); // Connect to the MQTT broker
	unsigned long timeout = secondsToMilliseconds(10); // Timeout in milliseconds
	unsigned long timestamp = millis();
	while (!mqttConnected && (millis() - timestamp < timeout)) { delay(10); } // Wait for the connection to be established
    if (!mqttConnected) { // If the connection was not successful
        if (devMode) Serial.println("Failed to connect to the MQTT broker");
        return false;
    } else {
		return true;
    }
}

// Check if the WiFi is still connected
bool checkWiFiConnection() {
	if (WiFi.status() == WL_CONNECTED) return true; // Exit if Wi-Fi is connected
	if (devMode) Serial.println("WiFi disconnected, reconnecting...");
	bool result = connectToWifi(); // Reconnect to Wi-Fi
	return result;
}

// Check if the MQTT is still connected
bool checkMQTTConnection() {
	if (mqttConnected) return true; // Exit if MQTT is connected
	if (devMode) Serial.println("MQTT disconnected, reconnecting...");
	bool result = connectToMQTT(); // Reconnect to MQTT
	return result;
}

// Print the readings
void printMeasurement(const float humidity, const float temperature) {
	char tempString[100] = "";
	sprintf(tempString, "Reading... Temperature: %.2f *C, Humidity: %.2f %%", temperature, humidity);
	if (devMode) Serial.println(tempString);
}

// Create the JSON for the readings
bool createJsonMeasurements(char* jsonBuffer, size_t bufferSize) {
	JsonDocument doc; // Create the JSON
    doc["temperature"] = temperatureAvg; // Add the temperature value
	doc["humidity"] = humidityAvg; // Add the humidity value
	doc["pressure"] = pressureAvg; // Add the pressure value
	doc["gas"] = gasAvg; // Add the gas value
	doc["pm1"] = pm1Avg; // Add the PM 1 value
	doc["pm25"] = pm25Avg; // Add the PM 2.5 value
	doc["pm10"] = pm10Avg; // Add the PM 10 value
	size_t length = serializeJson(doc, jsonBuffer, bufferSize);
	const bool result = length > 0 && length < bufferSize; // Check if the JSON is valid
	if (!result) { if (devMode) Serial.println("Error while creating the JSON"); }
	return result;
}

// Try to publish the readings to the MQTT broker
bool tryToPublishReadings(const char* json) {
    byte maxAttempts = 5; // Max sending attempts
    unsigned long timeout = secondsToMilliseconds(10); // Send timeout
    unsigned long timestamp = 0;
	confirmationReceived = false; // Reset the confirmation received flag
    while (maxAttempts > 0) { // Try to publish the readings
		if (!checkWiFiConnection() || !checkMQTTConnection()) return false;
        lastPacketId = mqttClient.publish("station/newReading", 1, false, json); // Publish the readings
        if (lastPacketId != 0) { // Send OK
            timestamp = millis(); // Reset the timestamp
            while (!confirmationReceived && (millis() - timestamp < timeout)) { delay(10); } // Wait for the confirmation
            if (confirmationReceived) { // Send OK
                confirmationReceived = false; // Reset the confirmation received flag
                if (devMode) Serial.println("Published temperature and humidity readings to MQTT broker!");
                return true; // Success
            } else {
				if (devMode) Serial.println("Failed to publish the data: No confirmation received within timeout. Retry...");
			}
        } else { // Send KO
            if (devMode) Serial.println("Failed to publish the data: Publishing failed immediately. Retry...");
        }
        maxAttempts--;
    }

	// Error
    if (devMode) Serial.println("Failed to publish the data: No attempts left");
    return false;
}

// Publish the temperature and humidity readings to the MQTT broker
bool publishReadings() {
	char json[512]; // Buffer for the JSON
	const bool jsonParsed = createJsonMeasurements(json, sizeof(json)); // Create the JSON
	if (!jsonParsed) return false; // If the JSON was not created successfully
	const bool dataPublished = tryToPublishReadings(json); // Try to publish the readings
	return dataPublished;
}

// Read from the BME sensor
bool readBme() {
	if (!bme.performReading()) { // Try to read from the BME sensor
		Serial.println("Failed to read from the BME sensor");
		return false;
	}

	// Save the data
	temperatureAvg += bme.temperature;
	humidityAvg += bme.humidity;
	pressureAvg += bme.pressure;
	gasAvg += bme.gas_resistance;
	if (devMode) { // Print the readings
		char tempString[100] = "";
		sprintf(tempString, "Temperature: %.2f *C, Pressure: %lu hPa, Humidity: %.2f %%, Gas: %lu Ohms", bme.temperature, bme.pressure, bme.humidity, bme.gas_resistance);
		Serial.println(tempString);
	}
	return true;
}

// Read from the PMS sensor
bool readPms() {
	pms.wakeUp(); // Wake up the sensor
    delay(secondsToMilliseconds(30)); // Wait for the sensor to wake up
    pms.requestRead(); // Request a reading
	const unsigned long timeout = secondsToMilliseconds(10);
	const unsigned long startTime = millis();
	while (millis() - startTime < timeout) { // Wait for the reading to complete
		if (pms.readUntil(data)) { // Try to read
			pm1Avg += data.PM_AE_UG_1_0; // Sum the new PM1 reading
			pm25Avg += data.PM_AE_UG_2_5; // Sum the new PM2.5 reading
			pm10Avg += data.PM_AE_UG_10_0; // Sum the new PM10 reading
			pms.sleep(); // Put the sensor to sleep
			if (devMode) { // Print the readings
				char tempString[100] = "";
				sprintf(tempString, "PM1: %u, PM2.5: %u, PM10: %u", data.PM_AE_UG_1_0, data.PM_AE_UG_2_5, data.PM_AE_UG_10_0);
				Serial.println(tempString);
			}
			return true; // Reading was successful
		}
	}
	return false; // Reading was not successful
}

// Read and publish the temperature and humidity readings to the MQTT broker
void readAndPublishReadings() {
	readPms(); // Read the PMS data
	readBme(); // Read the BME data
	measurementsCount++; // Increment the number of measurements taken
	if (measurementsCount >= measurementsBeforePublishing) {
		temperatureAvg /= measurementsCount; // Calculate the average temperature
		humidityAvg /= measurementsCount; // Calculate the average humidity
		pressureAvg /= measurementsCount; // Calculate the average pressure
		gasAvg /= measurementsCount; // Calculate the average gas
		pm1Avg /= measurementsCount; // Calculate the average PM1
		pm25Avg /= measurementsCount; // Calculate the average PM2.5
		pm10Avg /= measurementsCount; // Calculate the average PM10
		checkWiFiConnection(); // Check if the Wi-Fi is still connected
		checkMQTTConnection(); // Check if the MQTT is still connected
		publishReadings(); // Publish the readings
		temperatureAvg = 0; // Reset the temperature average
		humidityAvg = 0; // Reset the humiduty average
		pressureAvg = 0; // Reset the pressure average
		gasAvg = 0; // Reset the gas average
		pm1Avg = 0; // Reset the PM1 average
		pm25Avg = 0; // Reset the PM2.5 average
		pm10Avg = 0; // Reset the PM10 average
		measurementsCount = 0; // Reset the number of measurements taken
	}
}

// Enter deep sleep
void enterDeepSleep() {
	esp_sleep_enable_timer_wakeup(secondsToMicroseconds(readingInterval)); // Set sleep time in microseconds
  	if (devMode) Serial.println("Entering deep sleep..."); // Print a message
  	if (devMode) Serial.flush(); // Wait for the serial buffer to be empty
  	esp_deep_sleep_start(); // Enter deep sleep
}

// Initialize the serial
bool initSerial() {
	Serial.begin(115200); // Start the serial
	while (!Serial) {;} // Wait for the serial to be ready
	return true;
}

// Initialize the BME sensor
bool setupBme() {
	if (!bme.begin()) { // Check if the sensor is connected
		if (devMode) Serial.println("Could not find a valid BME680 sensor");
		return false;
	}
	
	// Setup the sensor
	bme.setTemperatureOversampling(BME680_OS_8X);
	bme.setHumidityOversampling(BME680_OS_2X);
	bme.setPressureOversampling(BME680_OS_4X);
	bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
	bme.setGasHeater(320, 150); // 320°C per 150ms
	return true;
}

// Initialize the PMS sensor
bool setupPms() {
	pmsSerial.begin(9600, SERIAL_8N1, PMS_RX_PIN, PMS_TX_PIN); // Initialize the serial
    pms.passiveMode(); // Set the sensor to passive mode
	return true;
}

// Setup
void setup() {
	Wire.begin();
	if (devMode) initSerial(); // Initialize the serial
	setupBme(); // Initialize the BME sensor
	setupPms(); // Initialize the PMS sensor
	if (!setupDone) { // Do only of first boot
		setupDone = true; // Set the first boot flag
		connectToWifi(); // Test the Wi-Fi connection
		connectToMQTT(); // Test the MQTT connection
	}
}

// Loop
void loop() {
	readAndPublishReadings(); // Read and publish the data to the MQTT broker
	enterDeepSleep(); // Enter deep sleep
}