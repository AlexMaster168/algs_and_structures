def rod_cutting(prices, length):
    revenue, first_cut = [0] * (length + 1), [0] * (length + 1)
    for total in range(1, length + 1):
        for piece in range(1, min(total, len(prices)) + 1):
            candidate = prices[piece - 1] + revenue[total - piece]
            if candidate > revenue[total]:
                revenue[total], first_cut[total] = candidate, piece
    pieces, rest = [], length
    while rest > 0 and first_cut[rest] > 0:
        pieces.append(first_cut[rest])
        rest -= first_cut[rest]
    return {'revenue': revenue[length], 'pieces': pieces}
