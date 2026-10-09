import { defaultCompare } from '../../shared/compare.js';
export const insertionSortRange = (array, left, right, compare) => {
    for (let i = left + 1; i <= right; i++) {
        const current = array[i];
        let j = i - 1;
        while (j >= left && compare(array[j], current) > 0) {
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = current;
    }
};
export const insertionSort = (input, compare = defaultCompare) => {
    const array = [...input];
    insertionSortRange(array, 0, array.length - 1, compare);
    return array;
};
