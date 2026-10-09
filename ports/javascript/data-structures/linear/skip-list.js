import { defaultCompare } from '../../shared/compare.js';
class SkipListNode {
    value;
    next;
    constructor(value, level) {
        this.value = value;
        this.next = new Array(level).fill(null);
    }
}
export class SkipList {
    compare;
    maxLevel;
    probability;
    head;
    level = 1;
    length = 0;
    constructor(compare = defaultCompare, maxLevel = 32, probability = 0.5) {
        this.compare = compare;
        this.maxLevel = maxLevel;
        this.probability = probability;
        this.head = new SkipListNode(undefined, maxLevel);
    }
    get size() {
        return this.length;
    }
    has(value) {
        const candidate = this.findPredecessors(value)[0].next[0];
        return !!candidate && this.compare(candidate.value, value) === 0;
    }
    insert(value) {
        const update = this.findPredecessors(value);
        const candidate = update[0].next[0];
        if (candidate && this.compare(candidate.value, value) === 0)
            return false;
        const level = this.randomLevel();
        if (level > this.level) {
            for (let i = this.level; i < level; i++)
                update[i] = this.head;
            this.level = level;
        }
        const node = new SkipListNode(value, level);
        for (let i = 0; i < level; i++) {
            node.next[i] = update[i].next[i] ?? null;
            update[i].next[i] = node;
        }
        this.length++;
        return true;
    }
    delete(value) {
        const update = this.findPredecessors(value);
        const target = update[0].next[0];
        if (!target || this.compare(target.value, value) !== 0)
            return false;
        for (let i = 0; i < this.level; i++) {
            if (update[i].next[i] !== target)
                break;
            update[i].next[i] = target.next[i] ?? null;
        }
        while (this.level > 1 && !this.head.next[this.level - 1])
            this.level--;
        this.length--;
        return true;
    }
    toArray() {
        return [...this];
    }
    *[Symbol.iterator]() {
        for (let node = this.head.next[0]; node; node = node.next[0])
            yield node.value;
    }
    findPredecessors(value) {
        const update = new Array(this.maxLevel);
        let node = this.head;
        for (let i = this.level - 1; i >= 0; i--) {
            let next = node.next[i];
            while (next && this.compare(next.value, value) < 0) {
                node = next;
                next = node.next[i];
            }
            update[i] = node;
        }
        return update;
    }
    randomLevel() {
        let level = 1;
        while (level < this.maxLevel && Math.random() < this.probability)
            level++;
        return level;
    }
}
