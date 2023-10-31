# Raspberry Pi Temperature and Humidity Monitoring System

## Overview

This project utilizes a Raspberry Pi along with two DHT11 sensors to monitor temperature and humidity both indoors and outdoors. The data collected from the sensors is then visualized in two graphs for easy interpretation. This README provides a guide on setting up the system, connecting the sensors, and running the Python script for data acquisition and plotting.

## Features

- **Dual Sensor Setup:** Monitor temperature and humidity simultaneously both indoors and outdoors.
- **Real-time Graphs:** Visualize the collected data with two real-time graphs for easy analysis.
- **Python Script:** Utilize a Python script for data acquisition, processing, and plotting.
- **Modular Design:** Easily expand or modify the system by adding more sensors or integrating additional features.

## Hardware Requirements

- Raspberry Pi (any model with GPIO pins)
- 2 x DHT11 Sensors
- Jumper wires

## Software Requirements

- Raspbian or any Raspberry Pi compatible operating system
- Python 3.x

## Setup Instructions

1. **Connect Sensors:**
   - Connect the DHT11 sensors to the GPIO pins of the Raspberry Pi. Ensure correct wiring and proper power supply.

2. **Install Required Libraries:**
   - Install necessary Python libraries by running:
     ```
     pip install Adafruit_DHT matplotlib
     ```
     
<img src="static\img\screenshot.png" alt="Screenshot 1" width="600">
