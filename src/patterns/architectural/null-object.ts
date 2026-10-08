export interface Logger {
  info(message: string): void;
  error(message: string): void;
}

export class MemoryLogger implements Logger {
  readonly lines: string[] = [];

  info(message: string): void {
    this.lines.push(`INFO ${message}`);
  }

  error(message: string): void {
    this.lines.push(`ERROR ${message}`);
  }
}

export class NullLogger implements Logger {
  info(): void {}

  error(): void {}
}

export class PaymentService {
  constructor(private readonly logger: Logger = new NullLogger()) {}

  charge(amount: number): boolean {
    if (amount <= 0) {
      this.logger.error(`invalid amount ${amount}`);
      return false;
    }
    this.logger.info(`charged ${amount}`);
    return true;
  }
}
