#include <Arduino.h>
#include <esp_sleep.h>
#include <utils.h>
#include <sensors.h>
#include <requests.h>
#include "../lib/utils/config.h"

// Define setupDone variable that's declared as extern in config.h
RTC_DATA_ATTR bool setupDone = false;

// Sensor data
float temperature = 0;
float humidity = 0;
float pressure = 0;
float gas = 0;
float pm1 = 0;
float pm25 = 0;
float pm10 = 0;

// Initialize the serial
bool initSerial() {
    Serial.begin(115200); // Start the serial
    while (!Serial) {;} // Wait for the serial to be ready
    return true;
}

// Enter deep sleep
void enterDeepSleep() {
    esp_sleep_enable_timer_wakeup(secondsToMicroseconds(READING_INTERVAL)); // Set sleep time in microseconds
    if (DEV_MODE) Serial.println("Entering deep sleep..."); // Print a message
    if (DEV_MODE) Serial.flush(); // Wait for the serial buffer to be empty
    esp_deep_sleep_start(); // Enter deep sleep
}

// Read and publish the sensor readings to the server
void readAndPublishReadings() {
    // Read sensor data
    readPms(pm1, pm25, pm10);
    readBme(temperature, humidity, pressure, gas);
    
    // Send data to server
    checkWiFiConnection();
    publishReadings(temperature, humidity, pressure, gas, pm1, pm25, pm10);
}

// Setup
void setup() {
    if (DEV_MODE) initSerial(); // Initialize the serial
    
    // Initialize sensors
    initSensors();
    
    // Do only on first boot
    if (!setupDone) {
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