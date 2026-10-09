<?php
declare(strict_types=1);

namespace Ports\DataStructures\Linear;

class Deque implements \IteratorAggregate {
    private array $buffer; private int $head = 0; private int $length = 0;
    public function __construct(int $initialCapacity = 8) { $this->buffer = array_fill(0,max(1,$initialCapacity),null); }
    public function __get(string $name): int { return $this->length; }
    public function isEmpty(): bool { return $this->length === 0; }
    public function pushBack(mixed $value): static { $this->ensureCapacity(); $this->buffer[($this->head+$this->length)%count($this->buffer)] = $value; $this->length++; return $this; }
    public function pushFront(mixed $value): static { $this->ensureCapacity(); $this->head = ($this->head-1+count($this->buffer))%count($this->buffer); $this->buffer[$this->head] = $value; $this->length++; return $this; }
    public function popBack(): mixed { if (!$this->length) return null; $index = ($this->head+$this->length-1)%count($this->buffer); $value = $this->buffer[$index]; $this->buffer[$index] = null; $this->length--; return $value; }
    public function popFront(): mixed { if (!$this->length) return null; $value = $this->buffer[$this->head]; $this->buffer[$this->head] = null; $this->head = ($this->head+1)%count($this->buffer); $this->length--; return $value; }
    public function peekFront(): mixed { return $this->at(0); }
    public function peekBack(): mixed { return $this->at(-1); }
    public function at(int $index): mixed { if ($index < 0) $index += $this->length; return $index < 0 || $index >= $this->length ? null : $this->buffer[($this->head+$index)%count($this->buffer)]; }
    public function toArray(): array { return iterator_to_array($this,false); }
    public function getIterator(): \Traversable { for ($i = 0; $i < $this->length; $i++) yield $this->buffer[($this->head+$i)%count($this->buffer)]; }
    private function ensureCapacity(): void { if ($this->length < count($this->buffer)) return; $next = array_fill(0,count($this->buffer)*2,null); for ($i = 0; $i < $this->length; $i++) $next[$i] = $this->at($i); $this->buffer = $next; $this->head = 0; }
}
