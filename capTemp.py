import json
import datetime
import os
from pigpio_dht import DHT11
import time


sensorIn = DHT11(11)
sensorOut = DHT11(4)

inside = "wetterDataInsideT.json"
outside = "wetterDataOutsideT.json"


def measure(file, sensor):
    if os.path.exists(file):
        with open(file, "r") as f:
            data = json.load(f)
    else:
        data = {"allStats": []}

    allStats = data["allStats"]
    stats = {}

    # Attempt measurements for 5 minutes
    end_time = time.time() + 5 * 60  # 5 minutes in seconds
    while time.time() < end_time:
        sensor_data = sensor.sample(samples=5)
        stats = {
            "Time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "Humidity": float(sensor_data['humidity']),
            "Temp": float(sensor_data['temp_c']),
        }
        print(f"Temperature: {stats['Temp']}°C, Humidity: {stats['Humidity']}%")
        if not sensor_data['valid']:
            time.sleep(1)  # Wait before the next measurement attempt
            print(f"Measurement failed for {file}, keep retrying")
            continue
            
        allStats.append(stats)

        with open(file, 'w') as f:
            json.dump({"allStats": allStats}, f, indent=4)
        
        print(f"Measurement successful for {file}")
        return
        
    print(f"Measurement failed for {file} after 5 minutes")

# Inside measurement
try:
    measure(inside, sensorIn)
except Exception as e:
    print(f"Error Inside: {e}")

# Outside measurement
try:
    measure(outside, sensorOut)
except Exception as e:
    print(f"Error Outside: {e}")
