class _Store:
    def __init__(self, reducer, initial_state):
        self.reducer, self.state = reducer, initial_state
        self.listeners, self.dispatching = {}, False

    def get_state(self):
        return self.state

    def dispatch(self, action):
        if self.dispatching:
            raise RuntimeError('Reducers may not dispatch actions')
        self.dispatching = True
        try:
            self.state = self.reducer(self.state, action)
        finally:
            self.dispatching = False
        for listener in list(self.listeners):
            listener()
        return action

    def subscribe(self, listener):
        self.listeners[listener] = None
        return lambda: self.listeners.pop(listener, None)


def create_store(reducer, initial_state):
    return _Store(reducer, initial_state)


def combine_reducers(reducers):
    def reduce(state, action):
        result = {key: reducer(state[key], action) for key, reducer in reducers.items()}
        return result if any(result[key] is not state[key] for key in reducers) else state
    return reduce


def counter_reducer(state, action):
    if action['type'] == 'increment':
        return state + 1
    if action['type'] == 'decrement':
        return state - 1
    if action['type'] == 'add':
        return state + action['amount']
    raise ValueError('Unknown action')
