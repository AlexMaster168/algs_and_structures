export const jumpSearch = (sorted, target) => {
    const n = sorted.length;
    if (n === 0)
        return -1;
    const step = Math.floor(Math.sqrt(n));
    let previous = 0;
    let current = step;
    while (current < n && sorted[current - 1] < target) {
        previous = current;
        current += step;
    }
    for (let i = previous; i < Math.min(current, n); i++) {
        if (sorted[i] === target)
            return i;
    }
    return -1;
};
