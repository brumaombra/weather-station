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
float temperatureAvg = 0; // Average temperature value
float humidityAvg = 0; // Average humidity value
byte measurementsCount = 0; // Number of measurements taken
byte measurementsBeforePublishing = 15; // Number of measurements before publishing
unsigned long readingInterval = 60; // Publish interval in seconds
const bool devMode = true; // Enable development mode (prints debug messages)

DHT dht(DHTPIN, DHTTYPE); // DHT object
WiFiClient espClient; // WiFi client object
PubSubClient client(espClient); // MQTT client object

// Connect to Wi-Fi
bool connectToWifi() {
	if (ssid == NULL || password == NULL || strlen(ssid) == 0 || strlen(password) == 0) { // Check if the SSID or password is empty
        if (devMode) Serial.println("SSID or Password is empty");
        return false;
    }

	// Begin connecting to Wi-Fi
	WiFi.begin(ssid, password);
	if (devMode) Serial.print("Connecting to Wi-Fi");
	while (WiFi.status() != WL_CONNECTED) {
		if (devMode) Serial.print(".");
		delay(500);
	}
	if (devMode) Serial.println();
	if (devMode) Serial.print("Connected with IP: ");
	if (devMode) Serial.println(WiFi.localIP());
	return true;
}

// Connecting to MQTT broker
bool connectToMQTT() {
	client.setServer(mqttServer, mqttPort);
	while (!client.connected()) {
		if (devMode) Serial.println("Connecting to MQTT...");
		if (client.connect("esp_station")) {
			if (devMode) Serial.println("Connected");
		} else {
			if (devMode) Serial.print("Failed with state ");
			if (devMode) Serial.println(client.state());
			delay(2000);
		}
	}
	return true;
}

// Check if the WiFi is still connected
void checkWiFiConnection() {
	if (WiFi.status() == WL_CONNECTED) return; // Exit if Wi-Fi is connected
	if (devMode) Serial.println("WiFi disconnected, reconnecting...");
	connectToWifi(); // Reconnect to Wi-Fi
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
	Serial.println(tempString);
}

// Publish the temperature and humidity readings to the MQTT broker
bool publishReadings() {
	JsonDocument doc;
    doc["temperature"] = temperatureAvg; // Set the temperature value in the JSON document
	doc["humidity"] = humidityAvg; // Set the humidity value in the JSON document
    size_t jsonLength = measureJson(doc) + 1; // Size of the JSON document
    char json[jsonLength];
    serializeJson(doc, json, sizeof(json));
	client.publish("station/newReading", json); // Publish the JSON document to the MQTT broker
	if (devMode) Serial.println("Published temperature and humidity readings to MQTT broker");
	return true;
}

// Read and publish the temperature and humidity readings to the MQTT broker
void readAndPublishReadings() {
	const float humidity = dht.readHumidity(); // Read the humidity from the DHT sensor
	const float temperature = dht.readTemperature(); // Read the temperature from the DHT sensor
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
	connectToWifi(); // Connect to Wi-Fi
	connectToMQTT(); // Connect to MQTT broker
}

// Loop
void loop() {
	readAndPublishReadings(); // Read and publish the data to the MQTT broker
	enterDeepSleep(); // Enter deep sleep
}