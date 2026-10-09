def permutations(items):
    result, current, used = [], [], [False] * len(items)

    def build():
        if len(current) == len(items):
            result.append(current.copy())
            return
        for i, item in enumerate(items):
            if used[i]:
                continue
            used[i] = True
            current.append(item)
            build()
            current.pop()
            used[i] = False

    build()
    return result


def combinations(items, size):
    result, current = [], []

    def build(start):
        if len(current) == size:
            result.append(current.copy())
            return
        for i in range(start, len(items) - (size - len(current)) + 1):
            current.append(items[i])
            build(i + 1)
            current.pop()

    build(0)
    return result


def subsets(items):
    result, current = [], []

    def build(index):
        if index == len(items):
            result.append(current.copy())
            return
        build(index + 1)
        current.append(items[index])
        build(index + 1)
        current.pop()

    build(0)
    return result


def combination_sum(candidates, target):
    ordered = sorted(set(candidates))
    if any(value <= 0 for value in ordered):
        raise ValueError('Candidates must be positive')
    result, current = [], []

    def build(start, remaining):
        if remaining == 0:
            result.append(current.copy())
            return
        for i in range(start, len(ordered)):
            if ordered[i] > remaining:
                break
            current.append(ordered[i])
            build(i, remaining - ordered[i])
            current.pop()

    build(0, target)
    return result
