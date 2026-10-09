import asyncio
import time


class CircuitOpenError(RuntimeError):
    def __init__(self):
        super().__init__('Circuit is open')


class CircuitBreaker:
    def __init__(self, action, failure_threshold=3, reset_timeout_ms=10000, now=lambda: time.time() * 1000):
        self.action, self.failure_threshold, self.reset_timeout_ms, self.now = action, failure_threshold, reset_timeout_ms, now
        self.failures, self.opened_at, self.current = 0, 0, 'closed'

    @property
    def state(self):
        if self.current == 'open' and self.now() - self.opened_at >= self.reset_timeout_ms:
            self.current = 'half-open'
        return self.current

    async def call(self, *args):
        if self.state == 'open':
            raise CircuitOpenError()
        try:
            result = await self.action(*args)
            self.failures, self.current = 0, 'closed'
            return result
        except Exception:
            self.failures += 1
            if self.current == 'half-open' or self.failures >= self.failure_threshold:
                self.current, self.opened_at = 'open', self.now()
            raise


async def retry(action, attempts=3, delay_ms=0, factor=2):
    if attempts < 1:
        raise ValueError('Attempts must be positive')
    for attempt in range(attempts):
        try:
            return await action()
        except Exception:
            if attempt == attempts - 1:
                raise
            if delay_ms > 0:
                await asyncio.sleep(delay_ms * factor ** attempt / 1000)
