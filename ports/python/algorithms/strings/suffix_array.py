def suffix_array(s):
    n = len(s)
    rank, suffixes = list(map(ord, s)), list(range(n))
    k = 1
    while n:
        def key(i):
            return rank[i], rank[i + k] if i + k < n else -1

        suffixes.sort(key=key)
        next_rank = [0] * n
        for i in range(1, n):
            next_rank[suffixes[i]] = next_rank[suffixes[i - 1]] + (key(suffixes[i - 1]) != key(suffixes[i]))
        rank = next_rank
        if rank[suffixes[-1]] == n - 1:
            break
        k *= 2
    return suffixes


def lcp_array(s, suffixes):
    n = len(s)
    rank = [0] * n
    for i, suffix in enumerate(suffixes):
        rank[suffix] = i
    lcp, h = [0] * max(0, n - 1), 0
    for i in range(n):
        if rank[i] == 0:
            h = 0
            continue
        j = suffixes[rank[i] - 1]
        while i + h < n and j + h < n and s[i + h] == s[j + h]:
            h += 1
        lcp[rank[i] - 1] = h
        h = max(0, h - 1)
    return lcp


def count_distinct_substrings(s):
    n = len(s)
    return n * (n + 1) // 2 - sum(lcp_array(s, suffix_array(s)))
