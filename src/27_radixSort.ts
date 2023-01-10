function radixSort(arr: number[]): number[] {
  let maxDigits = getMaxDigits(arr);

  for (let i = 0; i < maxDigits; i++) {
    let buckets: number[][] = Array.from({ length: 10 }, () => []);

    for (let j = 0; j < arr.length; j++) {
      let digit = getDigit(arr[j], i);
      buckets[digit].push(arr[j]);
    }

    arr = [].concat(...buckets);
  }

  return arr;
}

function getDigit(num: number, place: number): number {
  return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
}

function getMaxDigits(nums: number[]): number {
  let maxDigits = 0;

  for (let i = 0; i < nums.length; i++) {
    maxDigits = Math.max(maxDigits, getNumDigits(nums[i]));
  }

  return maxDigits;
}

function getNumDigits(num: number): number {
  if (num === 0) return 1;
  return Math.floor(Math.log10(Math.abs(num))) + 1;
}
