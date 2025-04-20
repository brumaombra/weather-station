#include "utils.h"
#include "../utils/config.h"
#include <Arduino.h>

// Seconds to microseconds
int secondsToMicroseconds(const int seconds) {
	return seconds * 1000000;
}

// Seconds to milliseconds
int secondsToMilliseconds(const int seconds) {
	return seconds * 1000;
}

// Blink the onboard LED
void blinkLed(int times, int delayMs) {
    // Setup the LED pin as output
    pinMode(LED_PIN, OUTPUT);
    
    // Blink the specified number of times
    for (int i = 0; i < times; i++) {
        digitalWrite(LED_PIN, HIGH); // Turn on LED
        delay(delayMs); // Wait
        digitalWrite(LED_PIN, LOW); // Turn off LED
        delay(delayMs); // Wait before next blink
    }
}