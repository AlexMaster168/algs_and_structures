DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'
ROMAN = [(1000, 'M'), (900, 'CM'), (500, 'D'), (400, 'CD'), (100, 'C'), (90, 'XC'), (50, 'L'), (40, 'XL'), (10, 'X'), (9, 'IX'), (5, 'V'), (4, 'IV'), (1, 'I')]


def to_base(value, base):
    if base < 2 or base > 36:
        raise ValueError('Base must be between 2 and 36')
    if value == 0:
        return '0'
    negative, rest, result = value < 0, abs(value), ''
    while rest > 0:
        result = DIGITS[rest % base] + result
        rest //= base
    return '-' + result if negative else result


def from_base(input, base):
    negative, result = input.startswith('-'), 0
    for char in input[1 if negative else 0:].lower():
        digit = DIGITS.find(char)
        if digit < 0 or digit >= base:
            raise ValueError(f'Invalid digit "{char}" for base {base}')
        result = result * base + digit
    return -result if negative else result


def to_roman(value):
    if not isinstance(value, int) or not 1 <= value <= 3999:
        raise ValueError('Value must be in 1..3999')
    result = ''
    for amount, symbol in ROMAN:
        while value >= amount:
            result += symbol
            value -= amount
    return result


def from_roman(input):
    values = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    result = 0
    for i, char in enumerate(input):
        current = values[char]
        next_value = values.get(input[i + 1], 0) if i + 1 < len(input) else 0
        result += -current if current < next_value else current
    return result
