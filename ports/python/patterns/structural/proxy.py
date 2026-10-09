import time


class CachingWeatherProxy:
    def __init__(self, service, ttl_ms=60000, now=lambda: time.time() * 1000):
        self.service, self.ttl_ms, self.now, self.cache = service, ttl_ms, now, {}

    async def temperature(self, city):
        cached = self.cache.get(city)
        if cached is not None and cached[1] > self.now():
            return cached[0]
        value = await self.service.temperature(city)
        self.cache[city] = (value, self.now() + self.ttl_ms)
        return value


class AccessControlProxy:
    def __init__(self, service, is_allowed):
        self.service, self.is_allowed = service, is_allowed

    async def temperature(self, city):
        if not self.is_allowed():
            raise PermissionError('Access denied')
        return await self.service.temperature(city)


class _ValidatedObject:
    def __init__(self, target, validate):
        object.__setattr__(self, '_target', target)
        object.__setattr__(self, '_validate', validate)

    def __getattr__(self, key):
        return self._target[key] if isinstance(self._target, dict) else getattr(self._target, key)

    def __setattr__(self, key, value):
        if not self._validate(key, value):
            raise TypeError(f'Invalid value for {key}')
        if isinstance(self._target, dict):
            self._target[key] = value
        else:
            setattr(self._target, key, value)

    def __getitem__(self, key):
        return getattr(self, key)

    def __setitem__(self, key, value):
        setattr(self, key, value)


def create_validated_object(target, validate):
    return _ValidatedObject(target, validate)
