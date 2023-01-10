class LinkedList {
  private head: Node | null = null;
  private length: number = 0;

  constructor() {}

  public getLength(): number {
    return this.length;
  }

  public isEmpty(): boolean {
    return this.length === 0;
  }

  public getHead(): Node | null {
    return this.head;
  }

  public addToHead(value: any): void {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head = newNode;
    this.length++;
  }

  public removeFromHead(): any {
    if (this.isEmpty()) return null;

    const value = this.head!.value;
    this.head = this.head!.next;
    this.length--;
    return value;
  }

  public find(value: any): Node | null {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  public remove(value: any): void {
    if (this.isEmpty()) return;

    if (this.head!.value === value) {
      this.removeFromHead();
      return;
    }

    let current = this.head!.next;
    let previous = this.head;
    while (current) {
      if (current.value === value) {
        previous!.next = current.next;
        this.length--;
        return;
      }
      previous = current;
      current = current.next;
    }
  }
}

class Node {
  public next: Node | null = null;
  public value: any;

  constructor(value: any) {
    this.value = value;
  }
}
