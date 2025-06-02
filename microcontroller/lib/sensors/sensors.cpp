#include "sensors.h"
#include "../utils/config.h"

// Objects
Adafruit_BME680 bme; // BME680 sensor
HardwareSerial pmsSerial(1); // Create a serial object for PMS7003
PMS pms(pmsSerial); // PMS object
PMS::DATA data; // Sensor data

// Initialize the sensors
void initSensors() {
    Wire.begin();
    setupBme();
    setupPms();
}

// Initialize the BME sensor
bool setupBme() {
    if (!bme.begin()) { // Check if the sensor is connected
        if (DEV_MODE) Serial.println("Could not find a valid BME680 sensor");
        return false;
    }
    
    // Setup the sensor
    bme.setTemperatureOversampling(BME680_OS_8X);
    bme.setHumidityOversampling(BME680_OS_2X);
    bme.setPressureOversampling(BME680_OS_4X);
    bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
    bme.setGasHeater(320, 150); // 320°C per 150ms
    return true;
}

// Initialize the PMS sensor
bool setupPms() {
    pmsSerial.begin(9600, SERIAL_8N1, PMS_RX_PIN, PMS_TX_PIN); // Initialize the serial
    pms.passiveMode(); // Set the sensor to passive mode
    return true;
}

// Read from the BME sensor
bool readBme(float &temperature, float &humidity, float &pressure, float &gas) {
    if (!bme.performReading()) { // Try to read from the BME sensor
        if (DEV_MODE) Serial.println("Failed to read from the BME sensor");
        return false;
    }

    // Save the data
    temperature = bme.temperature; // Temperature in °C
    humidity = bme.humidity; // Humidity in %
    pressure = bme.pressure / 100; // Pressure in hPa
    gas = bme.gas_resistance / 1000; // Gas in kOhms
    if (DEV_MODE) { // Print the readings
        char tempString[100] = "";
        sprintf(tempString, "Temperature: %.2f *C, Pressure: %.2f hPa, Humidity: %.2f %%, Gas: %.2f Ohms", temperature, pressure, humidity, gas);
        Serial.println(tempString);
    }
    return true;
}

// Read from the PMS sensor
bool readPms(float &pm1, float &pm25, float &pm10) {
    if (DEV_MODE) Serial.println("PMS sensor waking up...");
    pms.wakeUp(); // Wake up the sensor
    delay(secondsToMilliseconds(PMS_SENSOR_WAKE_UP_TIME)); // Wait for the sensor to wake up
    if (DEV_MODE) Serial.println("PMS sensor awake");

    // Read the data
    pms.requestRead(); // Request a reading
    const uint16_t timeout = secondsToMilliseconds(10);
    bool readStatus = pms.readUntil(data, timeout);
    if (!readStatus) {
        if (DEV_MODE) Serial.println("PMS sensor reading failed");
        pms.sleep(); // Put the sensor to sleep
        return false; // Reading was not successful
    }
    
    // Save the data
    pm1 = data.PM_AE_UG_1_0;
    pm25 = data.PM_AE_UG_2_5;
    pm10 = data.PM_AE_UG_10_0;
    pms.sleep(); // Put the sensor to sleep
    if (DEV_MODE) { // Print the readings
        char tempString[100] = "";
        sprintf(tempString, "PM1: %.2f, PM2.5: %.2f, PM10: %.2f", pm1, pm25, pm10);
        Serial.println(tempString);
    }
    return true; // Reading was successful
}