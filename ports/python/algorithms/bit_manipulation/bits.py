def get_bit(value, position):
    return ((value & 0xffffffff) >> (position & 31)) & 1


def set_bit(value, position):
    return (value | (1 << (position & 31))) & 0xffffffff


def clear_bit(value, position):
    return (value & ~(1 << (position & 31))) & 0xffffffff


def toggle_bit(value, position):
    return (value ^ (1 << (position & 31))) & 0xffffffff


def count_set_bits(value):
    count, value = 0, value & 0xffffffff
    while value:
        value &= value - 1
        count += 1
    return count


def is_power_of_two(value):
    return value > 0 and (value & (value - 1)) == 0


def lowest_set_bit(value):
    result = value & -value & 0xffffffff
    return result if result < 0x80000000 else result - 0x100000000


def single_number(values):
    result = 0
    for value in values:
        result ^= value
    result &= 0xffffffff
    return result if result < 0x80000000 else result - 0x100000000


def reverse_bits(value):
    result = 0
    for _ in range(32):
        result = (result << 1) | (value & 1)
        value >>= 1
    return result & 0xffffffff


def gray_code(bits):
    return [i ^ (i >> 1) for i in range(1 << bits)]


def subsets_by_mask(items):
    return [[item for i, item in enumerate(items) if mask & (1 << i)] for mask in range(1 << len(items))]


def swap_without_temp(a, b):
    a ^= b
    b ^= a
    a ^= b
    return [a, b]


def hamming_distance(a, b):
    return count_set_bits(a ^ b)
