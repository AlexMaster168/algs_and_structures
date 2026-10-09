export class DisjointSet {
  constructor(size) {
    if (!Number.isInteger(size) || size < 0) throw new RangeError('Invalid size');
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.sizes = Array(size).fill(1);
  }

  find(value) {
    if (!Number.isInteger(value) || value < 0 || value >= this.parent.length) throw new RangeError('Invalid index');
    while (value !== this.parent[value]) {
      this.parent[value] = this.parent[this.parent[value]];
      value = this.parent[value];
    }
    return value;
  }

  union(a, b) {
    a = this.find(a);
    b = this.find(b);
    if (a === b) return false;
    if (this.sizes[a] < this.sizes[b]) [a, b] = [b, a];
    this.parent[b] = a;
    this.sizes[a] += this.sizes[b];
    return true;
  }
}
