from math import inf


def min_coins(coins, amount):
    if amount < 0 or any(coin <= 0 for coin in coins):
        raise ValueError('Amount must be non-negative and coins positive')
    best, last_coin = [inf] * (amount + 1), [-1] * (amount + 1)
    best[0] = 0
    for total in range(1, amount + 1):
        for coin in coins:
            if coin <= total and best[total - coin] + 1 < best[total]:
                best[total] = best[total - coin] + 1
                last_coin[total] = coin
    if best[amount] == inf:
        return None
    used = []
    total = amount
    while total > 0:
        used.append(last_coin[total])
        total -= last_coin[total]
    return {'count': best[amount], 'coins': used}


def coin_change_ways(coins, amount):
    if amount < 0 or any(coin <= 0 for coin in coins):
        raise ValueError('Amount must be non-negative and coins positive')
    ways = [0] * (amount + 1)
    ways[0] = 1
    for coin in coins:
        for total in range(coin, amount + 1):
            ways[total] += ways[total - coin]
    return ways[amount]
