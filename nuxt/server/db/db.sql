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

-- Table for the users to manage the measurements
CREATE TABLE weatherStation_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Table for the MQTT users
CREATE TABLE weatherStation_mqttUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);