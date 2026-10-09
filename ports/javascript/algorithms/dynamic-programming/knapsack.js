export const knapsack01 = (items, capacity) => {
    const n = items.length;
    const table = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
    for (let i = 1; i <= n; i++) {
        const { weight, value } = items[i - 1];
        for (let w = 0; w <= capacity; w++) {
            table[i][w] = table[i - 1][w];
            if (weight <= w)
                table[i][w] = Math.max(table[i][w], table[i - 1][w - weight] + value);
        }
    }
    const chosen = [];
    for (let i = n, w = capacity; i > 0; i--) {
        if (table[i][w] !== table[i - 1][w]) {
            chosen.push(i - 1);
            w -= items[i - 1].weight;
        }
    }
    return { value: table[n][capacity], items: chosen.reverse() };
};
export const unboundedKnapsack = (items, capacity) => {
    const best = new Array(capacity + 1).fill(0);
    for (let w = 1; w <= capacity; w++) {
        for (const { weight, value } of items) {
            if (weight <= w)
                best[w] = Math.max(best[w], best[w - weight] + value);
        }
    }
    return best[capacity];
};
