class Node {
  constructor(public data: any, public next: Node | null = null) {}
}

class LinkedList {
  head: Node | null = null;
  tail: Node | null = null;

  append(data: any) {
    const node = new Node(data);

    if (this.tail) {
      this.tail.next = node;
    }

    if (!this.head) {
      this.head = node;
    }

    this.tail = node;
  }

  prepend(data: any) {
    const node = new Node(data, this.head);

    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }
  }

  insertAfter(after: any, data: any) {
    const found = this.find(after);

    if (!found) {
      return;
    }

    found.next = new Node(data, found.next);
  }

  find(data: any) {
    if (!this.head) {
      return;
    }

    let current = this.head;
    while (current) {
      if (current.data === data) {
        return current;
      }
      current = current.next;
    }
  }

  toArray() {
    const output: any[] = [];
    let current = this.head;

    while (current) {
      output.push(current);
      current = current.next;
    }

    return output;
  }

  remove(data: any) {
    if (!this.head) {
      return;
    }

    while (this.head && this.head.data === data) {
      this.head = this.head.next;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.data === data) {
        current.next = current.next.next;
      } else {
        current = current.next;
      }
    }

    if (this.tail.data === data) {
      this.tail = current;
    }
  }
}

const list = new LinkedList();

list.prepend("Hi");
list.append("My");
list.append("name");
list.append("Slim");
list.append("Shady");

list.insertAfter("name", "is");

list.prepend(42);
list.append(24);

list.remove(42);
list.remove(24);
console.log(list.toArray());
