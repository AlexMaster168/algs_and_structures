import { defaultCompare } from '../../shared/compare.js';
export const selectionSort = (input, compare = defaultCompare) => {
    const array = [...input];
    for (let i = 0; i < array.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < array.length; j++) {
            if (compare(array[j], array[min]) < 0)
                min = j;
        }
        if (min !== i)
            [array[i], array[min]] = [array[min], array[i]];
    }
    return array;
};
