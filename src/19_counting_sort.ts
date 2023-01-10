function countingSort(arr: number[], maxValue: number): number[] {
  const counts: number[] = new Array(maxValue + 1).fill(0);

  for (let i = 0; i < arr.length; i++) {
    counts[arr[i]]++;
  }

  const sorted: number[] = [];
  for (let i = 0; i < counts.length; i++) {
    for (let j = 0; j < counts[i]; j++) {
      sorted.push(i);
    }
  }

  return sorted;
}
