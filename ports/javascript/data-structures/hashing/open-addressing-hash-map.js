import { defaultHasher } from './hash.js';
const EMPTY = Symbol('empty');
const DELETED = Symbol('deleted');
export class OpenAddressingHashMap {
    hasher;
    slots;
    count = 0;
    tombstones = 0;
    constructor(hasher = defaultHasher, initialCapacity = 16) {
        this.hasher = hasher;
        this.slots = new Array(Math.max(2, initialCapacity)).fill(EMPTY);
    }
    get size() {
        return this.count;
    }
    set(key, value) {
        if ((this.count + this.tombstones + 1) * 2 > this.slots.length)
            this.resize(this.slots.length * 2);
        let index = this.indexFor(key);
        let firstDeleted = -1;
        while (true) {
            const slot = this.slots[index];
            if (slot === EMPTY)
                break;
            if (slot === DELETED) {
                if (firstDeleted === -1)
                    firstDeleted = index;
            }
            else if (slot.key === key) {
                slot.value = value;
                return this;
            }
            index = (index + 1) % this.slots.length;
        }
        if (firstDeleted !== -1) {
            index = firstDeleted;
            this.tombstones--;
        }
        this.slots[index] = { key, value };
        this.count++;
        return this;
    }
    get(key) {
        const index = this.find(key);
        if (index === -1)
            return undefined;
        return this.slots[index].value;
    }
    has(key) {
        return this.find(key) !== -1;
    }
    delete(key) {
        const index = this.find(key);
        if (index === -1)
            return false;
        this.slots[index] = DELETED;
        this.count--;
        this.tombstones++;
        return true;
    }
    *[Symbol.iterator]() {
        for (const slot of this.slots) {
            if (slot !== EMPTY && slot !== DELETED)
                yield [slot.key, slot.value];
        }
    }
    find(key) {
        let index = this.indexFor(key);
        for (let probes = 0; probes < this.slots.length; probes++) {
            const slot = this.slots[index];
            if (slot === EMPTY)
                return -1;
            if (slot !== DELETED && slot.key === key)
                return index;
            index = (index + 1) % this.slots.length;
        }
        return -1;
    }
    indexFor(key) {
        return this.hasher(key) % this.slots.length;
    }
    resize(capacity) {
        const entries = [...this];
        this.slots = new Array(capacity).fill(EMPTY);
        this.count = 0;
        this.tombstones = 0;
        for (const [key, value] of entries)
            this.set(key, value);
    }
}
