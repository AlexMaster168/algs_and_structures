export const token = (description) => ({ key: Symbol(description) });
export class Container {
    registrations = new Map();
    resolving = new Set();
    register(target, factory, lifetime = 'singleton') {
        this.registrations.set(target.key, { factory, lifetime });
        return this;
    }
    value(target, value) {
        this.registrations.set(target.key, { factory: () => value, lifetime: 'singleton', instance: value });
        return this;
    }
    resolve(target) {
        const registration = this.registrations.get(target.key);
        if (!registration)
            throw new Error(`No provider for ${target.key.description}`);
        if (registration.lifetime === 'singleton' && 'instance' in registration)
            return registration.instance;
        if (this.resolving.has(target.key))
            throw new Error(`Circular dependency on ${target.key.description}`);
        this.resolving.add(target.key);
        try {
            const instance = registration.factory(this);
            if (registration.lifetime === 'singleton')
                registration.instance = instance;
            return instance;
        }
        finally {
            this.resolving.delete(target.key);
        }
    }
}
