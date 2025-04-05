/*
#ifndef REQUESTS_H
#define REQUESTS_H

#include <Arduino.h>

bool createJsonMeasurements(char* jsonBuffer, size_t bufferSize, float temperature, float humidity, float pressure, float gas, float pm1, float pm25, float pm10);
bool sendHttpPostRequest(const char* json);
bool publishReadings(float temperature, float humidity, float pressure, float gas, float pm1, float pm25, float pm10);

#endif
*/