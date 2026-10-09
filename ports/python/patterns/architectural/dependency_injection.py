class _Token:
    def __init__(self, description):
        self.description = description


def token(description):
    return _Token(description)


class Container:
    def __init__(self):
        self.registrations, self.resolving = {}, set()

    def register(self, target, factory, lifetime='singleton'):
        if lifetime not in ('singleton', 'transient'):
            raise ValueError('Invalid lifetime')
        self.registrations[target] = {'factory': factory, 'lifetime': lifetime}
        return self

    def value(self, target, value):
        self.registrations[target] = {'factory': lambda container: value, 'lifetime': 'singleton', 'instance': value}
        return self

    def resolve(self, target):
        registration = self.registrations[target]
        if registration['lifetime'] == 'singleton' and 'instance' in registration:
            return registration['instance']
        if target in self.resolving:
            raise RuntimeError(f'Circular dependency: {target.description}')
        self.resolving.add(target)
        try:
            instance = registration['factory'](self)
            if registration['lifetime'] == 'singleton':
                registration['instance'] = instance
            return instance
        finally:
            self.resolving.remove(target)
