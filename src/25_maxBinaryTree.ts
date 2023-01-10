class BinaryTreeNode {
  val: number;
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;

  constructor(val: number) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// This function finds the maximum element in a binary tree
function findMaxElement(root: BinaryTreeNode | null): number | null {
  // Return null if the tree is empty
  if (!root) {
    return null;
  }

  // Initialize the stack with the root node
  const stack: BinaryTreeNode[] = [root];

  // Initialize the maximum element with the root node's value
  let maxElement = root.val;

  // Keep a reference to the current node
  let curr: BinaryTreeNode | null = root;

  // While there are nodes in the stack
  while (stack.length > 0) {
    // If the current node has a left child, push it to the stack and update the current node
    if (curr!.left) {
      stack.push(curr!.left);
      curr = curr!.left;
    }
    // If the current node doesn't have a left child, pop it from the stack and update the current node with the top element of the stack
    else {
      curr = stack.pop();
      // Update the maximum element if the current node's value is greater than the maximum element
      if (curr!.val > maxElement) {
        maxElement = curr!.val;
      }
      // If the current node has a right child, push it to the stack and update the current node
      if (curr!.right) {
        stack.push(curr!.right);
        curr = curr!.right;
      }
      // If the current node doesn't have a right child, set the current node to null to exit the loop
      else {
        curr = null;
      }
    }
  }

  // Return the maximum element
  return maxElement;
}

// Example usage:

// Create a binary tree
const root = new BinaryTreeNode(10);
root.left = new BinaryTreeNode(5);
root.right = new BinaryTreeNode(15);
root.left.left = new BinaryTreeNode(2);
root.left.right = new BinaryTreeNode(7);
root.right.left = new BinaryTreeNode(12);
root.right.right = new BinaryTreeNode(20);

// Find the maximum element in the binary tree
const maxElement = findMaxElement(root);

console.log(maxElement); // 20
