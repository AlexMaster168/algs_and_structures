from math import log, ceil, floor
from .hash import fnv1a


class BloomFilter:
    def __init__(self, expected_items, false_positive_rate=0.01):
        if expected_items <= 0 or not 0 < false_positive_rate < 1:
            raise ValueError('Invalid bloom filter configuration')
        self.bit_count = max(8, ceil(-expected_items * log(false_positive_rate) / log(2) ** 2))
        self.hash_count = max(1, floor(self.bit_count / expected_items * log(2) + 0.5))
        self.bits = bytearray(ceil(self.bit_count / 8))

    def _positions(self, item):
        h1, h2 = fnv1a(item), fnv1a(item, 0x5bd1e995) | 1
        for i in range(self.hash_count):
            yield (h1 + i * h2) % self.bit_count

    def add(self, item):
        for position in self._positions(item):
            self.bits[position >> 3] |= 1 << (position & 7)
        return self

    def might_contain(self, item):
        return all(self.bits[position >> 3] & (1 << (position & 7)) for position in self._positions(item))
