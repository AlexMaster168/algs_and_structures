class BinaryTree {
  root: TreeNode | null = null;

  add(value: number) {
    if (!this.root) {
      this.root = new TreeNode(value);
    } else {
      let node = this.root;
      let newNode = new TreeNode(value);
      while (node) {
        if (value > node.value) {
          if (!node.right) break;
          node = node.right;
        } else {
          if (!node.left) break;
          node = node.left;
        }
      }
      if (value > node.value) node.right = newNode;
      else node.left = newNode;
    }
  }

  print(root: TreeNode | null = this.root) {
    if (!root) return true;
    console.log(root.value);
    this.print(root.left);
    this.print(root.right);
  }
}

class TreeNode {
  constructor(public value: number) {}
  left: TreeNode | null = null;
  right: TreeNode | null = null;
}

const tree = new BinaryTree();
tree.add(5);
tree.add(2);
tree.add(6);
tree.add(2);
tree.add(1);
tree.print();
