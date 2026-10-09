export const fractionalKnapsack = (items, capacity) => {
    let value = 0;
    let remaining = capacity;
    for (const item of [...items].sort((a, b) => b.value / b.weight - a.value / a.weight)) {
        if (remaining <= 0)
            break;
        const taken = Math.min(item.weight, remaining);
        value += (item.value / item.weight) * taken;
        remaining -= taken;
    }
    return value;
};
