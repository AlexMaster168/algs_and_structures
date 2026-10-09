<?php
declare(strict_types=1);

namespace Ports\DataStructures\Linear;

class LinkedListNode { public ?LinkedListNode $next = null; public function __construct(public mixed $value) {} }
class LinkedList implements \IteratorAggregate {
    private ?LinkedListNode $head = null; private ?LinkedListNode $tail = null; private int $length = 0;
    public static function from(iterable $values): static { $list = new static(); foreach ($values as $value) $list->append($value); return $list; }
    public function __get(string $name): mixed { return match($name) { 'size'=>$this->length,'first'=>$this->head?->value,'last'=>$this->tail?->value,default=>throw new \LogicException($name) }; }
    public function append(mixed $value): static { $node = new LinkedListNode($value); if ($this->tail) $this->tail->next = $node; else $this->head = $node; $this->tail = $node; $this->length++; return $this; }
    public function prepend(mixed $value): static { $node = new LinkedListNode($value); $node->next = $this->head; $this->head = $node; $this->tail ??= $node; $this->length++; return $this; }
    public function insertAt(int $index,mixed $value): static { if ($index < 0 || $index > $this->length) throw new \RangeException("Index $index is out of bounds"); if ($index === 0) return $this->prepend($value); if ($index === $this->length) return $this->append($value); $previous = $this->nodeAt($index-1); $node = new LinkedListNode($value); $node->next = $previous->next; $previous->next = $node; $this->length++; return $this; }
    public function get(int $index): mixed { return $index < 0 || $index >= $this->length ? null : $this->nodeAt($index)->value; }
    public function indexOf(mixed $value): int { $i = 0; for ($node = $this->head; $node; $node = $node->next,$i++) if ($node->value === $value) return $i; return -1; }
    public function find(callable $predicate): mixed { foreach ($this as $value) if ($predicate($value)) return $value; return null; }
    public function removeAt(int $index): mixed { if ($index < 0 || $index >= $this->length) return null; if ($index === 0) { $removed = $this->head; $this->head = $removed->next; if (!$this->head) $this->tail = null; } else { $previous = $this->nodeAt($index-1); $removed = $previous->next; $previous->next = $removed->next; if ($removed === $this->tail) $this->tail = $previous; } $this->length--; return $removed->value; }
    public function remove(mixed $value): bool { $i = $this->indexOf($value); if ($i === -1) return false; $this->removeAt($i); return true; }
    public function reverse(): static { $previous = null; $current = $this->head; $this->tail = $current; while ($current) { $next = $current->next; $current->next = $previous; $previous = $current; $current = $next; } $this->head = $previous; return $this; }
    public function toArray(): array { return iterator_to_array($this,false); }
    public function getIterator(): \Traversable { for ($node = $this->head; $node; $node = $node->next) yield $node->value; }
    private function nodeAt(int $index): LinkedListNode { $node = $this->head; for ($i = 0; $i < $index; $i++) $node = $node->next; return $node; }
}
