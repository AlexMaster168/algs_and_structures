export const fnv1a = (input: string, seed = 0x811c9dc5): number => {
  let hash = seed >>> 0;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

export const defaultHasher = (key: unknown): number => fnv1a(`${typeof key}:${String(key)}`);
