<?php
declare(strict_types=1);

namespace Ports\DataStructures\Linear;

use function Ports\Shared\defaultCompare;
class SkipListNode { public array $next; public function __construct(public readonly mixed $value,int $level) { $this->next = array_fill(0,$level,null); } }
class SkipList implements \IteratorAggregate {
    private SkipListNode $head; private int $level = 1; private int $length = 0; private \Closure $compare;
    public function __construct(?callable $compare = null,private readonly int $maxLevel = 32,private readonly float $probability = 0.5) { if ($maxLevel < 1) throw new \RangeException('Invalid maximum level'); $this->compare = ($compare ?? defaultCompare(...))(...); $this->head = new SkipListNode(null,$maxLevel); }
    public function __get(string $name): int { return $this->length; }
    public function has(mixed $value): bool { $candidate = $this->findPredecessors($value)[0]->next[0]; return $candidate !== null && ($this->compare)($candidate->value,$value) == 0; }
    public function insert(mixed $value): bool { $update = $this->findPredecessors($value); $candidate = $update[0]->next[0]; if ($candidate && ($this->compare)($candidate->value,$value) == 0) return false; $level = $this->randomLevel(); if ($level > $this->level) { for ($i = $this->level; $i < $level; $i++) $update[$i] = $this->head; $this->level = $level; } $node = new SkipListNode($value,$level); for ($i = 0; $i < $level; $i++) { $node->next[$i] = $update[$i]->next[$i] ?? null; $update[$i]->next[$i] = $node; } $this->length++; return true; }
    public function delete(mixed $value): bool { $update = $this->findPredecessors($value); $target = $update[0]->next[0]; if (!$target || ($this->compare)($target->value,$value) != 0) return false; for ($i = 0; $i < $this->level; $i++) { if ($update[$i]->next[$i] !== $target) break; $update[$i]->next[$i] = $target->next[$i] ?? null; } while ($this->level > 1 && !$this->head->next[$this->level-1]) $this->level--; $this->length--; return true; }
    public function toArray(): array { return iterator_to_array($this,false); }
    public function getIterator(): \Traversable { for ($node = $this->head->next[0]; $node; $node = $node->next[0]) yield $node->value; }
    private function findPredecessors(mixed $value): array { $update = []; $node = $this->head; for ($i = $this->level-1; $i >= 0; $i--) { $next = $node->next[$i]; while ($next && ($this->compare)($next->value,$value) < 0) { $node = $next; $next = $node->next[$i]; } $update[$i] = $node; } return $update; }
    private function randomLevel(): int { $level = 1; while ($level < $this->maxLevel && mt_rand()/mt_getrandmax() < $this->probability) $level++; return $level; }
}
