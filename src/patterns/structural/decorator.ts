export interface Notifier {
  send(message: string): string[];
}

export class EmailNotifier implements Notifier {
  constructor(private readonly email: string) {}

  send(message: string): string[] {
    return [`email to ${this.email}: ${message}`];
  }
}

export abstract class NotifierDecorator implements Notifier {
  constructor(protected readonly wrapped: Notifier) {}

  send(message: string): string[] {
    return this.wrapped.send(message);
  }
}

export class SmsNotifier extends NotifierDecorator {
  constructor(
    wrapped: Notifier,
    private readonly phone: string,
  ) {
    super(wrapped);
  }

  override send(message: string): string[] {
    return [...super.send(message), `sms to ${this.phone}: ${message}`];
  }
}

export class SlackNotifier extends NotifierDecorator {
  constructor(
    wrapped: Notifier,
    private readonly channel: string,
  ) {
    super(wrapped);
  }

  override send(message: string): string[] {
    return [...super.send(message), `slack #${this.channel}: ${message}`];
  }
}

export const withLogging =
  <A extends unknown[], R>(fn: (...args: A) => R, log: (line: string) => void, name = fn.name || 'anonymous') =>
  (...args: A): R => {
    log(`${name}(${args.map((arg) => JSON.stringify(arg)).join(', ')})`);
    const result = fn(...args);
    log(`${name} -> ${JSON.stringify(result)}`);
    return result;
  };
