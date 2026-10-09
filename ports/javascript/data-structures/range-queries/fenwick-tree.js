export class FenwickTree {
    tree;
    constructor(sizeOrValues) {
        if (typeof sizeOrValues === 'number') {
            this.tree = new Array(sizeOrValues + 1).fill(0);
            return;
        }
        const n = sizeOrValues.length;
        this.tree = [0, ...sizeOrValues];
        for (let i = 1; i <= n; i++) {
            const parent = i + (i & -i);
            if (parent <= n)
                this.tree[parent] += this.tree[i];
        }
    }
    get size() {
        return this.tree.length - 1;
    }
    add(index, delta) {
        for (let i = index + 1; i < this.tree.length; i += i & -i)
            this.tree[i] += delta;
    }
    set(index, value) {
        this.add(index, value - this.rangeSum(index, index));
    }
    prefixSum(index) {
        let sum = 0;
        for (let i = Math.min(index + 1, this.size); i > 0; i -= i & -i)
            sum += this.tree[i];
        return sum;
    }
    rangeSum(left, right) {
        return this.prefixSum(right) - (left > 0 ? this.prefixSum(left - 1) : 0);
    }
}
