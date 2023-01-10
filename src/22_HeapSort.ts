function heapSort(arr: number[]): number[] {
  const heap = new Heap(arr);
  return heap.heapSort();
}
