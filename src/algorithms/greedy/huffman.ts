import { BinaryHeap } from '../../data-structures/heaps/binary-heap.js';

type HuffmanNode = { weight: number; order: number } & ({ char: string } | { left: HuffmanNode; right: HuffmanNode });

export const huffmanCodes = (text: string): Map<string, string> => {
  const frequencies = new Map<string, number>();
  for (const char of text) frequencies.set(char, (frequencies.get(char) ?? 0) + 1);

  const codes = new Map<string, string>();
  if (frequencies.size === 0) return codes;
  if (frequencies.size === 1) return codes.set([...frequencies.keys()][0]!, '0');

  let order = 0;
  const heap = new BinaryHeap<HuffmanNode>((a, b) => a.weight - b.weight || a.order - b.order);
  for (const [char, weight] of frequencies) heap.push({ char, weight, order: order++ });

  while (heap.size > 1) {
    const left = heap.pop()!;
    const right = heap.pop()!;
    heap.push({ left, right, weight: left.weight + right.weight, order: order++ });
  }

  const assign = (node: HuffmanNode, code: string): void => {
    if ('char' in node) {
      codes.set(node.char, code);
      return;
    }
    assign(node.left, `${code}0`);
    assign(node.right, `${code}1`);
  };

  assign(heap.pop()!, '');
  return codes;
};

export const huffmanEncode = (text: string): { encoded: string; codes: Map<string, string> } => {
  const codes = huffmanCodes(text);
  return { encoded: Array.from(text, (char) => codes.get(char)!).join(''), codes };
};

export const huffmanDecode = (encoded: string, codes: ReadonlyMap<string, string>): string => {
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
