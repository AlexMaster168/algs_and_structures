<?php
declare(strict_types=1);

namespace Ports\DataStructures\Linear;

class Queue implements \IteratorAggregate {
    private array $items = []; private int $head = 0;
    public function __get(string $name): int { return count($this->items)-$this->head; }
    public function isEmpty(): bool { return $this->size === 0; }
    public function enqueue(mixed $value): static { $this->items[] = $value; return $this; }
    public function dequeue(): mixed { if ($this->isEmpty()) return null; $value = $this->items[$this->head++]; if ($this->head*2 >= count($this->items)) { $this->items = array_slice($this->items,$this->head); $this->head = 0; } return $value; }
    public function peek(): mixed { return $this->isEmpty() ? null : $this->items[$this->head]; }
    public function toArray(): array { return iterator_to_array($this,false); }
    public function getIterator(): \Traversable { for ($i = $this->head; $i < count($this->items); $i++) yield $this->items[$i]; }
}
