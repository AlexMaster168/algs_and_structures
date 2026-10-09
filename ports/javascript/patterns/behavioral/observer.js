export class Subject {
    observers = new Set();
    get observerCount() {
        return this.observers.size;
    }
    subscribe(observer) {
        this.observers.add(observer);
        return () => this.observers.delete(observer);
    }
    notify(value) {
        for (const observer of [...this.observers])
            observer(value);
    }
}
export class StockTicker {
    changes = new Subject();
    prices = new Map();
    update(symbol, price) {
        const previous = this.prices.get(symbol) ?? price;
        this.prices.set(symbol, price);
        this.changes.notify({ symbol, price, change: price - previous });
    }
}
export class BehaviorSubject extends Subject {
    current;
    constructor(current) {
        super();
        this.current = current;
    }
    get value() {
        return this.current;
    }
    subscribe(observer) {
        observer(this.current);
        return super.subscribe(observer);
    }
    notify(value) {
        this.current = value;
        super.notify(value);
    }
}
