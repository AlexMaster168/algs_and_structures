export interface WeatherService {
  temperature(city: string): Promise<number>;
}

export class CachingWeatherProxy implements WeatherService {
  private readonly cache = new Map<string, { value: number; expiresAt: number }>();

  constructor(
    private readonly service: WeatherService,
    private readonly ttlMs = 60_000,
    private readonly now: () => number = Date.now,
  ) {}

  async temperature(city: string): Promise<number> {
    const cached = this.cache.get(city);
    if (cached && cached.expiresAt > this.now()) return cached.value;

    const value = await this.service.temperature(city);
    this.cache.set(city, { value, expiresAt: this.now() + this.ttlMs });
    return value;
  }
}

export class AccessControlProxy implements WeatherService {
  constructor(
    private readonly service: WeatherService,
    private readonly isAllowed: () => boolean,
  ) {}

  temperature(city: string): Promise<number> {
    if (!this.isAllowed()) return Promise.reject(new Error('Access denied'));
    return this.service.temperature(city);
  }
}

export const createValidatedObject = <T extends object>(
  target: T,
  validate: (key: keyof T, value: unknown) => boolean,
): T =>
  new Proxy(target, {
    set(object, key, value, receiver) {
      if (!validate(key as keyof T, value)) throw new TypeError(`Invalid value for "${String(key)}"`);
      return Reflect.set(object, key, value, receiver);
    },
  });
