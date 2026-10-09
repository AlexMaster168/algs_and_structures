export const fisherYatesShuffle = (input, random = Math.random) => {
    const array = [...input];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
export const reservoirSample = (stream, size, random = Math.random) => {
    const reservoir = [];
    let seen = 0;
    for (const item of stream) {
        seen++;
        if (reservoir.length < size)
            reservoir.push(item);
        else {
            const j = Math.floor(random() * seen);
            if (j < size)
                reservoir[j] = item;
        }
    }
    return reservoir;
};
export const mulberry32 = (seed) => {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};
export const monteCarloPi = (samples, random = Math.random) => {
    let inside = 0;
    for (let i = 0; i < samples; i++) {
        const x = random();
        const y = random();
        if (x * x + y * y <= 1)
            inside++;
    }
    return (4 * inside) / samples;
};
