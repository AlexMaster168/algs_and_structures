function sieve(n: number): number[] {
  const numbers = Array.from(Array(n - 1).keys()).map(i => i + 2);

  for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];

    if (number != null) {
      for (let j = 2 * number; j <= n; j += number) {
        numbers[j - 2] = null;
      }
    }
  }

  return numbers.filter(n => n != null);
}

console.log(sieve(20)); // outputs [2, 3, 5, 7, 11, 13, 17, 19]
