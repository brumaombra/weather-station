#ifndef SENSORS_H
#define SENSORS_H

#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME680.h>
#include <PMS.h>
#include <utils.h>
#include "../utils/config.h"

// Initialize sensor objects and variables
void initSensors();

// BME680 sensor functions
bool setupBme();
bool readBme(float &temperature, float &humidity, float &pressure, float &gas);

// PMS7003 sensor functions
bool setupPms();
bool readPms(float &pm1, float &pm25, float &pm10);

#endif // SENSORS_H