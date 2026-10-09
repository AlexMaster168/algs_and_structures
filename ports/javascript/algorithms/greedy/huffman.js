import { BinaryHeap } from '../../data-structures/heaps/binary-heap.js';
export const huffmanCodes = (text) => {
    const frequencies = new Map();
    for (const char of text)
        frequencies.set(char, (frequencies.get(char) ?? 0) + 1);
    const codes = new Map();
    if (frequencies.size === 0)
        return codes;
    if (frequencies.size === 1)
        return codes.set([...frequencies.keys()][0], '0');
    let order = 0;
    const heap = new BinaryHeap((a, b) => a.weight - b.weight || a.order - b.order);
    for (const [char, weight] of frequencies)
        heap.push({ char, weight, order: order++ });
    while (heap.size > 1) {
        const left = heap.pop();
        const right = heap.pop();
        heap.push({ left, right, weight: left.weight + right.weight, order: order++ });
    }
    const assign = (node, code) => {
        if ('char' in node) {
            codes.set(node.char, code);
            return;
        }
        assign(node.left, `${code}0`);
        assign(node.right, `${code}1`);
    };
    assign(heap.pop(), '');
    return codes;
};
export const huffmanEncode = (text) => {
    const codes = huffmanCodes(text);
    return { encoded: Array.from(text, (char) => codes.get(char)).join(''), codes };
};
export const huffmanDecode = (encoded, codes) => {
    const reverse = new Map([...codes].map(([char, code]) => [code, char]));
    let result = '';
    let buffer = '';
    for (const bit of encoded) {
        buffer += bit;
        const char = reverse.get(buffer);
        if (char !== undefined) {
            result += char;
            buffer = '';
        }
    }
    return result;
};
