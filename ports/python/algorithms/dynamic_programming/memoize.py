import json
from functools import wraps


def memoize(fn, resolve_key=None):
    cache = {}

    @wraps(fn)
    def memoized(*args):
        if resolve_key is not None:
            key = resolve_key(*args)
        elif len(args) == 1:
            try:
                hash(args[0])
                key = args[0]
            except TypeError:
                key = id(args[0])
        else:
            key = json.dumps(args, separators=(',', ':'))
        if key not in cache:
            cache[key] = fn(*args)
        return cache[key]

    memoized.cache = cache
    return memoized
