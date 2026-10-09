const sortNonNegative = (input, base) => {
    let array = [...input];
    const max = array.reduce((acc, value) => (value > acc ? value : acc), 0);
    for (let exponent = 1; Math.floor(max / exponent) > 0; exponent *= base) {
        const buckets = Array.from({ length: base }, () => []);
        for (const value of array)
            buckets[Math.floor(value / exponent) % base].push(value);
        array = buckets.flat();
    }
    return array;
};
export const radixSort = (input, base = 10) => {
    if (input.some((value) => !Number.isInteger(value)))
        throw new TypeError('Radix sort works only with integers');
    const negatives = input.filter((value) => value < 0).map((value) => -value);
    const positives = input.filter((value) => value >= 0);
    return [
        ...sortNonNegative(negatives, base)
            .reverse()
            .map((value) => -value),
        ...sortNonNegative(positives, base),
    ];
};
