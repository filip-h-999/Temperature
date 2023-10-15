import Adafruit_DHT
import json
import datetime
import os

sensor = Adafruit_DHT.DHT11
pinIn = 4
pinOut = 11
insode = "wetterDataInside.json"
out = "wetterDataOutside.json"

def messure(file, pin):
    if os.path.exists(file):
        with open(file, "r") as f:
            data = json.load(f)
    else:
        data = {"allStats": []}

    time = datetime.datetime.now()

    allStats = data["allStats"]
    stats = {}

    hum, temp = Adafruit_DHT.read_retry(sensor, pin)
    # print('Temp={0:0.1f}*C  Humidity={1:0.1f}%'.format(temp, hum))

    stats["Time"] = time.strftime("%Y-%m-%d %H:%M:%S")
    stats["Humidity"] = hum
    stats["Temp"] = temp
    allStats.append(stats)

    with open(file, 'w') as f:
        json.dump({"allStats": allStats}, f, indent=4)


def measure_temp_humid_in():
    messure(insode, pinIn)


def measure_temp_humid_out():
    messure(out, pinOut)


measure_temp_humid_in()
measure_temp_humid_out()