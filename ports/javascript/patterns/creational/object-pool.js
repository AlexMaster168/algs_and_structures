export class ObjectPool {
    create;
    reset;
    maxSize;
    available = [];
    inUse = new Set();
    constructor(create, reset = () => { }, maxSize = Infinity) {
        this.create = create;
        this.reset = reset;
        this.maxSize = maxSize;
    }
    get availableCount() {
        return this.available.length;
    }
    get inUseCount() {
        return this.inUse.size;
    }
    acquire() {
        let item = this.available.pop();
        if (item === undefined) {
            if (this.inUse.size >= this.maxSize)
                throw new Error('Pool is exhausted');
            item = this.create();
        }
        this.inUse.add(item);
        return item;
    }
    release(item) {
        if (!this.inUse.delete(item))
            throw new Error('Item does not belong to this pool');
        this.reset(item);
        this.available.push(item);
    }
    use(work) {
        const item = this.acquire();
        try {
            return work(item);
        }
        finally {
            this.release(item);
        }
    }
}
