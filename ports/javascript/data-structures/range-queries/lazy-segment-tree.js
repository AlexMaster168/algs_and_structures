export class LazySegmentTree {
    n;
    sums;
    pending;
    constructor(values) {
        this.n = values.length;
        this.sums = new Array(4 * Math.max(1, this.n)).fill(0);
        this.pending = new Array(4 * Math.max(1, this.n)).fill(0);
        if (this.n > 0)
            this.build(1, 0, this.n - 1, values);
    }
    get size() {
        return this.n;
    }
    rangeAdd(left, right, delta) {
        this.assertRange(left, right);
        this.add(1, 0, this.n - 1, left, right, delta);
    }
    rangeSum(left, right) {
        this.assertRange(left, right);
        return this.sum(1, 0, this.n - 1, left, right);
    }
    build(node, start, end, values) {
        if (start === end) {
            this.sums[node] = values[start];
            return;
        }
        const mid = (start + end) >> 1;
        this.build(2 * node, start, mid, values);
        this.build(2 * node + 1, mid + 1, end, values);
        this.sums[node] = this.sums[2 * node] + this.sums[2 * node + 1];
    }
    apply(node, start, end, delta) {
        this.sums[node] += delta * (end - start + 1);
        this.pending[node] += delta;
    }
    push(node, start, end) {
        const delta = this.pending[node];
        if (delta === 0)
            return;
        const mid = (start + end) >> 1;
        this.apply(2 * node, start, mid, delta);
        this.apply(2 * node + 1, mid + 1, end, delta);
        this.pending[node] = 0;
    }
    add(node, start, end, left, right, delta) {
        if (right < start || end < left)
            return;
        if (left <= start && end <= right) {
            this.apply(node, start, end, delta);
            return;
        }
        this.push(node, start, end);
        const mid = (start + end) >> 1;
        this.add(2 * node, start, mid, left, right, delta);
        this.add(2 * node + 1, mid + 1, end, left, right, delta);
        this.sums[node] = this.sums[2 * node] + this.sums[2 * node + 1];
    }
    sum(node, start, end, left, right) {
        if (right < start || end < left)
            return 0;
        if (left <= start && end <= right)
            return this.sums[node];
        this.push(node, start, end);
        const mid = (start + end) >> 1;
        return this.sum(2 * node, start, mid, left, right) + this.sum(2 * node + 1, mid + 1, end, left, right);
    }
    assertRange(left, right) {
        if (left < 0 || right >= this.n || left > right)
            throw new RangeError(`Invalid range [${left}, ${right}]`);
    }
}
