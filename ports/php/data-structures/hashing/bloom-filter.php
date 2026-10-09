<?php
declare(strict_types=1);

namespace Ports\DataStructures\Hashing;

class BloomFilter {
    public readonly int $bitCount; public readonly int $hashCount; private array $bits;
    public function __construct(int $expectedItems,float $falsePositiveRate = 0.01) { if ($expectedItems < 1 || $falsePositiveRate <= 0 || $falsePositiveRate >= 1) throw new \RangeException('Invalid filter parameters'); $this->bitCount = max(8,(int)ceil(-$expectedItems*log($falsePositiveRate)/log(2)**2)); $this->hashCount = max(1,(int)round($this->bitCount/$expectedItems*log(2))); $this->bits = array_fill(0,(int)ceil($this->bitCount/8),0); }
    public function add(string $item): static { foreach ($this->positions($item) as $position) $this->bits[$position>>3] |= 1<<($position&7); return $this; }
    public function mightContain(string $item): bool { foreach ($this->positions($item) as $position) if (($this->bits[$position>>3] & (1<<($position&7))) === 0) return false; return true; }
    private function positions(string $item): \Generator { $h1 = fnv1a($item); $h2 = (fnv1a($item,0x5bd1e995)|1)&0xffffffff; for ($i = 0; $i < $this->hashCount; $i++) yield ($h1+$i*$h2)%$this->bitCount; }
}
