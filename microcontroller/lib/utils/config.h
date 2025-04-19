#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

// Development mode flag
#define DEV_MODE true

// WiFi settings
#define WIFI_SSID "EOLO-Bettola"
#define WIFI_PASSWORD "jfJ8c24LM"

// Server settings
#define SERVER_ENDPOINT "http://192.168.21.10:3000/api/measurements"
#define AUTH_TOKEN "0123456789"

// Device settings
#define READING_INTERVAL 60 * 15 // Reading interval in seconds

// Sensor pin definitions
#define PMS_RX_PIN 16 // PMS7003 RX pin
#define PMS_TX_PIN 17 // PMS7003 TX pin

// Declare as extern to avoid multiple definition errors
extern RTC_DATA_ATTR bool setupDone;

#endif // CONFIG_H