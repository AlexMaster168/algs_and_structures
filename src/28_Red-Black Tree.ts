class RedBlackTreeNode<T> {
  value: T;
  left: RedBlackTreeNode<T> | null = null;
  right: RedBlackTreeNode<T> | null = null;
  parent: RedBlackTreeNode<T> | null = null;
  color: 'red' | 'black' = 'red';

  constructor(value: T) {
    this.value = value;
  }
}

class RedBlackTree<T> {
  root: RedBlackTreeNode<T> | null = null;

  insert(value: T) {
    // Создаем новый узел
    const newNode = new RedBlackTreeNode(value);

    // Если дерево пустое, то новый узел становится корнем
    if (this.root === null) {
      this.root = newNode;
      newNode.color = 'black';
      return;
    }

    // Ищем место для вставки узла
    let currentNode: RedBlackTreeNode<T> | null = this.root;
    while (true) {
      if (value < currentNode.value) {
        if (currentNode.left === null) {
          currentNode.left = newNode;
          newNode.parent = currentNode;
          break;
        } else {
          currentNode = currentNode.left;
        }
      } else {
        if (currentNode.right === null) {
          currentNode.right = newNode;
          newNode.parent = currentNode;
          break;
        } else {
          currentNode = currentNode.right;
        }
      }
    }

    // Балансируем дерево
    this.balance(newNode);
  }

  delete(value: T) {
    // Ищем узел для удаления
    let currentNode: RedBlackTreeNode<T> | null = this.root;
    while (currentNode !== null) {
      if (value === currentNode.value) {
        break;
      }

      if (value < currentNode.value) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }

    // Если узел не найден, возвращаемся
    if (currentNode === null) {
      return;
    }

    // Удаляем узел
    this.removeNode(currentNode);
  }
