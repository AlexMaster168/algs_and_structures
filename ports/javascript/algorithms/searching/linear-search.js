export const linearSearch = (array, target) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === target)
            return i;
    }
    return -1;
};
export const linearSearchAll = (array, predicate) => {
    const indices = [];
    array.forEach((value, index) => {
        if (predicate(value, index))
            indices.push(index);
    });
    return indices;
};
