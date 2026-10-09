<?php
declare(strict_types=1);

namespace Ports\DataStructures\Heaps;

class PriorityQueue {
    private BinaryHeap $heap; private int $counter = 0;
    public function __construct() { $this->heap = new BinaryHeap(fn($a,$b) => ($a['priority'] <=> $b['priority']) ?: ($a['order'] <=> $b['order'])); }
    public function __get(string $name): int { return $this->heap->size; }
    public function isEmpty(): bool { return $this->heap->isEmpty(); }
    public function enqueue(mixed $value,int|float $priority): static { $this->heap->push(['value'=>$value,'priority'=>$priority,'order'=>$this->counter++]); return $this; }
    public function dequeue(): mixed { return $this->heap->pop()['value'] ?? null; }
    public function peek(): mixed { return $this->heap->peek()['value'] ?? null; }
    public function peekPriority(): int|float|null { return $this->heap->peek()['priority'] ?? null; }
}
