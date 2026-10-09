import asyncio
import math


class LegacyFahrenheitSensor:
    def __init__(self, reading):
        self.reading = reading

    def read_fahrenheit(self):
        return self.reading


class FahrenheitSensorAdapter:
    def __init__(self, legacy):
        self.legacy = legacy

    def celsius(self):
        return math.floor((self.legacy.read_fahrenheit() - 32) * 5 / 9 * 10 + 0.5) / 10


def average_temperature(sensors):
    return sum(sensor.celsius() for sensor in sensors) / len(sensors)


def promisify(function):
    async def call(*args):
        loop = asyncio.get_running_loop()
        future = loop.create_future()

        def callback(error, value=None):
            def complete():
                if not future.done():
                    if error is not None:
                        future.set_exception(error)
                    else:
                        future.set_result(value)
            loop.call_soon_threadsafe(complete)

        function(*args, callback)
        return await future
    return call
