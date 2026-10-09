pub fn min_coins(coins: &[usize], amount: usize) -> Option<(usize, Vec<usize>)> {
    assert!(coins.iter().all(|&c| c > 0));
    let mut best = vec![usize::MAX; amount + 1];
    let mut chosen = vec![0; amount + 1];
    best[0] = 0;
    for sum in 1..=amount {
        for &coin in coins {
            if coin <= sum && best[sum - coin] != usize::MAX && best[sum - coin] + 1 < best[sum] {
                best[sum] = best[sum - coin] + 1;
                chosen[sum] = coin;
            }
        }
    }
    if best[amount] == usize::MAX {
        return None;
    }
    let mut used = Vec::new();
    let mut sum = amount;
    while sum > 0 {
        let coin = chosen[sum];
        used.push(coin);
        sum -= coin;
    }
    Some((best[amount], used))
}

pub fn coin_change_ways(coins: &[usize], amount: usize) -> u64 {
    assert!(coins.iter().all(|&c| c > 0));
    let mut ways = vec![0; amount + 1];
    ways[0] = 1;
    for &coin in coins {
        for sum in coin..=amount {
            ways[sum] += ways[sum - coin];
        }
    }
    ways[amount]
}
