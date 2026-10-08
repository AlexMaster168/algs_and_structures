export interface Token<T> {
  readonly key: symbol;
  readonly type?: T;
}

export const token = <T>(description: string): Token<T> => ({ key: Symbol(description) });

type Lifetime = 'singleton' | 'transient';

interface Registration<T> {
  factory: (container: Container) => T;
  lifetime: Lifetime;
  instance?: T;
}

export class Container {
  private readonly registrations = new Map<symbol, Registration<unknown>>();
  private readonly resolving = new Set<symbol>();

  register<T>(target: Token<T>, factory: (container: Container) => T, lifetime: Lifetime = 'singleton'): this {
    this.registrations.set(target.key, { factory, lifetime });
    return this;
  }

  value<T>(target: Token<T>, value: T): this {
    this.registrations.set(target.key, { factory: () => value, lifetime: 'singleton', instance: value });
    return this;
  }

  resolve<T>(target: Token<T>): T {
    const registration = this.registrations.get(target.key) as Registration<T> | undefined;
    if (!registration) throw new Error(`No provider for ${target.key.description}`);
    if (registration.lifetime === 'singleton' && 'instance' in registration) return registration.instance as T;

    if (this.resolving.has(target.key)) throw new Error(`Circular dependency on ${target.key.description}`);
    this.resolving.add(target.key);
    try {
      const instance = registration.factory(this);
      if (registration.lifetime === 'singleton') registration.instance = instance;
      return instance;
    } finally {
      this.resolving.delete(target.key);
    }
  }
}
