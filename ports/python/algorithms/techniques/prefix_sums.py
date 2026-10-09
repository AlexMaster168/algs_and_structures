class PrefixSums:
    def __init__(self, values):
        self.prefix = [0]
        for value in values:
            self.prefix.append(self.prefix[-1] + value)

    def sum(self, left, right):
        return self.prefix[right + 1] - self.prefix[left]


class PrefixSums2D:
    def __init__(self, matrix):
        rows, cols = len(matrix), len(matrix[0]) if matrix else 0
        self.prefix = [[0] * (cols + 1) for _ in range(rows + 1)]
        p = self.prefix
        for r in range(rows):
            for c in range(cols):
                p[r + 1][c + 1] = matrix[r][c] + p[r][c + 1] + p[r + 1][c] - p[r][c]

    def sum(self, top, left, bottom, right):
        p = self.prefix
        return p[bottom + 1][right + 1] - p[top][right + 1] - p[bottom + 1][left] + p[top][left]


def subarray_sum_equals(values, target):
    seen, total, count = {0: 1}, 0, 0
    for value in values:
        total += value
        count += seen.get(total - target, 0)
        seen[total] = seen.get(total, 0) + 1
    return count


def difference_array_apply(length, updates):
    diff = [0] * (length + 1)
    for left, right, delta in updates:
        diff[left] += delta
        diff[right + 1] -= delta
    result, running = [], 0
    for delta in diff[:length]:
        running += delta
        result.append(running)
    return result


def majority_element(values):
    candidate, count = None, 0
    for value in values:
        if count == 0:
            candidate = value
        count += 1 if value == candidate else -1
    return candidate if values.count(candidate) > len(values) / 2 else None
