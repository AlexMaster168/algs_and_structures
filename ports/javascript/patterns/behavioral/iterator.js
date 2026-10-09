export class NumberRange {
    start;
    end;
    step;
    constructor(start, end, step = 1) {
        this.start = start;
        this.end = end;
        this.step = step;
        if (step === 0)
            throw new RangeError('Step must not be zero');
    }
    createIterator() {
        let current = this.start;
        const { end, step } = this;
        return {
            hasNext: () => (step > 0 ? current < end : current > end),
            next: () => {
                const value = current;
                current += step;
                return value;
            },
        };
    }
    *[Symbol.iterator]() {
        const iterator = this.createIterator();
        while (iterator.hasNext())
            yield iterator.next();
    }
}
export function* depthFirst(roots) {
    for (const root of roots) {
        yield root.value;
        yield* depthFirst(root.children ?? []);
    }
}
export function* breadthFirst(roots) {
    const queue = [...roots];
    for (let head = 0; head < queue.length; head++) {
        const item = queue[head];
        yield item.value;
        queue.push(...(item.children ?? []));
    }
}
export function* take(source, count) {
    if (count <= 0)
        return;
    for (const item of source) {
        yield item;
        if (--count === 0)
            return;
    }
}
