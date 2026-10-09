from random import random as default_random


def fisher_yates_shuffle(input, random=default_random):
    array = list(input)
    for i in range(len(array) - 1, 0, -1):
        j = int(random() * (i + 1))
        array[i], array[j] = array[j], array[i]
    return array


def reservoir_sample(stream, size, random=default_random):
    reservoir = []
    for seen, item in enumerate(stream, 1):
        if len(reservoir) < size:
            reservoir.append(item)
        else:
            j = int(random() * seen)
            if j < size:
                reservoir[j] = item
    return reservoir


def mulberry32(seed):
    state = seed & 0xffffffff

    def random():
        nonlocal state
        state = (state + 0x6d2b79f5) & 0xffffffff
        t = state
        t = ((t ^ (t >> 15)) * (t | 1)) & 0xffffffff
        t ^= (t + (((t ^ (t >> 7)) * (t | 61)) & 0xffffffff)) & 0xffffffff
        return ((t ^ (t >> 14)) & 0xffffffff) / 4294967296
    return random


def monte_carlo_pi(samples, random=default_random):
    inside = sum(random() ** 2 + random() ** 2 <= 1 for _ in range(samples))
    return 4 * inside / samples
