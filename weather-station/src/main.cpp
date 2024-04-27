#include <Arduino.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <esp_sleep.h>
#include <utils.h>
#include <AsyncMqttClient.h>

#define DHTPIN 16 // DHT22 pin
#define DHTTYPE DHT22 // Specify DHT type (DHT11, DHT22, DHT21, AM2301)

const char ssid[] = ""; // WiFi SSID
const char password[] = ""; // WiFi password
const char mqttServer[] = "85.235.149.166"; // MQTT broker IP address
const int mqttPort = 1883; // MQTT broker port
RTC_DATA_ATTR bool setupDone = false; // First boot flag
RTC_DATA_ATTR float temperatureAvg = 0; // Average temperature value
RTC_DATA_ATTR float humidityAvg = 0; // Average humidity value
RTC_DATA_ATTR byte measurementsCount = 0; // Number of measurements taken
byte measurementsBeforePublishing = 60; // Number of measurements before publishing
unsigned long readingInterval = 60; // Reading interval in seconds
const bool devMode = false; // Enable development mode
bool mqttConnected = false; // MQTT connection status
bool confirmationReceived = false; // Confirmation received 
uint16_t lastPacketId = 0; // Last MQTT packet ID

DHT dht(DHTPIN, DHTTYPE); // DHT object
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
	mqttClient.setClientId("weather_station"); // Set the client ID
	mqttClient.setServer(mqttServer, mqttPort); // Set the MQTT broker server and port
	mqttClient.connect(); // Connect to the MQTT broker
	unsigned long timeout = secondsToMilliseconds(10); // Timeout in milliseconds
	unsigned long timestamp = millis();
	while (!mqttConnected && (millis() - timestamp < timeout)) {;} // Wait for the connection to be established
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

// Try to publish the readings to the MQTT broker
bool tryToPublishReadings(const char* json) {
	if (!checkWiFiConnection() || !checkMQTTConnection()) return false; // Check if the Wi-Fi or MQTT is still connected
	confirmationReceived = false; // Reset the confirmation received flag
    lastPacketId = mqttClient.publish("station/newReading", 1, false, json); // Publish the readings
    if (lastPacketId == 0) { // If the readings were not sent successfully
        if (devMode) Serial.println("Publish failed immediately");
        return false;
    }

    // Wait for the confirmation
	unsigned long timeout = secondsToMilliseconds(5); // Timeout in milliseconds
	unsigned long startTime = millis();
    while (!confirmationReceived && (millis() - startTime < timeout)) {;}
    if (!confirmationReceived) { // If the confirmation was not received within the timeout
        if (devMode) Serial.println("No confirmation received within timeout");
        return false;
    }

    // Reset the confirmation received flag
    confirmationReceived = false;
    return true;
}

// Publish the temperature and humidity readings to the MQTT broker
bool publishReadings() {
	JsonDocument doc; // Create the JSON
    doc["temperature"] = temperatureAvg; // Add the temperature value
	doc["humidity"] = humidityAvg; // Add the humidity value
    size_t jsonLength = measureJson(doc) + 1; // Size of the JSON document
    char json[jsonLength];
    serializeJson(doc, json, sizeof(json));
	const bool result = tryToPublishReadings(json); // Try to publish the readings
	if (result) { // If the readings were published successfully
		if (devMode) Serial.println("Published temperature and humidity readings to MQTT broker");
		return true;
	} else { // If the readings were not published successfully
		if (devMode) Serial.println("Failed to publish temperature and humidity readings to MQTT broker");
		return false;
	}
}

// Read and publish the temperature and humidity readings to the MQTT broker
void readAndPublishReadings() {
	const float humidity = dht.readHumidity(); // Read the humidity from the DHT sensor
	const float temperature = dht.readTemperature(); // Read the temperature from the DHT sensor
	if (isnan(humidity) || isnan(temperature)) { // Check if the readings are valid
		if (devMode) Serial.println("Failed to read from DHT sensor!"); // Print the error
		return;
	}

	// Add the data
	if (devMode) printMeasurement(humidity, temperature); // Print the readings
	temperatureAvg += temperature; // Sum the new temperature reading
	humidityAvg += humidity; // Sum the new humidity reading
	measurementsCount++; // Increment the number of measurements taken
	if (measurementsCount >= measurementsBeforePublishing) {
		temperatureAvg /= measurementsCount; // Calculate the average temperature
		humidityAvg /= measurementsCount; // Calculate the average humidity
		checkWiFiConnection(); // Check if the Wi-Fi is still connected
		checkMQTTConnection(); // Check if the MQTT is still connected
		publishReadings(); // Publish the readings
		temperatureAvg = 0; // Reset the temperature average
		humidityAvg = 0; // Reset the humiduty average
		measurementsCount = 0; // Reset the number of measurements taken
	}
}

// Initialize the serial
bool initSerial() {
	Serial.begin(115200); // Start the serial
	while (!Serial) {;} // Wait for the serial to be ready
	return true;
}

// Initialize the DHT sensor
bool setupDHT() {
	dht.begin();
	return true;
}

// Enter deep sleep
void enterDeepSleep() {
	esp_sleep_enable_timer_wakeup(secondsToMicroseconds(readingInterval)); // Set sleep time in microseconds
  	if (devMode) Serial.println("Entering deep sleep..."); // Print a message
  	if (devMode) Serial.flush(); // Wait for the serial buffer to be empty
  	esp_deep_sleep_start(); // Enter deep sleep
}

// Setup
void setup() {
	if (devMode) initSerial(); // Initialize the serial
	setupDHT(); // Initialize the DHT sensor
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