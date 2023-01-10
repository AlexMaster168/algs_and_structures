export {};
const array: number[] = [1,4,5,8,5,1,2,7,5,2,11]
let count: number = 0
function linearSearch(array: number[], item: number): null | number {
    for (let i = 0; i < array.length; i++) {
        count += 1
        if (array[i] === item) return i;
    }
    return null
}

console.log(linearSearch(array, 4))
console.log('count = ', count)
