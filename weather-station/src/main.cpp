#include <Arduino.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define DHTPIN 16 // DHT22 pin
#define DHTTYPE DHT22 // Specify DHT type (DHT11, DHT22, DHT21, AM2301)

const char ssid[] = "";
const char password[] = "";
const char mqttServer[] = "";
const int mqttPort = 1883;
unsigned long lastPublishTime = millis(); // Last publish time
unsigned long publishInterval = 30 * 1000; // Publish interval in milliseconds

DHT dht(DHTPIN, DHTTYPE); // DHT object
WiFiClient espClient; // WiFi client object
PubSubClient client(espClient); // MQTT client object

// Read and publish the temperature and humidity readings to the MQTT broker
bool readAndPublishReadings() {
	const float humidity = dht.readHumidity(); // Read the humidity from the DHT sensor
	const float temperature = dht.readTemperature(); // Read the temperature from the DHT sensor

	// Create a JSON document with the readings
	JsonDocument doc;
    doc["temperature"] = temperature;
	doc["humidity"] = humidity;
    size_t jsonLength = measureJson(doc) + 1; // Size of the JSON document
    char json[jsonLength];
    serializeJson(doc, json, sizeof(json));
	client.publish("station/newReading", json);
	return true;
}

// Initialize the DHT sensor
bool setupDHT() {
	dht.begin();
	return true;
}

// Connect to Wi-Fi
bool connectToWifi() {
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
	lastPublishTime = millis(); // Update the last publish time
}

// Loop
void loop() {
	if (millis() - lastPublishTime < publishInterval) return; // Exit if the publish frequency is not met
	lastPublishTime = millis(); // Update the last publish time
	checkWiFiConnection(); // Check if the Wi-Fi is still connected
	checkMQTTConnection(); // Check if the MQTT is still connected
	readAndPublishReadings(); // Publish the temperature and humidity readings to the MQTT broker
}