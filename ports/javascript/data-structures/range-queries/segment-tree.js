export class SegmentTree {
    combine;
    identity;
    n;
    tree;
    constructor(values, combine, identity) {
        this.combine = combine;
        this.identity = identity;
        this.n = values.length;
        this.tree = new Array(2 * this.n).fill(identity);
        for (let i = 0; i < this.n; i++)
            this.tree[this.n + i] = values[i];
        for (let i = this.n - 1; i > 0; i--)
            this.tree[i] = combine(this.tree[2 * i], this.tree[2 * i + 1]);
    }
    get size() {
        return this.n;
    }
    get(index) {
        this.assertIndex(index);
        return this.tree[this.n + index];
    }
    update(index, value) {
        this.assertIndex(index);
        let position = this.n + index;
        this.tree[position] = value;
        for (position >>= 1; position > 0; position >>= 1) {
            this.tree[position] = this.combine(this.tree[2 * position], this.tree[2 * position + 1]);
        }
    }
    query(left, right) {
        if (left < 0 || right >= this.n || left > right)
            throw new RangeError(`Invalid range [${left}, ${right}]`);
        let resultLeft = this.identity;
        let resultRight = this.identity;
        for (let l = left + this.n, r = right + this.n + 1; l < r; l >>= 1, r >>= 1) {
            if (l & 1)
                resultLeft = this.combine(resultLeft, this.tree[l++]);
            if (r & 1)
                resultRight = this.combine(this.tree[--r], resultRight);
        }
        return this.combine(resultLeft, resultRight);
    }
    assertIndex(index) {
        if (index < 0 || index >= this.n)
            throw new RangeError(`Index ${index} is out of bounds`);
    }
}
export const sumSegmentTree = (values) => new SegmentTree(values, (a, b) => a + b, 0);
export const minSegmentTree = (values) => new SegmentTree(values, Math.min, Infinity);
export const maxSegmentTree = (values) => new SegmentTree(values, Math.max, -Infinity);
