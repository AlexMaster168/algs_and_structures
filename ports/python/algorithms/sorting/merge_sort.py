from ...shared.compare import default_compare


def merge(left, right, compare=default_compare):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if compare(left[i], right[j]) <= 0:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result


def merge_sort(input, compare=default_compare):
    if len(input) <= 1:
        return list(input)
    middle = len(input) // 2
    return merge(merge_sort(input[:middle], compare), merge_sort(input[middle:], compare), compare)


def bottom_up_merge_sort(input, compare=default_compare):
    source = list(input)
    target = [None] * len(source)
    width = 1
    while width < len(source):
        for left in range(0, len(source), 2 * width):
            middle = min(left + width, len(source))
            right = min(left + 2 * width, len(source))
            i, j, k = left, middle, left
            while i < middle and j < right:
                if compare(source[i], source[j]) <= 0:
                    target[k] = source[i]
                    i += 1
                else:
                    target[k] = source[j]
                    j += 1
                k += 1
            while i < middle:
                target[k] = source[i]
                i += 1
                k += 1
            while j < right:
                target[k] = source[j]
                j += 1
                k += 1
        source, target = target, source
        width *= 2
    return source
