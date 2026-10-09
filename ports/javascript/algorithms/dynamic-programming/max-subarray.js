export const maxSubarray = (values) => {
    if (values.length === 0)
        throw new RangeError('Array must not be empty');
    let best = { sum: values[0], start: 0, end: 0 };
    let currentSum = values[0];
    let currentStart = 0;
    for (let i = 1; i < values.length; i++) {
        const value = values[i];
        if (currentSum < 0) {
            currentSum = value;
            currentStart = i;
        }
        else {
            currentSum += value;
        }
        if (currentSum > best.sum)
            best = { sum: currentSum, start: currentStart, end: i };
    }
    return best;
};
