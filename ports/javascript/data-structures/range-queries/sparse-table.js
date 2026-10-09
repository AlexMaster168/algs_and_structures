export class SparseTable {
    combine;
    table;
    log;
    constructor(values, combine) {
        this.combine = combine;
        const n = values.length;
        this.log = new Array(n + 1).fill(0);
        for (let i = 2; i <= n; i++)
            this.log[i] = this.log[i >> 1] + 1;
        this.table = [[...values]];
        for (let level = 1; 1 << level <= n; level++) {
            const previous = this.table[level - 1];
            const half = 1 << (level - 1);
            const row = [];
            for (let i = 0; i + (1 << level) <= n; i++)
                row.push(combine(previous[i], previous[i + half]));
            this.table.push(row);
        }
    }
    query(left, right) {
        if (left < 0 || right >= this.table[0].length || left > right) {
            throw new RangeError(`Invalid range [${left}, ${right}]`);
        }
        const level = this.log[right - left + 1];
        const row = this.table[level];
        return this.combine(row[left], row[right - (1 << level) + 1]);
    }
}
export const minSparseTable = (values) => new SparseTable(values, Math.min);
export const maxSparseTable = (values) => new SparseTable(values, Math.max);
