-- Table for the measurements
CREATE TABLE weatherStation_measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    pressure FLOAT NOT NULL,
    gas FLOAT NOT NULL,
    pm1 FLOAT NOT NULL,
    pm25 FLOAT NOT NULL,
    pm10 FLOAT NOT NULL,
    temperatureAnomaly BOOLEAN DEFAULT FALSE,
    humidityAnomaly BOOLEAN DEFAULT FALSE,
    pressureAnomaly BOOLEAN DEFAULT FALSE,
    gasAnomaly BOOLEAN DEFAULT FALSE,
    pm1Anomaly BOOLEAN DEFAULT FALSE,
    pm25Anomaly BOOLEAN DEFAULT FALSE,
    pm10Anomaly BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);