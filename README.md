# 🌤️ Weather Station - Portable Weather Monitoring Device

<div align="center">

![ESP32](https://img.shields.io/badge/ESP32-ESP32-blue?style=flat-square&logo=espressif)
![PlatformIO](https://img.shields.io/badge/PlatformIO-6.1.5-FF6B35?style=flat-square&logo=platformio)
![Nuxt.js](https://img.shields.io/badge/Nuxt.js-3.x-00DC82?style=flat-square&logo=nuxt.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## 🎯 What is Weather Station?

Weather Station is a portable environmental monitoring device based on ESP32 designed to track weather conditions such as temperature, humidity, pressure, gas levels, and particulate matter, displaying real-time data via an accessible web interface on smartphones or PCs 🌐📱📊.

### 🌟 Key Points

- 🌡️ **Environmental monitoring**: Measures temperature, humidity, pressure, gas, and particulate matter levels
- 📡 **Wi-Fi connectivity**: Real-time data transmission via HTTP for live dashboard updates
- 🔋 **Portable design**: Battery-powered device with intuitive web interface
- 📊 **Comprehensive data**: Utilizes BME680 and PMS7003 sensors for accurate readings
- 📱 **Multi-platform access**: Compatible with smartphones, tablets, and PCs
- ⚡ **Easy setup**: Simple configuration for non-technical users

---

## 📸 Interface and Photos

Screenshots and demo of the web UI and prototype:

<div align="center">

### 📱 Web Interface Snapshot
<img src="./docs/weather_station_snapshot_section.png" alt="Snapshot section" />

### 📊 Correlations Section
<img src="./docs/weather_station_correlations_section.png" alt="Correlations section" />

### 📦 Weather Station Prototype
<img src="./docs/weather_station_prototype.jpg" alt="Weather station prototype" />

</div>

---

## 🛠️ The Project in Detail

This project showcases the development of a **simple yet powerful weather station 🆕 for monitoring environmental conditions 🌤️**. The device collects data on temperature, humidity, pressure, gas levels, and particulate matter using specialized sensors and transmits it to a **Nuxt.js web application 📡** for real-time visualization.

The prototype is designed and built entirely 🔧, capable of connecting via **Wi-Fi 📡** to external devices like **smartphones 📱** or **PC laptops 💻**. As the station operates, it provides live environmental data ⏱️. The device is **portable 🔋** and **lightweight ⚖️**, powered by an **internal battery pack 🔋**, with no need for external wires 🔌. It features a **very simple 😊** and intuitive interface, suitable even for non-technical personnel 👷‍♂️, and is compatible with any device capable of displaying a web page 🌐.

The device is ideal for tracking **temperature 🌡️**, **humidity 💧**, **atmospheric pressure 📈**, **gas concentrations 🛢️**, and **particulate matter levels 🌫️**. It provides accurate readings for home automation 🏠, environmental monitoring 🌍, or IoT projects 🤖.

During the project development, progress and successes were documented 📝 and are summarized in this repository 🗂️.

---

## 💡 Technologies

### 🏗️ Project Architecture

Weather Station consists of two main parts:

- 📡 The firmware on ESP32 (managing sensors, data collection, and HTTP server)
- 🌐 The web UI (in the Nuxt.js app) that receives data via HTTP and displays real-time charts and metrics

The device collects sensor data and sends it to the connected client for visualization 🔁.

### 💡 Technologies and Libraries

Here's a list of technologies used in this project:

#### Frontend/Backend

- 🌐 Nuxt.js (Framework)
- 🎨 Tailwind CSS (Styling)
- 📊 ApexCharts.js (Charts)
- 🗄️ MySQL (Database)
- 🔧 Knex.js (Query builder)

#### Device/Firmware

- 📡 ESP32 (Microcontroller)
- 🌡️ BME680 (Temperature, humidity, pressure, gas sensor)
- 🌫️ PMS7003 (Particulate matter sensor)

#### Hosting

- 🐙 GitHub (Repository and CI/CD)
- ☁️ Aruba Cloud VPS (Server hosting)

---

## 📋 Installation Instructions

### 🔧 Prerequisites

- 🛠️ PlatformIO (or Arduino-compatible environment)
- 📡 ESP32
- 🗄️ MySQL database
- 🌐 Node.js for Nuxt.js app

### 📦 Installation

To set up the Weather Station, follow these steps:
1. 🔌 Connect the necessary hardware to the ESP32.
2. 📥 Download the source code from the repository.
3. ⚙️ Verify the ESP32 pinout is correct. Modify pin values if needed to match your setup.
4. 🔗 Connect the ESP32 to the PC via USB.
5. 🚀 Use PlatformIO to upload the firmware to the ESP32.
6. 🗄️ Set up the MySQL database using the provided schema.
7. 🌐 Install dependencies for the Nuxt.js app: `npm install`
8. 🚀 Run the Nuxt.js app: `npm run dev`
9. 🎉 Enjoy your Weather Station! ❤️

---

## ✅ Main Functionalities

- ⚙️ Sensor calibration and data collection
- 📊 Real-time data transmission via HTTP
- 📈 Interactive charts and metrics display
- 💾 Data storage in MySQL database
- 🔊 Status indicators via LEDs (if applicable)

---

## 📄 License

This project is distributed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- 🎨 **Tailwind CSS** for styling support
- 📊 **ApexCharts.js** for charting capabilities
- 🤖 **Open-source library authors** used in firmware: ESPAsyncWebServer, sensor libraries, and others