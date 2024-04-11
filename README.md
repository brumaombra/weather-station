# Weather Station 🌤️

A very simple yet powerful weather station built using the ESP32 microcontroller.

# The Project

This `GitHub` project showcases a weather station powered by an `ESP32 microcontroller`, dedicated to monitoring temperature and humidity levels. The `ESP32` collects environmental data and transmits it to a `Node.js` server using `MQTT protocol`, ensuring real-time data communication and efficient handling of sensor data. The server processes this data and stores it in `Firestore`, Google's flexible, scalable NoSQL cloud database, providing robust data storage and retrieval capabilities.

To make the data easily accessible and user-friendly, a web application is developed using `Vue.js` and `Bootstrap`. `Vue.js`, a progressive JavaScript framework, is utilized for creating an interactive and dynamic user interface, while `Bootstrap` enhances the app's responsiveness and aesthetic appeal, ensuring it works seamlessly across different devices and screen sizes. Users can view the latest temperature and humidity readings in real-time, benefiting from a well-designed, intuitive dashboard that highlights key environmental conditions monitored by the weather station.

This project not only demonstrates the integration of various technologies, from microcontrollers to cloud storage and web development frameworks, but also serves as a practical solution for individuals interested in home automation, environmental monitoring, or IoT projects! ❤️

Here's a short list of some of the technologies utilized in this project:

## Frontend
- `Vue.js` (Framework)
- `Bootstrap` (Style)
- `Chart.js` (Charts)

## Backend
- `Node.js` (Server)
- `Express` (Web server)
- `Firebase` (Database)

## Station
- `ESP32` (Microcontroller)
- `DHT22` (Temperature/humidity sensor)
- `MQTT` (ESP32 to server communication)

## Hosting
- `GitHub` (Repository and CI/CD)
- `Render` (Server hosting)