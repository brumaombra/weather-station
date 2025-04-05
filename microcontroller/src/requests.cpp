/*
#include <Arduino.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char serverUrl[] = "http://192.168.21.10:3000/api/measurements"; // Server URL

// Create the JSON for the readings
bool createJsonMeasurements(char* jsonBuffer, size_t bufferSize, float temperature, float humidity, float pressure, float gas, float pm1, float pm25, float pm10) {
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
    // if (!result) { if (devMode) Serial.println("Error while creating the JSON"); }
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
        // if (devMode) Serial.printf("HTTP Response code: %d\n", httpResponseCode);
        http.end(); // Free resources
        return true;
    } else {
        // if (devMode) Serial.printf("Error code: %d\n", httpResponseCode);
        http.end(); // Free resources
        return false;
    }
}

// Publish the temperature and humidity readings to the server
bool publishReadings(float temperature, float humidity, float pressure, float gas, float pm1, float pm25, float pm10) {
    char json[512]; // Buffer for the JSON
    const bool jsonParsed = createJsonMeasurements(json, sizeof(json), temperature, humidity, pressure, gas, pm1, pm25, pm10); // Create the JSON
    if (!jsonParsed) {
        return false; // If the JSON was not created successfully
    }

    // Send the readings to the server
    const bool dataPublished = sendHttpPostRequest(json);
    return dataPublished;
}
*/