class AppConfig:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
            cls._instance.values = {}
        return cls._instance

    def set(self, key, value):
        self.values[key] = value
        return self

    def get(self, key, fallback=None):
        return self.values.get(key, fallback)


def lazy_singleton(create):
    initialized = False
    value = None

    def get():
        nonlocal initialized, value
        if not initialized:
            value = create()
            initialized = True
        return value

    return get
