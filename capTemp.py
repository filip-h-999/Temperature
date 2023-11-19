import Adafruit_DHT
import json
import datetime
import os
from gpiozero import OutputDevice
import time

sensor = Adafruit_DHT.DHT11
pinIn = 11
pinOut = 4
inside = "wetterDataInside.json"
outside = "wetterDataOutside.json"

# Define the OutputDevice for the GPIO pin
relay_in = OutputDevice(pinIn, active_high=False, initial_value=False)
relay_out = OutputDevice(pinOut, active_high=False, initial_value=False)

powerPinIn = OutputDevice(10)
powerPinOut = OutputDevice(2)

def measure(file, pin):
    if os.path.exists(file):
        with open(file, "r") as f:
            data = json.load(f)
    else:
        data = {"allStats": []}

    current_time = datetime.datetime.now()

    allStats = data["allStats"]
    stats = {}

    # Attempt measurements for 5 minutes
    end_time = time.time() + 5 * 60  # 5 minutes in seconds
    while time.time() < end_time:
        hum, temp = Adafruit_DHT.read(sensor, pin)
        if hum is not None and temp is not None:
            stats["Time"] = current_time.strftime("%Y-%m-%d %H:%M:%S")
            stats["Humidity"] = hum
            stats["Temp"] = temp
            allStats.append(stats)

            with open(file, 'w') as f:
                json.dump({"allStats": allStats}, f, indent=4)
            
            print(f"Measurement successful for {file}")
            return
        else:
            time.sleep(0.3)  # Wait before the next measurement attempt
            print(f"Measurement failed for {file}, keep retrying")

    print(f"Measurement failed for {file} after 5 minutes")

# Inside measurement
powerPinIn.on()
relay_in.on()  # Turn on the relay before measurement
time.sleep(1)
try:
    measure(inside, pinIn, relay_in, powerPinIn)
except Exception as e:
    print(f"Error Inside: {e}")

relay_in.off()
powerPinIn.off()

# Outside measurement
powerPinOut.on()
relay_out.on()  # Turn on the relay before measurement
time.sleep(1)
try:
    measure(outside, pinOut, relay_out, powerPinOut)
except Exception as e:
    print(f"Error Outside: {e}")

powerPinOut.off()
relay_out.off()
