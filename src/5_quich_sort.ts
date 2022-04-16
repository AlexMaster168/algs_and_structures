export {};
const arr: number[] = [0,3,2,5,6,8,23,9,4,2,1,2,9,6,4,1,7,-1, -5, 23,6,2,35,6,3,32,9,4,2,1,2,9,6,4,1,7,-1, -5, 23,9,4,2,1,2,9,6,4,1,7]
let count: number = 0

function quickSort(array: number[]): number[] {
    if (array.length <= 1) return array
    let pivotIndex: number = Math.floor(array.length / 2);
    let pivot:number = array[pivotIndex]
    let less: number[] = []
    let greater:number[] = []
    for (let i = 0; i < array.length; i++) {
        count += 1
        if(i === pivotIndex) continue
        if (array[i] < pivot) less.push(array[i])
        else greater.push(array[i])
    }
    return [...quickSort(less), pivot, ...quickSort(greater)]
}

console.log(quickSort(arr))
console.log('count', count)
