import { fnv1a } from './hash.js';
export class BloomFilter {
    bitCount;
    hashCount;
    bits;
    constructor(expectedItems, falsePositiveRate = 0.01) {
        this.bitCount = Math.max(8, Math.ceil((-expectedItems * Math.log(falsePositiveRate)) / Math.LN2 ** 2));
        this.hashCount = Math.max(1, Math.round((this.bitCount / expectedItems) * Math.LN2));
        this.bits = new Uint8Array(Math.ceil(this.bitCount / 8));
    }
    add(item) {
        for (const position of this.positions(item))
            this.bits[position >> 3] |= 1 << (position & 7);
        return this;
    }
    mightContain(item) {
        for (const position of this.positions(item)) {
            if ((this.bits[position >> 3] & (1 << (position & 7))) === 0)
                return false;
        }
        return true;
    }
    *positions(item) {
        const h1 = fnv1a(item);
        const h2 = (fnv1a(item, 0x5bd1e995) | 1) >>> 0;
        for (let i = 0; i < this.hashCount; i++)
            yield (h1 + i * h2) % this.bitCount;
    }
}
