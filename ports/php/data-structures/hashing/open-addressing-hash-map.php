<?php
declare(strict_types=1);

namespace Ports\DataStructures\Hashing;

class OpenAddressingHashMap implements \IteratorAggregate {
    private array $slots; private int $count = 0; private int $tombstones = 0; private \Closure $hasher;
    public function __construct(?callable $hasher = null,int $initialCapacity = 16) { $this->hasher = ($hasher ?? defaultHasher(...))(...); $this->slots = array_fill(0,max(2,$initialCapacity),null); }
    public function __get(string $name): int { return $this->count; }
    public function set(mixed $key,mixed $value): static { if (($this->count+$this->tombstones+1)*2 > count($this->slots)) $this->resize(count($this->slots)*2); $index = $this->indexFor($key); $firstDeleted = -1; while (true) { $slot = $this->slots[$index]; if ($slot === null) break; if ($slot === false) { if ($firstDeleted === -1) $firstDeleted = $index; } elseif ($slot[0] === $key) { $this->slots[$index][1] = $value; return $this; } $index = ($index+1)%count($this->slots); } if ($firstDeleted !== -1) { $index = $firstDeleted; $this->tombstones--; } $this->slots[$index] = [$key,$value]; $this->count++; return $this; }
    public function get(mixed $key): mixed { $index = $this->find($key); return $index === -1 ? null : $this->slots[$index][1]; }
    public function has(mixed $key): bool { return $this->find($key) !== -1; }
    public function delete(mixed $key): bool { $index = $this->find($key); if ($index === -1) return false; $this->slots[$index] = false; $this->count--; $this->tombstones++; return true; }
    public function getIterator(): \Traversable { foreach ($this->slots as $slot) if (is_array($slot)) yield $slot; }
    private function find(mixed $key): int { $index = $this->indexFor($key); for ($probes = 0; $probes < count($this->slots); $probes++) { $slot = $this->slots[$index]; if ($slot === null) return -1; if ($slot !== false && $slot[0] === $key) return $index; $index = ($index+1)%count($this->slots); } return -1; }
    private function indexFor(mixed $key): int { $n = count($this->slots); return ((int)($this->hasher)($key)%$n+$n)%$n; }
    private function resize(int $capacity): void { $entries = iterator_to_array($this,false); $this->slots = array_fill(0,$capacity,null); $this->count = $this->tombstones = 0; foreach ($entries as [$key,$value]) $this->set($key,$value); }
}
