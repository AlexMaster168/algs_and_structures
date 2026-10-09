<?php
declare(strict_types=1);

namespace Ports\DataStructures\Hashing;

class HashTable implements \IteratorAggregate {
    private array $buckets; private int $count = 0; private \Closure $hasher;
    public function __construct(?callable $hasher = null,int $initialCapacity = 16,private readonly float $maxLoadFactor = 0.75) { $this->hasher = ($hasher ?? defaultHasher(...))(...); $this->buckets = array_fill(0,max(1,$initialCapacity),[]); }
    public function __get(string $name): int { return $name === 'capacity' ? count($this->buckets) : $this->count; }
    private function index(mixed $key): int { $n = count($this->buckets); return ((int)($this->hasher)($key)%$n+$n)%$n; }
    public function set(mixed $key,mixed $value): static { $i = $this->index($key); foreach ($this->buckets[$i] as $j => $entry) if ($entry[0] === $key) { $this->buckets[$i][$j][1] = $value; return $this; } $this->buckets[$i][] = [$key,$value]; $this->count++; if ($this->count/count($this->buckets) > $this->maxLoadFactor) $this->resize(count($this->buckets)*2); return $this; }
    public function get(mixed $key): mixed { foreach ($this->buckets[$this->index($key)] as [$k,$v]) if ($k === $key) return $v; return null; }
    public function has(mixed $key): bool { foreach ($this->buckets[$this->index($key)] as [$k]) if ($k === $key) return true; return false; }
    public function delete(mixed $key): bool { $i = $this->index($key); foreach ($this->buckets[$i] as $j => [$k]) if ($k === $key) { array_splice($this->buckets[$i],$j,1); $this->count--; return true; } return false; }
    public function clear(): void { $this->buckets = array_fill(0,count($this->buckets),[]); $this->count = 0; }
    public function keys(): \Generator { foreach ($this as [$key]) yield $key; }
    public function values(): \Generator { foreach ($this as [,$value]) yield $value; }
    public function getIterator(): \Traversable { foreach ($this->buckets as $bucket) foreach ($bucket as $entry) yield $entry; }
    private function resize(int $capacity): void { $entries = iterator_to_array($this,false); $this->buckets = array_fill(0,$capacity,[]); foreach ($entries as [$key,$value]) $this->buckets[$this->index($key)][] = [$key,$value]; }
}
