export const fnv1a = (input, seed = 0x811c9dc5) => {
    let hash = seed >>> 0;
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
};
export const defaultHasher = (key) => fnv1a(`${typeof key}:${String(key)}`);
