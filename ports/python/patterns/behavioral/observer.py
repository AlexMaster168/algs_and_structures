class Subject:
    def __init__(self):
        self.observers = dict()

    @property
    def observer_count(self):
        return len(self.observers)

    def subscribe(self, observer):
        self.observers[observer] = None
        return lambda: self.observers.pop(observer, None)

    def notify(self, value):
        for observer in list(self.observers):
            observer(value)


class StockTicker:
    def __init__(self):
        self.changes, self.prices = Subject(), {}

    def update(self, symbol, price):
        previous = self.prices.get(symbol, price)
        self.prices[symbol] = price
        self.changes.notify({'symbol': symbol, 'price': price, 'change': price - previous})


class BehaviorSubject(Subject):
    def __init__(self, value):
        super().__init__()
        self.current = value

    @property
    def value(self):
        return self.current

    def subscribe(self, observer):
        observer(self.current)
        return super().subscribe(observer)

    def notify(self, value):
        self.current = value
        super().notify(value)
