export const memoize = <Args extends unknown[], R>(
  fn: (...args: Args) => R,
  resolveKey: (...args: Args) => unknown = (...args) => (args.length === 1 ? args[0] : JSON.stringify(args)),
): ((...args: Args) => R) & { cache: Map<unknown, R> } => {
  const cache = new Map<unknown, R>();

  const memoized = (...args: Args): R => {
    const key = resolveKey(...args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };

  return Object.assign(memoized, { cache });
};
