export class DisjointSet {
    parent;
    sizes;
    sets;
    constructor(size) {
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.sizes = new Array(size).fill(1);
        this.sets = size;
    }
    get count() {
        return this.sets;
    }
    find(x) {
        let root = x;
        while (this.parent[root] !== root)
            root = this.parent[root];
        while (this.parent[x] !== root) {
            const next = this.parent[x];
            this.parent[x] = root;
            x = next;
        }
        return root;
    }
    union(a, b) {
        let rootA = this.find(a);
        let rootB = this.find(b);
        if (rootA === rootB)
            return false;
        if (this.sizes[rootA] < this.sizes[rootB])
            [rootA, rootB] = [rootB, rootA];
        this.parent[rootB] = rootA;
        this.sizes[rootA] += this.sizes[rootB];
        this.sets--;
        return true;
    }
    connected(a, b) {
        return this.find(a) === this.find(b);
    }
    sizeOf(x) {
        return this.sizes[this.find(x)];
    }
}
