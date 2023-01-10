class SparseTable {
  table: number[][];
  log2: number[];

  constructor(array: number[]) {
    const n = array.length;
    this.log2 = new Array(n + 1).fill(0);
    for (let i = 2; i <= n; i++) {
      this.log2[i] = this.log2[i >> 1] + 1;
    }

    this.table = new Array(n);
    for (let i = 0; i < n; i++) {
      this.table[i] = new Array(this.log2[n] + 1).fill(0);
      this.table[i][0] = array[i];
    }

    for (let j = 1; j <= this.log2[n]; j++) {
      for (let i = 0; i + (1 << j) - 1 < n; i++) {
        this.table[i][j] = Math.min(
          this.table[i][j - 1],
          this.table[i + (1 << (j - 1))][j - 1]
        );
      }
    }
  }

  query(left: number, right: number) {
    const k = this.log2[right - left + 1];
    return Math.min(
      this.table[left][k],
      this.table[right - (1 << k) + 1][k]
    );
  }
}
