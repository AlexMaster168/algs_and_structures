<?php
declare(strict_types=1);

namespace Ports\DataStructures\Hashing;

use Ports\Shared\Map;
use Ports\DataStructures\Linear\{DoublyLinkedList,DoublyLinkedListNode};
class LRUCache {
    private Map $nodes; private DoublyLinkedList $order;
    public function __construct(public readonly int $capacity) { if ($capacity <= 0) throw new \RangeException('Capacity must be a positive integer'); $this->nodes = new Map(); $this->order = new DoublyLinkedList(); }
    public function __get(string $name): int { return $this->nodes->size; }
    public function get(mixed $key): mixed { $node = $this->nodes->get($key); if (!$node) return null; $value = $node->value[1]; $this->touch($key,$value,$node); return $value; }
    public function has(mixed $key): bool { return $this->nodes->has($key); }
    public function set(mixed $key,mixed $value): static { $this->touch($key,$value,$this->nodes->get($key)); if ($this->nodes->size > $this->capacity) { [$oldest] = $this->order->popBack(); $this->nodes->delete($oldest); } return $this; }
    public function delete(mixed $key): bool { $node = $this->nodes->get($key); if (!$node) return false; $this->order->unlink($node); return $this->nodes->delete($key); }
    public function keys(): array { return array_map(fn($entry) => $entry[0],$this->order->toArray()); }
    private function touch(mixed $key,mixed $value,?DoublyLinkedListNode $node): void { if ($node) $this->order->unlink($node); $this->nodes->set($key,$this->order->pushFront([$key,$value])); }
}
