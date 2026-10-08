export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeoutMs?: number;
  now?: () => number;
}

export class CircuitOpenError extends Error {
  constructor() {
    super('Circuit is open');
    this.name = 'CircuitOpenError';
  }
}

export class CircuitBreaker<A extends unknown[], R> {
  private failures = 0;
  private openedAt = 0;
  private current: CircuitState = 'closed';
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;
  private readonly now: () => number;

  constructor(
    private readonly action: (...args: A) => Promise<R>,
    { failureThreshold = 3, resetTimeoutMs = 10_000, now = Date.now }: CircuitBreakerOptions = {},
  ) {
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
    this.now = now;
  }

  get state(): CircuitState {
    if (this.current === 'open' && this.now() - this.openedAt >= this.resetTimeoutMs) this.current = 'half-open';
    return this.current;
  }

  async call(...args: A): Promise<R> {
    if (this.state === 'open') throw new CircuitOpenError();

    try {
      const result = await this.action(...args);
      this.failures = 0;
      this.current = 'closed';
      return result;
    } catch (error) {
      this.failures++;
      if (this.current === 'half-open' || this.failures >= this.failureThreshold) {
        this.current = 'open';
        this.openedAt = this.now();
      }
      throw error;
    }
  }
}

export const retry = async <R>(
  action: () => Promise<R>,
  { attempts = 3, delayMs = 0, factor = 2 }: { attempts?: number; delayMs?: number; factor?: number } = {},
): Promise<R> => {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1 && delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * factor ** attempt));
      }
    }
  }
  throw lastError;
};
