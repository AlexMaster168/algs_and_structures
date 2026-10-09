export class LegacyFahrenheitSensor {
    reading;
    constructor(reading) {
        this.reading = reading;
    }
    readFahrenheit() {
        return this.reading;
    }
}
export class FahrenheitSensorAdapter {
    legacy;
    constructor(legacy) {
        this.legacy = legacy;
    }
    celsius() {
        return Math.round(((this.legacy.readFahrenheit() - 32) * 5) / 9 * 10) / 10;
    }
}
export const averageTemperature = (sensors) => sensors.reduce((sum, sensor) => sum + sensor.celsius(), 0) / sensors.length;
export const promisify = (fn) => (...args) => new Promise((resolve, reject) => fn(...args, (error, result) => (error ? reject(error) : resolve(result))));
