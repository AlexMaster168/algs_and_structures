export class Stack {
    items = [];
    get size() {
        return this.items.length;
    }
    isEmpty() {
        return this.items.length === 0;
    }
    push(value) {
        this.items.push(value);
        return this;
    }
    pop() {
        return this.items.pop();
    }
    peek() {
        return this.items[this.items.length - 1];
    }
    toArray() {
        return [...this];
    }
    *[Symbol.iterator]() {
        for (let i = this.items.length - 1; i >= 0; i--)
            yield this.items[i];
    }
}
