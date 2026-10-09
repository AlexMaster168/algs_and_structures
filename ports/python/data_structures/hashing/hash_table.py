from .hash import default_hasher


class HashTable:
    def __init__(self, hasher=default_hasher, initial_capacity=16, max_load_factor=0.75):
        self.hasher, self.max_load_factor = hasher, max_load_factor
        self.buckets, self.count = [[] for _ in range(max(1, initial_capacity))], 0

    @property
    def size(self):
        return self.count

    @property
    def capacity(self):
        return len(self.buckets)

    def _bucket_for(self, key):
        return self.buckets[self.hasher(key) % len(self.buckets)]

    def set(self, key, value):
        bucket = self._bucket_for(key)
        for entry in bucket:
            if entry[0] == key:
                entry[1] = value
                return self
        bucket.append([key, value])
        self.count += 1
        if self.count / len(self.buckets) > self.max_load_factor:
            entries = list(self)
            self.buckets = [[] for _ in range(len(self.buckets) * 2)]
            for entry_key, entry_value in entries:
                self._bucket_for(entry_key).append([entry_key, entry_value])
        return self

    def get(self, key):
        for entry_key, value in self._bucket_for(key):
            if entry_key == key:
                return value
        return None

    def has(self, key):
        return any(entry_key == key for entry_key, _ in self._bucket_for(key))

    def delete(self, key):
        bucket = self._bucket_for(key)
        for i, (entry_key, _) in enumerate(bucket):
            if entry_key == key:
                bucket.pop(i)
                self.count -= 1
                return True
        return False

    def clear(self):
        self.buckets = [[] for _ in self.buckets]
        self.count = 0

    def keys(self):
        for key, _ in self:
            yield key

    def values(self):
        for _, value in self:
            yield value

    def __iter__(self):
        for bucket in self.buckets:
            for key, value in bucket:
                yield key, value
