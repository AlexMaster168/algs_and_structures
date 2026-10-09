class SparseTable:
    def __init__(self, values, combine):
        n = len(values)
        self.combine, self.log, self.table = combine, [0] * (n + 1), [list(values)]
        for i in range(2, n + 1):
            self.log[i] = self.log[i >> 1] + 1
        level = 1
        while 1 << level <= n:
            previous, half = self.table[level - 1], 1 << (level - 1)
            self.table.append([combine(previous[i], previous[i + half]) for i in range(n - (1 << level) + 1)])
            level += 1

    def query(self, left, right):
        if left < 0 or right >= len(self.table[0]) or left > right:
            raise IndexError(f'Invalid range [{left}, {right}]')
        level = self.log[right - left + 1]
        row = self.table[level]
        return self.combine(row[left], row[right - (1 << level) + 1])


def min_sparse_table(values):
    return SparseTable(values, min)


def max_sparse_table(values):
    return SparseTable(values, max)
