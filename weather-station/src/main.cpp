#include <Arduino.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define DHTPIN 16 // DHT22 pin
#define DHTTYPE DHT22 // Specify DHT type (DHT11, DHT22, DHT21, AM2301)

const char ssid[] = ""; // WiFi SSID
const char password[] = ""; // WiFi password
const char mqttServer[] = "85.235.149.166"; // MQTT broker IP address
const int mqttPort = 1883;
float temperatureAvg = 0; // Average temperature value
float humidityAvg = 0; // Average humidity value
byte measurementsCount = 0; // Number of measurements taken
byte measurementsBeforePublishing = 60; // Number of measurements before publishing
unsigned long lastReadingTime = millis(); // Last publish time
unsigned long readingInterval = 60 * 1000; // Publish interval in milliseconds

DHT dht(DHTPIN, DHTTYPE); // DHT object
WiFiClient espClient; // WiFi client object
PubSubClient client(espClient); // MQTT client object

// Publish the temperature and humidity readings to the MQTT broker
bool publishReadings() {
	JsonDocument doc;
    doc["temperature"] = temperatureAvg; // Set the temperature value in the JSON document
	doc["humidity"] = humidityAvg; // Set the humidity value in the JSON document
    size_t jsonLength = measureJson(doc) + 1; // Size of the JSON document
    char json[jsonLength];
    serializeJson(doc, json, sizeof(json));
	client.publish("station/newReading", json); // Publish the JSON document to the MQTT broker
	Serial.println("Published temperature and humidity readings to MQTT broker");
	return true;
}

// Read and publish the temperature and humidity readings to the MQTT broker
void readAndPublishReadings() {
	Serial.println("Reading temperature and humidity...");
	const float humidity = dht.readHumidity(); // Read the humidity from the DHT sensor
	const float temperature = dht.readTemperature(); // Read the temperature from the DHT sensor
	temperatureAvg = temperatureAvg == 0 ? temperature : (temperatureAvg + temperature) / 2; // Calculate the average temperature
	humidityAvg = humidityAvg == 0 ? humidity : (humidityAvg + humidity) / 2; // Calculate the average humidity
	measurementsCount++; // Increment the number of measurements taken
	if (measurementsCount >= measurementsBeforePublishing) {
		publishReadings(); // Publish the readings
		measurementsCount = 0; // Reset the number of measurements taken
		temperatureAvg = 0; // Reset the temperature average
		humidityAvg = 0; // Reset the humiduty average
	}
}

// Initialize the DHT sensor
bool setupDHT() {
	dht.begin();
	return true;
}

// Connect to Wi-Fi
bool connectToWifi() {
	if (ssid == NULL || password == NULL || strlen(ssid) == 0 || strlen(password) == 0) { // Check if the SSID or password is empty
        Serial.println("SSID or Password is empty");
        return false;
    }

	// Begin connecting to Wi-Fi
	WiFi.begin(ssid, password);
	Serial.print("Connecting to Wi-Fi");
	while (WiFi.status() != WL_CONNECTED) {
		Serial.print(".");
		delay(500);
	}
	Serial.println();
	Serial.print("Connected with IP: ");
	Serial.println(WiFi.localIP());
	return true;
}

// Connecting to MQTT broker
bool connectToMQTT() {
	client.setServer(mqttServer, mqttPort);
	while (!client.connected()) {
		Serial.println("Connecting to MQTT...");
		if (client.connect("esp_station")) {
			Serial.println("Connected");
		} else {
			Serial.print("Failed with state ");
			Serial.println(client.state());
			delay(2000);
		}
	}
	return true;
}

// Check if the WiFi is still connected
void checkWiFiConnection() {
	if (WiFi.status() == WL_CONNECTED) return; // Exit if Wi-Fi is connected
	Serial.println("WiFi disconnected, reconnecting...");
	connectToWifi(); // Reconnect to Wi-Fi
}

// Check if the MQTT is still connected
void checkMQTTConnection() {
	if (client.connected()) return; // Exit if MQTT is connected
	Serial.println("MQTT disconnected, reconnecting...");
	connectToMQTT(); // Reconnect to MQTT
}

// Setup
void setup() {
	Serial.begin(115200); // Start the serial
	setupDHT(); // Initialize the DHT sensor
	connectToWifi(); // Connect to Wi-Fi
	connectToMQTT(); // Connect to MQTT broker
	readAndPublishReadings(); // Publish the temperature and humidity readings to the MQTT broker
	lastReadingTime = millis(); // Update the last reading time
}

// Loop
void loop() {
	if (millis() - lastReadingTime < readingInterval) return; // Exit if the interval is not reached
	lastReadingTime = millis(); // Update the last reading time
	checkWiFiConnection(); // Check if the Wi-Fi is still connected
	checkMQTTConnection(); // Check if the MQTT is still connected
	readAndPublishReadings(); // Read and publish the data to the MQTT broker
}