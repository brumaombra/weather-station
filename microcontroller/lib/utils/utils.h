#ifndef UTILS_H
#define UTILS_H

int secondsToMicroseconds(int seconds); // Convert seconds to microseconds
int secondsToMilliseconds(int seconds); // Convert seconds to milliseconds
void blinkLed(int times = 3, int delayMs = 200); // Blink the onboard LED

#endif