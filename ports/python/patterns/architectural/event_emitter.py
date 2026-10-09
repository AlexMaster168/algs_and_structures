class TypedEventEmitter:
    def __init__(self):
        self.listeners = {}

    def on(self, event, listener):
        self.listeners.setdefault(event, {})[listener] = None
        return lambda: self.off(event, listener)

    def once(self, event, listener):
        def call(payload):
            self.off(event, call)
            listener(payload)
        return self.on(event, call)

    def off(self, event, listener):
        self.listeners.get(event, {}).pop(listener, None)

    def emit(self, event, payload):
        listeners = self.listeners.get(event, {})
        for listener in list(listeners):
            listener(payload)
        return len(listeners)

    def listener_count(self, event):
        return len(self.listeners.get(event, {}))
