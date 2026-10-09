<?php
declare(strict_types=1);

namespace Ports\DataStructures\Linear;

class CircularBuffer implements \IteratorAggregate {
    private array $buffer; private int $start = 0; private int $length = 0;
    public function __construct(public readonly int $capacity) { if ($capacity <= 0) throw new \RangeException('Capacity must be a positive integer'); $this->buffer = array_fill(0,$capacity,null); }
    public function __get(string $name): int { return $this->length; }
    public function isFull(): bool { return $this->length === $this->capacity; }
    public function isEmpty(): bool { return $this->length === 0; }
    public function push(mixed $value): mixed { if ($this->isFull()) { $old = $this->buffer[$this->start]; $this->buffer[$this->start] = $value; $this->start = ($this->start+1)%$this->capacity; return $old; } $this->buffer[($this->start+$this->length)%$this->capacity] = $value; $this->length++; return null; }
    public function shift(): mixed { if ($this->isEmpty()) return null; $value = $this->buffer[$this->start]; $this->buffer[$this->start] = null; $this->start = ($this->start+1)%$this->capacity; $this->length--; return $value; }
    public function toArray(): array { return iterator_to_array($this,false); }
    public function getIterator(): \Traversable { for ($i = 0; $i < $this->length; $i++) yield $this->buffer[($this->start+$i)%$this->capacity]; }
}
