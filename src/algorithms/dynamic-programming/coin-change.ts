export const minCoins = (coins: readonly number[], amount: number): { count: number; coins: number[] } | null => {
  const best = new Array<number>(amount + 1).fill(Infinity);
  const lastCoin = new Array<number>(amount + 1).fill(-1);
  best[0] = 0;

  for (let sum = 1; sum <= amount; sum++) {
    for (const coin of coins) {
      if (coin <= sum && best[sum - coin]! + 1 < best[sum]!) {
        best[sum] = best[sum - coin]! + 1;
        lastCoin[sum] = coin;
      }
    }
  }

  if (best[amount] === Infinity) return null;

  const used: number[] = [];
  for (let sum = amount; sum > 0; sum -= lastCoin[sum]!) used.push(lastCoin[sum]!);
  return { count: best[amount]!, coins: used };
};

export const coinChangeWays = (coins: readonly number[], amount: number): number => {
  const ways = new Array<number>(amount + 1).fill(0);
  ways[0] = 1;
  for (const coin of coins) {
    for (let sum = coin; sum <= amount; sum++) ways[sum]! += ways[sum - coin]!;
  }
  return ways[amount]!;
};
