class SqrtDecomposition {
  blocks: number[][];
  blockSize: number;

  constructor(array: number[]) {
    this.blockSize = Math.floor(Math.sqrt(array.length));
    this.blocks = [];

    let i = 0;
    while (i < array.length) {
      this.blocks.push(array.slice(i, i + this.blockSize));
      i += this.blockSize;
    }
  }

  update(index: number, value: number) {
    const blockIndex = Math.floor(index / this.blockSize);
    this.blocks[blockIndex][index % this.blockSize] = value;
  }

  query(left: number, right: number) {
    let sum = 0;
    const leftBlockIndex = Math.floor(left / this.blockSize);
    const rightBlockIndex = Math.floor(right / this.blockSize);

    if (leftBlockIndex === rightBlockIndex) {
      for (let i = left; i <= right; i++) {
        sum += this.blocks[leftBlockIndex][i % this.blockSize];
      }
      return sum;
    }

    for (let i = left; i < (leftBlockIndex + 1) * this.blockSize; i++) {
      sum += this.blocks[leftBlockIndex][i % this.blockSize];
    }

    for (let i = leftBlockIndex + 1; i < rightBlockIndex; i++) {
      sum += this.blocks[i].reduce((a, b) => a + b, 0);
    }

    for (let i = rightBlockIndex * this.blockSize; i <= right; i++) {
      sum += this.blocks[rightBlockIndex][i % this.blockSize];
    }

    return sum;
  }
}
