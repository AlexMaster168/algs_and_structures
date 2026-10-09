from .hash import default_hasher

EMPTY = object()
DELETED = object()


class OpenAddressingHashMap:
    def __init__(self, hasher=default_hasher, initial_capacity=16):
        self.hasher = hasher
        self.slots = [EMPTY] * max(2, initial_capacity)
        self.count = self.tombstones = 0

    @property
    def size(self):
        return self.count

    def set(self, key, value):
        if (self.count + self.tombstones + 1) * 2 > len(self.slots):
            entries = list(self)
            self.slots = [EMPTY] * (len(self.slots) * 2)
            self.count = self.tombstones = 0
            for entry_key, entry_value in entries:
                self.set(entry_key, entry_value)
        index, first_deleted = self.hasher(key) % len(self.slots), -1
        while self.slots[index] is not EMPTY:
            slot = self.slots[index]
            if slot is DELETED:
                if first_deleted == -1:
                    first_deleted = index
            elif slot[0] == key:
                slot[1] = value
                return self
            index = (index + 1) % len(self.slots)
        if first_deleted != -1:
            index = first_deleted
            self.tombstones -= 1
        self.slots[index] = [key, value]
        self.count += 1
        return self

    def _find(self, key):
        index = self.hasher(key) % len(self.slots)
        for _ in self.slots:
            slot = self.slots[index]
            if slot is EMPTY:
                return -1
            if slot is not DELETED and slot[0] == key:
                return index
            index = (index + 1) % len(self.slots)
        return -1

    def get(self, key):
        index = self._find(key)
        return None if index == -1 else self.slots[index][1]

    def has(self, key):
        return self._find(key) != -1

    def delete(self, key):
        index = self._find(key)
        if index == -1:
            return False
        self.slots[index] = DELETED
        self.count -= 1
        self.tombstones += 1
        return True

    def __iter__(self):
        for slot in self.slots:
            if slot is not EMPTY and slot is not DELETED:
                yield slot[0], slot[1]
