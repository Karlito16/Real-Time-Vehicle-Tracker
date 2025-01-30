import random
import time
import paho.mqtt.client as mqtt
import sys

# MQTT BROKER
BROKER = "localhost"
PORT = 1883
TOPIC = "v1/devices/me/telemetry"
DEVICE_TOKEN = sys.argv[1]

lat, lon = 45.813, 15.977

client = mqtt.Client()
client.username_pw_set(DEVICE_TOKEN)
client.connect(BROKER, PORT, 60)


def generate_random_coords():
    global lat, lon
    lat_offset = random.uniform(0.00001, 0.0001) * random.choice([-1, 1])
    lon_offset = random.uniform(0.00001, 0.0001) * random.choice([-1, 1])
    lat += lat_offset
    lon += lon_offset
    return lat, lon


def send_data():
    global lat, lon

    while True:
        lat, lon = generate_random_coords()
        payload = {"latitude": lat, "longitude": lon}
        client.publish(TOPIC, str(payload))
        print(f"Sent data: {payload}")
        time.sleep(5)


if __name__ == "__main__":
    client.loop_start()
    send_data()
