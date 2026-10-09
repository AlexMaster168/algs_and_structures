export class SqrtDecomposition {
    values;
    blockSums;
    blockSize;
    constructor(values) {
        this.values = [...values];
        this.blockSize = Math.max(1, Math.ceil(Math.sqrt(values.length)));
        this.blockSums = new Array(Math.ceil(values.length / this.blockSize)).fill(0);
        this.values.forEach((value, i) => (this.blockSums[Math.floor(i / this.blockSize)] += value));
    }
    update(index, value) {
        this.blockSums[Math.floor(index / this.blockSize)] += value - this.values[index];
        this.values[index] = value;
    }
    rangeSum(left, right) {
        let sum = 0;
        let i = left;
        while (i <= right && i % this.blockSize !== 0)
            sum += this.values[i++];
        while (i + this.blockSize - 1 <= right) {
            sum += this.blockSums[i / this.blockSize];
            i += this.blockSize;
        }
        while (i <= right)
            sum += this.values[i++];
        return sum;
    }
}
