export function binarySearch(values, target) {
  let left = 0, right = values.length;
  while (left < right) {
    const middle = left + Math.floor((right - left) / 2);
    if (values[middle] < target) left = middle + 1;
    else right = middle;
  }
  return left < values.length && values[left] === target ? left : -1;
}
