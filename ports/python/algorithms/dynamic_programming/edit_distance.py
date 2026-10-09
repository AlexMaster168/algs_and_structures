def edit_distance(source, target):
    previous = list(range(len(target) + 1))
    for i, char in enumerate(source, 1):
        current = [i]
        for j, other in enumerate(target, 1):
            current.append(min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (char != other)))
        previous = current
    return previous[-1]
