#include "requests.h"
#include "../utils/config.h"
#include "../utils/utils.h"

// Connect to Wi-Fi
bool connectToWifi() {
    const uint32_t MAX_CONNECT_TIME_MS = 20000; // 20 seconds max per attempt

    // Check if Wi-Fi credentials are set
    if (strlen(WIFI_SSID) == 0 || strlen(WIFI_PASSWORD) == 0) {
        if (DEV_MODE) Serial.println("SSID or Password is empty");
        return false;
    }

    // If already connected, return true
    while (true) {
        WiFi.begin(WIFI_SSID, WIFI_PASSWORD); // Start Wi-Fi connection
        if (DEV_MODE) Serial.print("Connecting to Wi-Fi");
        uint32_t startTime = millis();
        while (WiFi.status() != WL_CONNECTED && (millis() - startTime) < MAX_CONNECT_TIME_MS) {
            if (DEV_MODE) Serial.print(".");
            delay(500);
        }

        // Check if connected
        if (WiFi.status() == WL_CONNECTED) {
            if (DEV_MODE) {
                Serial.print(" Connected with IP: ");
                Serial.println(WiFi.localIP());
            }
            return true;
        } else {
            if (DEV_MODE) Serial.println("\nWi-Fi connection attempt failed, retrying...");
            WiFi.disconnect(true);
            delay(1000); // Wait before retry
        }
    }
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
    http.setTimeout(15000); // Increase timeout to 15 seconds
    
    // Add authorization header with the token if present
    if (strlen(AUTH_TOKEN) > 0) {
        char authHeader[256];
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
        // Provide more detailed error information
        if (DEV_MODE) {
            Serial.printf("HTTP Error: %d - ", httpResponseCode);
            switch (httpResponseCode) {
                case -1: Serial.println("CONNECTION REFUSED"); break;
                case -2: Serial.println("SEND HEADER FAILED"); break;
                case -3: Serial.println("SEND PAYLOAD FAILED"); break;
                case -4: Serial.println("NOT CONNECTED"); break;
                case -5: Serial.println("CONNECTION LOST"); break;
                case -6: Serial.println("NO STREAM"); break;
                case -7: Serial.println("NO HTTP SERVER"); break;
                case -8: Serial.println("TOO LESS RAM"); break;
                case -9: Serial.println("ENCODING"); break;
                case -10: Serial.println("STREAM WRITE"); break;
                case -11: Serial.println("READ TIMEOUT"); break;
                default: Serial.println("UNKNOWN ERROR");
            }
        }
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
    if (dataPublished) {
        blinkLed(); // Blink LED on successful data publish
    }
    
    return dataPublished;
}