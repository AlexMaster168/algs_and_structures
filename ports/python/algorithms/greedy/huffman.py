import heapq
from collections import Counter


def huffman_codes(text):
    frequencies = Counter(text)
    if not frequencies:
        return {}
    if len(frequencies) == 1:
        return {next(iter(frequencies)): '0'}
    heap = [(weight, i, char) for i, (char, weight) in enumerate(frequencies.items())]
    heapq.heapify(heap)
    order = len(heap)
    while len(heap) > 1:
        a, b = heapq.heappop(heap), heapq.heappop(heap)
        heapq.heappush(heap, (a[0] + b[0], order, (a[2], b[2])))
        order += 1
    codes = {}

    def assign(node, code):
        if isinstance(node, str):
            codes[node] = code
        else:
            assign(node[0], code + '0')
            assign(node[1], code + '1')
    assign(heap[0][2], '')
    return codes


def huffman_encode(text):
    codes = huffman_codes(text)
    return {'encoded': ''.join(codes[char] for char in text), 'codes': codes}


def huffman_decode(encoded, codes):
    reverse = {code: char for char, code in codes.items()}
    result, buffer = [], ''
    for bit in encoded:
        buffer += bit
        if buffer in reverse:
            result.append(reverse[buffer])
            buffer = ''
    return ''.join(result)
