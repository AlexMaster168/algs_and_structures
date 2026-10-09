export const canReachEnd = (jumps) => {
    let farthest = 0;
    for (let i = 0; i < jumps.length; i++) {
        if (i > farthest)
            return false;
        farthest = Math.max(farthest, i + jumps[i]);
    }
    return true;
};
export const minJumps = (jumps) => {
    let count = 0;
    let currentEnd = 0;
    let farthest = 0;
    for (let i = 0; i < jumps.length - 1; i++) {
        farthest = Math.max(farthest, i + jumps[i]);
        if (i === currentEnd) {
            if (farthest <= i)
                return -1;
            count++;
            currentEnd = farthest;
        }
    }
    return count;
};
export const greedyChange = (amount, denominations) => {
    const result = [];
    for (const coin of [...denominations].sort((a, b) => b - a)) {
        while (amount >= coin) {
            result.push(coin);
            amount -= coin;
        }
    }
    return result;
};
