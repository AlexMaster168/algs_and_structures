export interface TemperatureSensor {
  celsius(): number;
}

export class LegacyFahrenheitSensor {
  constructor(private readonly reading: number) {}

  readFahrenheit(): number {
    return this.reading;
  }
}

export class FahrenheitSensorAdapter implements TemperatureSensor {
  constructor(private readonly legacy: LegacyFahrenheitSensor) {}

  celsius(): number {
    return Math.round(((this.legacy.readFahrenheit() - 32) * 5) / 9 * 10) / 10;
  }
}

export const averageTemperature = (sensors: readonly TemperatureSensor[]): number =>
  sensors.reduce((sum, sensor) => sum + sensor.celsius(), 0) / sensors.length;

export type NodeCallback<T> = (error: Error | null, result?: T) => void;

export const promisify =
  <A extends unknown[], T>(fn: (...args: [...A, NodeCallback<T>]) => void) =>
  (...args: A): Promise<T> =>
    new Promise((resolve, reject) => fn(...args, (error, result) => (error ? reject(error) : resolve(result as T))));
