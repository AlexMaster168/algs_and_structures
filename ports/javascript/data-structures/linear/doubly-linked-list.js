export class DoublyLinkedListNode {
    value;
    prev = null;
    next = null;
    constructor(value) {
        this.value = value;
    }
}
export class DoublyLinkedList {
    head = null;
    tail = null;
    length = 0;
    static from(values) {
        const list = new DoublyLinkedList();
        for (const value of values)
            list.pushBack(value);
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
    pushBack(value) {
        const node = new DoublyLinkedListNode(value);
        node.prev = this.tail;
        if (this.tail)
            this.tail.next = node;
        else
            this.head = node;
        this.tail = node;
        this.length++;
        return node;
    }
    pushFront(value) {
        const node = new DoublyLinkedListNode(value);
        node.next = this.head;
        if (this.head)
            this.head.prev = node;
        else
            this.tail = node;
        this.head = node;
        this.length++;
        return node;
    }
    popBack() {
        if (!this.tail)
            return undefined;
        const node = this.tail;
        this.unlink(node);
        return node.value;
    }
    popFront() {
        if (!this.head)
            return undefined;
        const node = this.head;
        this.unlink(node);
        return node.value;
    }
    remove(value) {
        for (let node = this.head; node; node = node.next) {
            if (node.value === value) {
                this.unlink(node);
                return true;
            }
        }
        return false;
    }
    unlink(node) {
        if (node.prev)
            node.prev.next = node.next;
        else
            this.head = node.next;
        if (node.next)
            node.next.prev = node.prev;
        else
            this.tail = node.prev;
        node.prev = null;
        node.next = null;
        this.length--;
    }
    toArray() {
        return [...this];
    }
    *reversed() {
        for (let node = this.tail; node; node = node.prev)
            yield node.value;
    }
    *[Symbol.iterator]() {
        for (let node = this.head; node; node = node.next)
            yield node.value;
    }
}
