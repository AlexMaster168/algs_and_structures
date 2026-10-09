export const rodCutting = (prices, length) => {
    const revenue = new Array(length + 1).fill(0);
    const firstCut = new Array(length + 1).fill(0);
    for (let total = 1; total <= length; total++) {
        for (let piece = 1; piece <= Math.min(total, prices.length); piece++) {
            const candidate = prices[piece - 1] + revenue[total - piece];
            if (candidate > revenue[total]) {
                revenue[total] = candidate;
                firstCut[total] = piece;
            }
        }
    }
    const pieces = [];
    for (let rest = length; rest > 0 && firstCut[rest] > 0; rest -= firstCut[rest])
        pieces.push(firstCut[rest]);
    return { revenue: revenue[length], pieces };
};
