#include "requests.h"
#include "../utils/config.h"

// Connect to Wi-Fi
bool connectToWifi() {
    if (strlen(WIFI_SSID) == 0 || strlen(WIFI_PASSWORD) == 0) {
        if (DEV_MODE) Serial.println("SSID or Password is empty");
        while (1) delay(1000); // Block the program
    }

    // Begin connecting to Wi-Fi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    if (DEV_MODE) Serial.print("Connecting to Wi-Fi");
    
    while (WiFi.status() != WL_CONNECTED) {
        if (DEV_MODE) Serial.print(".");
        delay(500);
    }

    if (DEV_MODE) {
        Serial.print(" Connected with IP: ");
        Serial.println(WiFi.localIP());
    }

    return true;
}

// Check if the WiFi is still connected
bool checkWiFiConnection() {
    if (WiFi.status() == WL_CONNECTED) return true;
    if (DEV_MODE) Serial.println("WiFi disconnected, reconnecting...");
    bool result = connectToWifi();
    return result;
}

// Create the JSON for the readings
bool createJsonMeasurements(char* jsonBuffer, size_t bufferSize, float temperature, float humidity, float pressure, float gas, float pm1, float pm25, float pm10) {
    JsonDocument doc;
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["pressure"] = pressure;
    doc["gas"] = gas;
    doc["pm1"] = pm1;
    doc["pm25"] = pm25;
    doc["pm10"] = pm10;
    size_t length = serializeJson(doc, jsonBuffer, bufferSize);
    const bool result = length > 0 && length < bufferSize;
    if (!result && DEV_MODE) Serial.println("Error while creating the JSON");
    return result;
}

// Try to publish the readings to the server
bool sendHttpPostRequest(const char* json) {
    if (strlen(SERVER_ENDPOINT) == 0) {
        if (DEV_MODE) Serial.println("Server endpoint not set");
        return false;
    }

    HTTPClient http;
    http.begin(SERVER_ENDPOINT);
    http.addHeader("Content-Type", "application/json");
    
    // Add authorization header with the token if present
    if (strlen(AUTH_TOKEN) > 0) {
        char authHeader[100];
        sprintf(authHeader, "Bearer %s", AUTH_TOKEN);
        http.addHeader("Authorization", authHeader);
    }

    // Send the request
    int httpResponseCode = http.POST(json);
    if (httpResponseCode > 0) {
        if (DEV_MODE) Serial.printf("HTTP Response code: %d\n", httpResponseCode);
        http.end();
        return true;
    } else {
        if (DEV_MODE) Serial.printf("Error code: %d\n", httpResponseCode);
        http.end();
        return false;
    }
}

// Publish the sensor readings to the server
bool publishReadings(float temperature, float humidity, float pressure, float gas, float pm1, float pm25, float pm10) {
    char json[512];
    const bool jsonParsed = createJsonMeasurements(json, sizeof(json), temperature, humidity, pressure, gas, pm1, pm25, pm10);
    if (!jsonParsed) return false;
    const bool dataPublished = sendHttpPostRequest(json);
    return dataPublished;
}