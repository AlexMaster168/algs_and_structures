class NumberRange:
    def __init__(self, start, end, step=1):
        if step == 0:
            raise ValueError('Step must not be zero')
        self.start, self.end, self.step = start, end, step

    def create_iterator(self):
        source = self

        class RangeIterator:
            def __init__(self):
                self.current = source.start

            def has_next(self):
                return self.current < source.end if source.step > 0 else self.current > source.end

            def next(self):
                value = self.current
                self.current += source.step
                return value

        return RangeIterator()

    def __iter__(self):
        iterator = self.create_iterator()
        while iterator.has_next():
            yield iterator.next()


def depth_first(roots):
    for root in roots:
        yield root['value']
        yield from depth_first(root.get('children', []))


def breadth_first(roots):
    queue = list(roots)
    for item in queue:
        yield item['value']
        queue.extend(item.get('children', []))


def take(source, count):
    if count <= 0:
        return
    for item in source:
        yield item
        count -= 1
        if count == 0:
            return
