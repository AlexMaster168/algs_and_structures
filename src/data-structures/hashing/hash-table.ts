import { defaultHasher } from './hash.js';

type Bucket<K, V> = [key: K, value: V][];

export class HashTable<K, V> implements Iterable<[K, V]> {
  private buckets: Bucket<K, V>[];
  private count = 0;

  constructor(
    private readonly hasher: (key: K) => number = defaultHasher,
    initialCapacity = 16,
    private readonly maxLoadFactor = 0.75,
  ) {
    this.buckets = HashTable.createBuckets(Math.max(1, initialCapacity));
  }

  get size(): number {
    return this.count;
  }

  get capacity(): number {
    return this.buckets.length;
  }

  set(key: K, value: V): this {
    const bucket = this.bucketFor(key);
    const entry = bucket.find(([k]) => k === key);

    if (entry) {
      entry[1] = value;
      return this;
    }

    bucket.push([key, value]);
    this.count++;
    if (this.count / this.buckets.length > this.maxLoadFactor) this.resize(this.buckets.length * 2);
    return this;
  }

  get(key: K): V | undefined {
    return this.bucketFor(key).find(([k]) => k === key)?.[1];
  }

  has(key: K): boolean {
    return this.bucketFor(key).some(([k]) => k === key);
  }

  delete(key: K): boolean {
    const bucket = this.bucketFor(key);
    const index = bucket.findIndex(([k]) => k === key);
    if (index === -1) return false;
    bucket.splice(index, 1);
    this.count--;
    return true;
  }

  clear(): void {
    this.buckets = HashTable.createBuckets(this.buckets.length);
    this.count = 0;
  }

  *keys(): Generator<K> {
    for (const [key] of this) yield key;
  }

  *values(): Generator<V> {
    for (const [, value] of this) yield value;
  }

  *[Symbol.iterator](): Generator<[K, V]> {
    for (const bucket of this.buckets) for (const [key, value] of bucket) yield [key, value];
  }

  private bucketFor(key: K): Bucket<K, V> {
    return this.buckets[this.hasher(key) % this.buckets.length]!;
  }

  private resize(capacity: number): void {
    const entries = [...this];
    this.buckets = HashTable.createBuckets(capacity);
    for (const [key, value] of entries) this.bucketFor(key).push([key, value]);
  }

  private static createBuckets<K, V>(capacity: number): Bucket<K, V>[] {
    return Array.from({ length: capacity }, () => []);
  }
}
