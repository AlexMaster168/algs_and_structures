class ObjectPool:
    def __init__(self, create, reset=lambda item: None, max_size=float('inf')):
        self.create, self.reset, self.max_size = create, reset, max_size
        self.available, self.in_use = [], {}

    @property
    def available_count(self):
        return len(self.available)

    @property
    def in_use_count(self):
        return len(self.in_use)

    def acquire(self):
        if self.available:
            item = self.available.pop()
        else:
            if len(self.in_use) >= self.max_size:
                raise RuntimeError('Pool is exhausted')
            item = self.create()
        self.in_use[id(item)] = item
        return item

    def release(self, item):
        if id(item) not in self.in_use:
            raise ValueError('Item does not belong to this pool')
        del self.in_use[id(item)]
        self.reset(item)
        self.available.append(item)

    def use(self, work):
        item = self.acquire()
        try:
            return work(item)
        finally:
            self.release(item)
