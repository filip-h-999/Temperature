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

def measure(file, pin, relay, powerPin):
    if os.path.exists(file):
        with open(file, "r") as f:
            data = json.load(f)
    else:
        data = {"allStats": []}

    current_time = datetime.datetime.now()

    allStats = data["allStats"]
    stats = {}

    hum, temp = Adafruit_DHT.read_retry(sensor, pin)
    # print('Temp={0:0.1f}*C  Humidity={1:0.1f}%'.format(temp, hum))

    stats["Time"] = current_time.strftime("%Y-%m-%d %H:%M:%S")
    stats["Humidity"] = hum
    stats["Temp"] = temp
    allStats.append(stats)

    with open(file, 'w') as f:
        json.dump({"allStats": allStats}, f, indent=4)

    # Turn off the relay after measurement
    time.sleep(1)
    relay.off()
    powerPin.off()

powerPinIn.on()
relay_in.on()  # Turn on the relay before measurement
time.sleep(1)
measure(inside, pinIn, relay_in, powerPinIn)

powerPinOut.on()
relay_out.on()  # Turn on the relay before measurement
time.sleep(1)
measure(outside, pinOut, relay_out, powerPinOut)
