#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME680.h>
#include <PMS.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <esp_sleep.h>
#include <utils.h>

// PIN
#define PMS_RX_PIN 16 // PMS7003 RX pin
#define PMS_TX_PIN 17 // PMS7003 TX pin

// Global variables
const char ssid[] = "EOLO-Bettola"; // WiFi SSID
const char password[] = "jfJ8c24LM"; // WiFi password
const char serverUrl[] = "http://192.168.21.10:3000/api/measurements"; // Server URL
RTC_DATA_ATTR bool setupDone = false; // First boot flag
float temperature = 0;
float humidity = 0;
float pressure = 0;
float gas = 0;
float pm1 = 0;
float pm25 = 0;
float pm10 = 0;
const unsigned long readingInterval = 60; // Reading interval in seconds
const bool devMode = true; // Enable development mode

// Objects
Adafruit_BME680 bme; // BME680 sensor
HardwareSerial pmsSerial(1); // Create a serial object for PMS7003
PMS pms(pmsSerial); // PMS object
PMS::DATA data; // Sensor data

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

// Check if the WiFi is still connected
bool checkWiFiConnection() {
    if (WiFi.status() == WL_CONNECTED) return true; // Exit if Wi-Fi is connected
    if (devMode) Serial.println("WiFi disconnected, reconnecting...");
    bool result = connectToWifi(); // Reconnect to Wi-Fi
    return result;
}

// Create the JSON for the readings
bool createJsonMeasurements(char* jsonBuffer, size_t bufferSize) {
    JsonDocument doc; // Create the JSON document
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["pressure"] = pressure;
    doc["gas"] = gas;
    doc["pm1"] = pm1;
    doc["pm25"] = pm25;
    doc["pm10"] = pm10;
    size_t length = serializeJson(doc, jsonBuffer, bufferSize);
    const bool result = length > 0 && length < bufferSize; // Check if the JSON is valid
    if (!result) { if (devMode) Serial.println("Error while creating the JSON"); }
    return result;
}

// Try to publish the readings to the server
bool sendHttpPostRequest(const char* json) {
    HTTPClient http;
    http.begin(serverUrl); // Specify the URL
    http.addHeader("Content-Type", "application/json"); // Specify content-type header

    // Send the request
    int httpResponseCode = http.POST(json);
    if (httpResponseCode > 0) {
        if (devMode) Serial.printf("HTTP Response code: %d\n", httpResponseCode);
        http.end(); // Free resources
        return true;
    } else {
        if (devMode) Serial.printf("Error code: %d\n", httpResponseCode);
        http.end(); // Free resources
        return false;
    }
}

// Publish the temperature and humidity readings to the server
bool publishReadings() {
    char json[512]; // Buffer for the JSON
    const bool jsonParsed = createJsonMeasurements(json, sizeof(json)); // Create the JSON
    if (!jsonParsed) return false; // If the JSON was not created successfully
    const bool dataPublished = sendHttpPostRequest(json); // Try to publish the readings
    return dataPublished;
}

// Read from the PMS sensor
bool readPms() {
    if (devMode) Serial.println("PMS sensor waking up...");
    pms.wakeUp(); // Wake up the sensor
    delay(secondsToMilliseconds(30)); // Wait for the sensor to wake up
    if (devMode) Serial.println("PMS sensor awake");

    // Read the data
    pms.requestRead(); // Request a reading
    const uint16_t timeout = secondsToMilliseconds(10);
    bool readStatus = pms.readUntil(data, timeout);
    if (!readStatus) {
        if (devMode) Serial.println("PMS sensor reading failed");
        pms.sleep(); // Put the sensor to sleep
        return false; // Reading was not successful
    }
    
    // Save the data
    pm1 = data.PM_AE_UG_1_0;
    pm25 = data.PM_AE_UG_2_5;
    pm10 = data.PM_AE_UG_10_0;
    pms.sleep(); // Put the sensor to sleep
    if (devMode) { // Print the readings
        char tempString[100] = "";
        sprintf(tempString, "PM1: %u, PM2.5: %u, PM10: %u", pm1, pm25, pm10);
        Serial.println(tempString);
    }
    return true; // Reading was successful
}

// Read from the BME sensor
bool readBme() {
    if (!bme.performReading()) { // Try to read from the BME sensor
        Serial.println("Failed to read from the BME sensor");
        return false;
    }

    // Save the data
    temperature = bme.temperature; // Temperature in °C
    humidity = bme.humidity; // Humidity in %
    pressure = bme.pressure / 100; // Pressure in hPa
    gas = bme.gas_resistance / 1000; // Gas in kOhms
    if (devMode) { // Print the readings
        char tempString[100] = "";
        sprintf(tempString, "Temperature: %.2f *C, Pressure: %.2f hPa, Humidity: %.2f %%, Gas: %.2f Ohms", temperature, pressure, humidity, gas);
        Serial.println(tempString);
    }
    return true;
}

// Read and publish the temperature and humidity readings to the server
void readAndPublishReadings() {
    readPms(); // Read the PMS data
    readBme(); // Read the BME data
    checkWiFiConnection(); // Check if the Wi-Fi is still connected
    publishReadings(); // Publish the readings
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
    }
}

// Loop
void loop() {
    readAndPublishReadings(); // Read and publish the data to the server
    // enterDeepSleep(); // Enter deep sleep
    delay(10000);
}