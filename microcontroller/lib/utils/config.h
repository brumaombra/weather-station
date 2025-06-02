#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

// Development mode flag
#define DEV_MODE false

// WiFi settings
#define WIFI_SSID ""
#define WIFI_PASSWORD ""

// Server settings
#define SERVER_ENDPOINT "https://station.brumaombra.com/api/measurements"
#define AUTH_TOKEN ""

// Device settings
#define READING_INTERVAL 60 * 15 // Reading interval in seconds
#define PMS_SENSOR_WAKE_UP_TIME 30 // PMS sensor wake-up time in seconds
#define DEEP_SLEEP_DURATION (READING_INTERVAL - PMS_SENSOR_WAKE_UP_TIME) // Deep sleep duration in seconds

// Sensor pin definitions
#define PMS_RX_PIN 16 // PMS7003 RX pin
#define PMS_TX_PIN 17 // PMS7003 TX pin

// LED pin definition
#define LED_PIN 2 // ESP32 onboard LED

// Declare as extern to avoid multiple definition errors
extern RTC_DATA_ATTR bool setupDone;

#endif // CONFIG_H