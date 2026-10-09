import { defaultHasher } from './hash.js';
export class HashTable {
    hasher;
    maxLoadFactor;
    buckets;
    count = 0;
    constructor(hasher = defaultHasher, initialCapacity = 16, maxLoadFactor = 0.75) {
        this.hasher = hasher;
        this.maxLoadFactor = maxLoadFactor;
        this.buckets = HashTable.createBuckets(Math.max(1, initialCapacity));
    }
    get size() {
        return this.count;
    }
    get capacity() {
        return this.buckets.length;
    }
    set(key, value) {
        const bucket = this.bucketFor(key);
        const entry = bucket.find(([k]) => k === key);
        if (entry) {
            entry[1] = value;
            return this;
        }
        bucket.push([key, value]);
        this.count++;
        if (this.count / this.buckets.length > this.maxLoadFactor)
            this.resize(this.buckets.length * 2);
        return this;
    }
    get(key) {
        return this.bucketFor(key).find(([k]) => k === key)?.[1];
    }
    has(key) {
        return this.bucketFor(key).some(([k]) => k === key);
    }
    delete(key) {
        const bucket = this.bucketFor(key);
        const index = bucket.findIndex(([k]) => k === key);
        if (index === -1)
            return false;
        bucket.splice(index, 1);
        this.count--;
        return true;
    }
    clear() {
        this.buckets = HashTable.createBuckets(this.buckets.length);
        this.count = 0;
    }
    *keys() {
        for (const [key] of this)
            yield key;
    }
    *values() {
        for (const [, value] of this)
            yield value;
    }
    *[Symbol.iterator]() {
        for (const bucket of this.buckets)
            for (const [key, value] of bucket)
                yield [key, value];
    }
    bucketFor(key) {
        return this.buckets[this.hasher(key) % this.buckets.length];
    }
    resize(capacity) {
        const entries = [...this];
        this.buckets = HashTable.createBuckets(capacity);
        for (const [key, value] of entries)
            this.bucketFor(key).push([key, value]);
    }
    static createBuckets(capacity) {
        return Array.from({ length: capacity }, () => []);
    }
}
