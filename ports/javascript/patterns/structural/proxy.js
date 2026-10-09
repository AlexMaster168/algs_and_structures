export class CachingWeatherProxy {
    service;
    ttlMs;
    now;
    cache = new Map();
    constructor(service, ttlMs = 60_000, now = Date.now) {
        this.service = service;
        this.ttlMs = ttlMs;
        this.now = now;
    }
    async temperature(city) {
        const cached = this.cache.get(city);
        if (cached && cached.expiresAt > this.now())
            return cached.value;
        const value = await this.service.temperature(city);
        this.cache.set(city, { value, expiresAt: this.now() + this.ttlMs });
        return value;
    }
}
export class AccessControlProxy {
    service;
    isAllowed;
    constructor(service, isAllowed) {
        this.service = service;
        this.isAllowed = isAllowed;
    }
    temperature(city) {
        if (!this.isAllowed())
            return Promise.reject(new Error('Access denied'));
        return this.service.temperature(city);
    }
}
export const createValidatedObject = (target, validate) => new Proxy(target, {
    set(object, key, value, receiver) {
        if (!validate(key, value))
            throw new TypeError(`Invalid value for "${String(key)}"`);
        return Reflect.set(object, key, value, receiver);
    },
});
