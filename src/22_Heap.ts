class Heap {
  private heap: number[] = [];

  constructor(values: number[] = []) {
    this.heap = values;
    this.buildHeap();
  }

  public getLength(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public insert(value: number): void {
    this.heap.push(value);
    this.bubbleUp();
  }

  public extractRoot(): number | null {
    if (this.isEmpty()) return null;
    if (this.getLength() === 1) return this.heap.pop()!;

    const root = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown();
    return root;
  }

  public heapSort(): number[] {
    const sorted: number[] = [];
    while (!this.isEmpty()) {
      sorted.push(this.extractRoot()!);
    }
    return sorted;
  }

  private buildHeap(): void {
    for (let i = Math.floor(this.getLength() / 2); i >= 0; i--) {
      this.bubbleDown(i);
    }
