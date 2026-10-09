export const ternarySearchMax = (f, low, high, epsilon = 1e-9) => {
    while (high - low > epsilon) {
        const m1 = low + (high - low) / 3;
        const m2 = high - (high - low) / 3;
        if (f(m1) < f(m2))
            low = m1;
        else
            high = m2;
    }
    return (low + high) / 2;
};
export const ternarySearchMin = (f, low, high, epsilon = 1e-9) => ternarySearchMax((x) => -f(x), low, high, epsilon);
export const findPeakIndex = (values) => {
    let low = 0;
    let high = values.length - 1;
    while (low < high) {
        const mid = (low + high) >> 1;
        if (values[mid] < values[mid + 1])
            low = mid + 1;
        else
            high = mid;
    }
    return low;
};
