#include <Arduino.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <esp_sleep.h>
#include <utils.h>

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

DHT dht(DHTPIN, DHTTYPE); // DHT object
WiFiClient espClient; // WiFi client object
PubSubClient client(espClient); // MQTT client object

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

// Connecting to MQTT broker
bool connectToMQTT() {
	if (WiFi.status() != WL_CONNECTED) return false; // Check if the WiFi is connected
	client.setServer(mqttServer, mqttPort); // Set the MQTT broker server and port
	if (devMode) Serial.print("Connecting to MQTT...");
	while (!client.connected()) {
		if (client.connect("esp_station")) { // Connect to the MQTT broker
			if (devMode) Serial.println(" Connected!");
		} else { // If the connection failed
			if (devMode) Serial.print(".");
			delay(1000);
		}
	}
	return true;
}

// Check if the WiFi is still connected
bool checkWiFiConnection() {
	if (WiFi.status() == WL_CONNECTED) return true; // Exit if Wi-Fi is connected
	if (devMode) Serial.println("WiFi disconnected, reconnecting...");
	connectToWifi(); // Reconnect to Wi-Fi
	return true;
}

// Check if the MQTT is still connected
void checkMQTTConnection() {
	if (client.connected()) return; // Exit if MQTT is connected
	if (devMode) Serial.println("MQTT disconnected, reconnecting...");
	connectToMQTT(); // Reconnect to MQTT
}

// Print the readings
void printMeasurement(const float humidity, const float temperature) {
	char tempString[100] = "";
	sprintf(tempString, "Reading... Temperature: %.2f *C, Humidity: %.2f %%", temperature, humidity);
	if (devMode) Serial.println(tempString);
}

// Try to publish the readings to the MQTT broker
bool tryToPublishReadings(const char* json) {
	bool result = false; // The state of the sending
	int attempt = 0; // Number of attempts
	while (!result && attempt < 5) { // Try to send the readings
		checkWiFiConnection(); // Check if the Wi-Fi is still connected
		checkMQTTConnection(); // Check if the MQTT is still connected
		delay(2000); // Add delay to avoid flooding the server
        result = client.publish("station/newReading", json); // Publish the readings
		delay(2000); // Add delay to avoid flooding the server
        if (!result) { // If the readings were not sent successfully
            attempt++; // Increment the number of attempts
            if (devMode) Serial.println("Retry sending temperature and humidity readings...");
        }
    }
	return result;
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
		connectToWifi(); // Connect to Wi-Fi
		connectToMQTT(); // Connect to MQTT broker
	}
}

// Loop
void loop() {
	readAndPublishReadings(); // Read and publish the data to the MQTT broker
	enterDeepSleep(); // Enter deep sleep
}