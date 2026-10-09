export class LinkedListNode {
    value;
    next = null;
    constructor(value) {
        this.value = value;
    }
}
export class LinkedList {
    head = null;
    tail = null;
    length = 0;
    static from(values) {
        const list = new LinkedList();
        for (const value of values)
            list.append(value);
        return list;
    }
    get size() {
        return this.length;
    }
    get first() {
        return this.head?.value;
    }
    get last() {
        return this.tail?.value;
    }
    append(value) {
        const node = new LinkedListNode(value);
        if (this.tail)
            this.tail.next = node;
        else
            this.head = node;
        this.tail = node;
        this.length++;
        return this;
    }
    prepend(value) {
        const node = new LinkedListNode(value);
        node.next = this.head;
        this.head = node;
        if (!this.tail)
            this.tail = node;
        this.length++;
        return this;
    }
    insertAt(index, value) {
        if (index < 0 || index > this.length)
            throw new RangeError(`Index ${index} is out of bounds`);
        if (index === 0)
            return this.prepend(value);
        if (index === this.length)
            return this.append(value);
        const previous = this.nodeAt(index - 1);
        const node = new LinkedListNode(value);
        node.next = previous.next;
        previous.next = node;
        this.length++;
        return this;
    }
    get(index) {
        if (index < 0 || index >= this.length)
            return undefined;
        return this.nodeAt(index).value;
    }
    indexOf(value) {
        let index = 0;
        for (let node = this.head; node; node = node.next, index++) {
            if (node.value === value)
                return index;
        }
        return -1;
    }
    find(predicate) {
        for (const value of this)
            if (predicate(value))
                return value;
        return undefined;
    }
    removeAt(index) {
        if (index < 0 || index >= this.length)
            return undefined;
        let removed;
        if (index === 0) {
            removed = this.head;
            this.head = removed.next;
            if (!this.head)
                this.tail = null;
        }
        else {
            const previous = this.nodeAt(index - 1);
            removed = previous.next;
            previous.next = removed.next;
            if (removed === this.tail)
                this.tail = previous;
        }
        this.length--;
        return removed.value;
    }
    remove(value) {
        const index = this.indexOf(value);
        if (index === -1)
            return false;
        this.removeAt(index);
        return true;
    }
    reverse() {
        let previous = null;
        let current = this.head;
        this.tail = current;
        while (current) {
            const next = current.next;
            current.next = previous;
            previous = current;
            current = next;
        }
        this.head = previous;
        return this;
    }
    toArray() {
        return [...this];
    }
    *[Symbol.iterator]() {
        for (let node = this.head; node; node = node.next)
            yield node.value;
    }
    nodeAt(index) {
        let node = this.head;
        for (let i = 0; i < index; i++)
            node = node.next;
        return node;
    }
}
