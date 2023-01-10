class PrefixTree {
  private root: PrefixTreeNode = new PrefixTreeNode();

  constructor() {}

  public insert(str: string): void {
    let current = this.root;
    for (const char of str) {
      if (!current.children.has(char)) {
        current.children.set(char, new PrefixTreeNode());
      }
      current = current.children.get(char)!;
    }
    current.isEndOfWord = true;
  }

  public search(str: string): boolean {
    let current = this.root;
    for (const char of str) {
      if (!current.children.has(char)) {
        return false;
      }
      current = current.children.get(char)!;
    }
    return current.isEndOfWord;
  }
}

class PrefixTreeNode {
  public children: Map<string, PrefixTreeNode> = new Map();
  public isEndOfWord: boolean = false;

  constructor() {}
}
