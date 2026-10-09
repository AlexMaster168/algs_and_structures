import { defaultCompare } from '../../shared/compare.js';
const swap = (array, i, j) => {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
};
export const partition3 = (array, low, high, compare) => {
    const pivotIndex = low + Math.floor(Math.random() * (high - low + 1));
    const pivot = array[pivotIndex];
    let lt = low;
    let gt = high;
    let i = low;
    while (i <= gt) {
        const order = compare(array[i], pivot);
        if (order < 0)
            swap(array, lt++, i++);
        else if (order > 0)
            swap(array, i, gt--);
        else
            i++;
    }
    return [lt, gt];
};
export const quickSort = (input, compare = defaultCompare) => {
    const array = [...input];
    const stack = [[0, array.length - 1]];
    while (stack.length) {
        const [low, high] = stack.pop();
        if (low >= high)
            continue;
        const [lt, gt] = partition3(array, low, high, compare);
        stack.push([low, lt - 1], [gt + 1, high]);
    }
    return array;
};
export const lomutoPartition = (array, low, high, compare) => {
    const pivot = array[high];
    let boundary = low;
    for (let i = low; i < high; i++) {
        if (compare(array[i], pivot) < 0)
            swap(array, boundary++, i);
    }
    swap(array, boundary, high);
    return boundary;
};
export const quickSortFunctional = (input, compare = defaultCompare) => {
    if (input.length <= 1)
        return [...input];
    const [pivot, ...rest] = input;
    const less = rest.filter((value) => compare(value, pivot) < 0);
    const greater = rest.filter((value) => compare(value, pivot) >= 0);
    return [...quickSortFunctional(less, compare), pivot, ...quickSortFunctional(greater, compare)];
};
