export const memoize = (fn, resolveKey = (...args) => (args.length === 1 ? args[0] : JSON.stringify(args))) => {
    const cache = new Map();
    const memoized = (...args) => {
        const key = resolveKey(...args);
        if (cache.has(key))
            return cache.get(key);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
    return Object.assign(memoized, { cache });
};
