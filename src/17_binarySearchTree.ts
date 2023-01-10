class BinarySearchTree {
  private root: Node | null = null;

  constructor() {}

  public insert(value: number): void {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  private insertNode(node: Node, newNode: Node): void {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  public search(value: number): boolean {
    return this.searchNode(this.root, value);
  }

  private searchNode(node: Node | null, value: number): boolean {
    if (node === null) {
      return false;
    }

    if (value < node.value) {
      return this.searchNode(node.left, value);
    } else if (value > node.value) {
      return this.searchNode(node.right, value);
    } else {
      return true;
    }
  }
}

class Node {
  public left: Node | null = null;
  public right: Node | null = null;
  public value: number;

  constructor(value: number) {
    this.value = value;
  }
}
