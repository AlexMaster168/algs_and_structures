def fnv1a(input, seed=0x811c9dc5):
    value = seed & 0xffffffff
    encoded = input.encode('utf-16-le', errors='surrogatepass')
    for i in range(0, len(encoded), 2):
        value ^= encoded[i] | encoded[i + 1] << 8
        value = value * 0x01000193 & 0xffffffff
    return value


def default_hasher(key):
    if key is None:
        kind, value = 'object', 'null'
    elif isinstance(key, bool):
        kind, value = 'boolean', str(key).lower()
    elif isinstance(key, (int, float)):
        kind, value = 'number', str(int(key)) if int(key) == key else str(key)
    elif isinstance(key, str):
        kind, value = 'string', key
    else:
        kind, value = 'object', str(key)
    return fnv1a(f'{kind}:{value}')
