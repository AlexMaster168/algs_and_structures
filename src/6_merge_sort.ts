function mergeSort(array: Number[]) {
    let k;
    let j;
    if (array.length > 1) {
        let mid = Math.floor(array.length / 2),
            lefthalf = array.slice(0, mid),
            righthalf = array.slice(mid);
        mergeSort(lefthalf)
        mergeSort(righthalf)

        let i = j = k = 0
        while (i < lefthalf.length && j < righthalf.length) {
            if (lefthalf[i] < righthalf[j]) {
                array[k] = lefthalf[i]
                i++;
            } else {
                array[k] = righthalf[j]
                j++
            }
            k++
        }
        while (i < lefthalf.length) {
            array[k] = lefthalf[i]
            i++
            k++
        }
        while (j < righthalf.length) {
            array[k] = righthalf[j]
            j++
            k++
        }
    }
    return array
}

console.log(mergeSort([0,3,2,5,6,8,1,9,4,2,1,2,9,6,4,1,7,-1, -5, 23,6,2,35,6,3,32]))
