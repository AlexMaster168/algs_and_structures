<?php
declare(strict_types=1);

namespace Ports\DataStructures\Linear;

class DoublyLinkedListNode { public ?DoublyLinkedListNode $prev = null; public ?DoublyLinkedListNode $next = null; public function __construct(public mixed $value) {} }
class DoublyLinkedList implements \IteratorAggregate {
    private ?DoublyLinkedListNode $head = null; private ?DoublyLinkedListNode $tail = null; private int $length = 0;
    public static function from(iterable $values): static { $list = new static(); foreach ($values as $value) $list->pushBack($value); return $list; }
    public function __get(string $name): mixed { return match($name) { 'size'=>$this->length,'first'=>$this->head?->value,'last'=>$this->tail?->value,default=>throw new \LogicException($name) }; }
    public function pushBack(mixed $value): DoublyLinkedListNode { $node = new DoublyLinkedListNode($value); $node->prev = $this->tail; if ($this->tail) $this->tail->next = $node; else $this->head = $node; $this->tail = $node; $this->length++; return $node; }
    public function pushFront(mixed $value): DoublyLinkedListNode { $node = new DoublyLinkedListNode($value); $node->next = $this->head; if ($this->head) $this->head->prev = $node; else $this->tail = $node; $this->head = $node; $this->length++; return $node; }
    public function popBack(): mixed { if (!$this->tail) return null; $node = $this->tail; $this->unlink($node); return $node->value; }
    public function popFront(): mixed { if (!$this->head) return null; $node = $this->head; $this->unlink($node); return $node->value; }
    public function remove(mixed $value): bool { for ($node = $this->head; $node; $node = $node->next) if ($node->value === $value) { $this->unlink($node); return true; } return false; }
    public function unlink(DoublyLinkedListNode $node): void { if ($node->prev) $node->prev->next = $node->next; else $this->head = $node->next; if ($node->next) $node->next->prev = $node->prev; else $this->tail = $node->prev; $node->prev = $node->next = null; $this->length--; }
    public function toArray(): array { return iterator_to_array($this,false); }
    public function reversed(): \Generator { for ($node = $this->tail; $node; $node = $node->prev) yield $node->value; }
    public function getIterator(): \Traversable { for ($node = $this->head; $node; $node = $node->next) yield $node->value; }
}
