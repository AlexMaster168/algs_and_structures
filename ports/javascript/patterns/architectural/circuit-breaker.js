export class CircuitOpenError extends Error {
    constructor() {
        super('Circuit is open');
        this.name = 'CircuitOpenError';
    }
}
export class CircuitBreaker {
    action;
    failures = 0;
    openedAt = 0;
    current = 'closed';
    failureThreshold;
    resetTimeoutMs;
    now;
    constructor(action, { failureThreshold = 3, resetTimeoutMs = 10_000, now = Date.now } = {}) {
        this.action = action;
        this.failureThreshold = failureThreshold;
        this.resetTimeoutMs = resetTimeoutMs;
        this.now = now;
    }
    get state() {
        if (this.current === 'open' && this.now() - this.openedAt >= this.resetTimeoutMs)
            this.current = 'half-open';
        return this.current;
    }
    async call(...args) {
        if (this.state === 'open')
            throw new CircuitOpenError();
        try {
            const result = await this.action(...args);
            this.failures = 0;
            this.current = 'closed';
            return result;
        }
        catch (error) {
            this.failures++;
            if (this.current === 'half-open' || this.failures >= this.failureThreshold) {
                this.current = 'open';
                this.openedAt = this.now();
            }
            throw error;
        }
    }
}
export const retry = async (action, { attempts = 3, delayMs = 0, factor = 2 } = {}) => {
    let lastError;
    for (let attempt = 0; attempt < attempts; attempt++) {
        try {
            return await action();
        }
        catch (error) {
            lastError = error;
            if (attempt < attempts - 1 && delayMs > 0) {
                await new Promise((resolve) => setTimeout(resolve, delayMs * factor ** attempt));
            }
        }
    }
    throw lastError;
};
