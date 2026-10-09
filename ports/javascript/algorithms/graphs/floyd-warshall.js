export const floydWarshall = (weights) => {
    const n = weights.length;
    const distance = weights.map((row) => [...row]);
    const next = weights.map((row, i) => row.map((weight, j) => (i === j || weight !== Infinity ? j : -1)));
    for (let i = 0; i < n; i++) {
        if (distance[i][i] > 0)
            distance[i][i] = 0;
    }
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            if (distance[i][k] === Infinity)
                continue;
            for (let j = 0; j < n; j++) {
                const candidate = distance[i][k] + distance[k][j];
                if (candidate < distance[i][j]) {
                    distance[i][j] = candidate;
                    next[i][j] = next[i][k];
                }
            }
        }
    }
    const hasNegativeCycle = distance.some((row, i) => row[i] < 0);
    return { distance, next, hasNegativeCycle };
};
export const floydWarshallPath = (next, from, to) => {
    if (next[from][to] === -1)
        return null;
    const path = [from];
    while (from !== to) {
        from = next[from][to];
        path.push(from);
    }
    return path;
};
