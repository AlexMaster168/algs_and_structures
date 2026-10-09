class TrieNode {
    children = new Map();
    isWord = false;
    passCount = 0;
}
export class Trie {
    root = new TrieNode();
    count = 0;
    static from(words) {
        const trie = new Trie();
        for (const word of words)
            trie.insert(word);
        return trie;
    }
    get size() {
        return this.count;
    }
    insert(word) {
        if (this.has(word))
            return false;
        let node = this.root;
        node.passCount++;
        for (const char of word) {
            let next = node.children.get(char);
            if (!next) {
                next = new TrieNode();
                node.children.set(char, next);
            }
            next.passCount++;
            node = next;
        }
        node.isWord = true;
        this.count++;
        return true;
    }
    has(word) {
        return this.walk(word)?.isWord ?? false;
    }
    startsWith(prefix) {
        return this.walk(prefix) !== undefined;
    }
    countWithPrefix(prefix) {
        return this.walk(prefix)?.passCount ?? 0;
    }
    wordsWithPrefix(prefix) {
        const node = this.walk(prefix);
        if (!node)
            return [];
        const words = [];
        const collect = (current, path) => {
            if (current.isWord)
                words.push(path);
            for (const [char, child] of [...current.children].sort(([a], [b]) => (a < b ? -1 : 1))) {
                collect(child, path + char);
            }
        };
        collect(node, prefix);
        return words;
    }
    delete(word) {
        if (!this.has(word))
            return false;
        let node = this.root;
        node.passCount--;
        for (const char of word) {
            const next = node.children.get(char);
            if (--next.passCount === 0) {
                node.children.delete(char);
                this.count--;
                return true;
            }
            node = next;
        }
        node.isWord = false;
        this.count--;
        return true;
    }
    walk(prefix) {
        let node = this.root;
        for (const char of prefix) {
            node = node.children.get(char);
            if (!node)
                return undefined;
        }
        return node;
    }
}
