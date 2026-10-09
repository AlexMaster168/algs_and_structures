export class AhoCorasick {
    patterns;
    nodes = [{ next: new Map(), fail: 0, output: [] }];
    constructor(patterns) {
        this.patterns = patterns;
        patterns.forEach((pattern, index) => this.add(pattern, index));
        this.build();
    }
    search(text) {
        const matches = [];
        let state = 0;
        for (let i = 0; i < text.length; i++) {
            state = this.transition(state, text[i]);
            for (const patternIndex of this.nodes[state].output) {
                const pattern = this.patterns[patternIndex];
                matches.push({ pattern, index: i - pattern.length + 1 });
            }
        }
        return matches;
    }
    add(pattern, index) {
        if (pattern.length === 0)
            return;
        let state = 0;
        for (const char of pattern) {
            let next = this.nodes[state].next.get(char);
            if (next === undefined) {
                next = this.nodes.push({ next: new Map(), fail: 0, output: [] }) - 1;
                this.nodes[state].next.set(char, next);
            }
            state = next;
        }
        this.nodes[state].output.push(index);
    }
    build() {
        const queue = [...this.nodes[0].next.values()];
        for (let head = 0; head < queue.length; head++) {
            const state = queue[head];
            for (const [char, child] of this.nodes[state].next) {
                const fail = this.transition(this.nodes[state].fail, char);
                this.nodes[child].fail = fail;
                this.nodes[child].output.push(...this.nodes[fail].output);
                queue.push(child);
            }
        }
    }
    transition(state, char) {
        while (true) {
            const next = this.nodes[state].next.get(char);
            if (next !== undefined)
                return next;
            if (state === 0)
                return 0;
            state = this.nodes[state].fail;
        }
    }
}
