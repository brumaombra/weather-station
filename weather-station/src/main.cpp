#include <Arduino.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>

#define DHTPIN 16 // DHT22 pin
#define DHTTYPE DHT22 // Specify DHT type (DHT11, DHT22, DHT21, AM2301)

float humidity = 0; // Humidity
float temperature = 0; // Temperature
const char ssid[] = "EOLO-Bettola";
const char password[] = "jfJ8c24LM";
const char mqttServer[] = "192.168.21.10";
const int mqttPort = 1883;

DHT dht(DHTPIN, DHTTYPE); // DHT object
WiFiClient espClient; // WiFi client object
PubSubClient client(espClient); // MQTT client object

// Publish the temperature and humidity readings to the MQTT broker
bool publishReadings() {
	char tempString[10];
	sprintf(tempString, "%.1f", temperature);
	client.publish("station/temperature", tempString);
	sprintf(tempString, "%.1f", humidity);
	client.publish("station/humidity", tempString);
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
		if (client.connect("ESP32Client")) {
			Serial.println("Connected");
		} else {
			Serial.print("Failed with state ");
			Serial.println(client.state());
			delay(2000);
		}
	}
	return true;
}

// Setup
void setup() {
	Serial.begin(115200); // Start the serial
	setupDHT(); // Initialize the DHT sensor
	connectToWifi(); // Connect to Wi-Fi
	connectToMQTT(); // Connect to MQTT broker
}

// Loop
void loop() {
	humidity = dht.readHumidity(); // Read the humidity from the DHT sensor
	temperature = dht.readTemperature(); // Read the temperature from the DHT
	publishReadings(); // Publish the temperature and humidity readings to the MQTT broker
	delay(5000); // Wait for 5 seconds
}