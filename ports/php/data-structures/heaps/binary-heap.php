<?php
declare(strict_types=1);

namespace Ports\DataStructures\Heaps;

use function Ports\Shared\defaultCompare;
class BinaryHeap implements \IteratorAggregate {
    private array $items; private \Closure $compare;
    public function __construct(?callable $compare = null,iterable $values = []) { $this->compare = ($compare ?? defaultCompare(...))(...); $this->items = is_array($values) ? array_values($values) : iterator_to_array($values,false); for ($i = (count($this->items)>>1)-1; $i >= 0; $i--) $this->siftDown($i); }
    public function __get(string $name): int { return count($this->items); }
    public function isEmpty(): bool { return $this->items === []; }
    public function peek(): mixed { return $this->items[0] ?? null; }
    public function push(mixed ...$values): static { foreach ($values as $value) { $this->items[] = $value; $this->siftUp(count($this->items)-1); } return $this; }
    public function pop(): mixed { if (!$this->items) return null; $top = $this->items[0]; $last = array_pop($this->items); if ($this->items) { $this->items[0] = $last; $this->siftDown(0); } return $top; }
    public function pushPop(mixed $value): mixed { if (!$this->items || ($this->compare)($value,$this->items[0]) <= 0) return $value; $top = $this->items[0]; $this->items[0] = $value; $this->siftDown(0); return $top; }
    public function toSortedArray(): array { $copy = new BinaryHeap($this->compare,$this->items); $result = []; while (!$copy->isEmpty()) $result[] = $copy->pop(); return $result; }
    public function getIterator(): \Traversable { yield from $this->items; }
    private function siftUp(int $index): void { while ($index > 0) { $parent = ($index-1)>>1; if (($this->compare)($this->items[$index],$this->items[$parent]) >= 0) break; [$this->items[$index],$this->items[$parent]] = [$this->items[$parent],$this->items[$index]]; $index = $parent; } }
    private function siftDown(int $index): void { $n = count($this->items); while (true) { $left = 2*$index+1; $right = $left+1; $best = $index; if ($left < $n && ($this->compare)($this->items[$left],$this->items[$best]) < 0) $best = $left; if ($right < $n && ($this->compare)($this->items[$right],$this->items[$best]) < 0) $best = $right; if ($best === $index) return; [$this->items[$index],$this->items[$best]] = [$this->items[$best],$this->items[$index]]; $index = $best; } }
}
class MinHeap extends BinaryHeap { public function __construct(iterable $values = []) { parent::__construct(defaultCompare(...),$values); } }
class MaxHeap extends BinaryHeap { public function __construct(iterable $values = []) { parent::__construct(fn($a,$b) => defaultCompare($b,$a),$values); } }
