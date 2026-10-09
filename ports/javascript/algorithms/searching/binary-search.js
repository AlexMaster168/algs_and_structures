import { defaultCompare } from '../../shared/compare.js';
export const binarySearch = (sorted, target, compare = defaultCompare, low = 0, high = sorted.length - 1) => {
    while (low <= high) {
        const mid = low + ((high - low) >> 1);
        const order = compare(sorted[mid], target);
        if (order === 0)
            return mid;
        if (order < 0)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
};
export const binarySearchRecursive = (sorted, target, compare = defaultCompare, low = 0, high = sorted.length - 1) => {
    if (low > high)
        return -1;
    const mid = low + ((high - low) >> 1);
    const order = compare(sorted[mid], target);
    if (order === 0)
        return mid;
    return order < 0
        ? binarySearchRecursive(sorted, target, compare, mid + 1, high)
        : binarySearchRecursive(sorted, target, compare, low, mid - 1);
};
export const lowerBound = (sorted, target, compare = defaultCompare) => {
    let low = 0;
    let high = sorted.length;
    while (low < high) {
        const mid = (low + high) >> 1;
        if (compare(sorted[mid], target) < 0)
            low = mid + 1;
        else
            high = mid;
    }
    return low;
};
export const upperBound = (sorted, target, compare = defaultCompare) => {
    let low = 0;
    let high = sorted.length;
    while (low < high) {
        const mid = (low + high) >> 1;
        if (compare(sorted[mid], target) <= 0)
            low = mid + 1;
        else
            high = mid;
    }
    return low;
};
export const firstTrue = (low, high, predicate) => {
    while (low < high) {
        const mid = low + Math.floor((high - low) / 2);
        if (predicate(mid))
            high = mid;
        else
            low = mid + 1;
    }
    return low;
};
