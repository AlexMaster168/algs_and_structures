<?php
declare(strict_types=1);

namespace Ports\DataStructures\Linear;

class Stack implements \IteratorAggregate {
    private array $items = [];
    public function __get(string $name): int { return count($this->items); }
    public function isEmpty(): bool { return $this->items === []; }
    public function push(mixed $value): static { $this->items[] = $value; return $this; }
    public function pop(): mixed { return array_pop($this->items); }
    public function peek(): mixed { return $this->items[count($this->items)-1] ?? null; }
    public function toArray(): array { return iterator_to_array($this,false); }
    public function getIterator(): \Traversable { for ($i = count($this->items)-1; $i >= 0; $i--) yield $this->items[$i]; }
}
