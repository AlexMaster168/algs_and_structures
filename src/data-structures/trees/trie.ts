class TrieNode {
  readonly children = new Map<string, TrieNode>();
  isWord = false;
  passCount = 0;
}

export class Trie {
  private readonly root = new TrieNode();
  private count = 0;

  static from(words: Iterable<string>): Trie {
    const trie = new Trie();
    for (const word of words) trie.insert(word);
    return trie;
  }

  get size(): number {
    return this.count;
  }

  insert(word: string): boolean {
    if (this.has(word)) return false;

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

  has(word: string): boolean {
    return this.walk(word)?.isWord ?? false;
  }

  startsWith(prefix: string): boolean {
    return this.walk(prefix) !== undefined;
  }

  countWithPrefix(prefix: string): number {
    return this.walk(prefix)?.passCount ?? 0;
  }

  wordsWithPrefix(prefix: string): string[] {
    const node = this.walk(prefix);
    if (!node) return [];

    const words: string[] = [];
    const collect = (current: TrieNode, path: string): void => {
      if (current.isWord) words.push(path);
      for (const [char, child] of [...current.children].sort(([a], [b]) => (a < b ? -1 : 1))) {
        collect(child, path + char);
      }
    };

    collect(node, prefix);
    return words;
  }

  delete(word: string): boolean {
    if (!this.has(word)) return false;

    let node = this.root;
    node.passCount--;
    for (const char of word) {
      const next = node.children.get(char)!;
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

  private walk(prefix: string): TrieNode | undefined {
    let node: TrieNode | undefined = this.root;
    for (const char of prefix) {
      node = node.children.get(char);
      if (!node) return undefined;
    }
    return node;
  }
}
