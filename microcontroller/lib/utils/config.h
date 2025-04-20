#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

// Development mode flag
#define DEV_MODE true

// WiFi settings
#define WIFI_SSID ""
#define WIFI_PASSWORD ""

// Server settings
#define SERVER_ENDPOINT ""
#define AUTH_TOKEN ""

// Device settings
#define READING_INTERVAL 60 * 15 // Reading interval in seconds

// Sensor pin definitions
#define PMS_RX_PIN 16 // PMS7003 RX pin
#define PMS_TX_PIN 17 // PMS7003 TX pin

// LED pin definition
#define LED_PIN 2 // ESP32 onboard LED

// Declare as extern to avoid multiple definition errors
extern RTC_DATA_ATTR bool setupDone;

#endif // CONFIG_H