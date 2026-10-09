export class Queue {
    items = [];
    head = 0;
    get size() {
        return this.items.length - this.head;
    }
    isEmpty() {
        return this.size === 0;
    }
    enqueue(value) {
        this.items.push(value);
        return this;
    }
    dequeue() {
        if (this.isEmpty())
            return undefined;
        const value = this.items[this.head++];
        if (this.head * 2 >= this.items.length) {
            this.items = this.items.slice(this.head);
            this.head = 0;
        }
        return value;
    }
    peek() {
        return this.isEmpty() ? undefined : this.items[this.head];
    }
    toArray() {
        return [...this];
    }
    *[Symbol.iterator]() {
        for (let i = this.head; i < this.items.length; i++)
            yield this.items[i];
    }
}
