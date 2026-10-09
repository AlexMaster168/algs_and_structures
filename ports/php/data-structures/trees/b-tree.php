<?php
declare(strict_types=1);
namespace Ports\DataStructures\Trees;
use function Ports\Shared\defaultCompare;

class BTreeNode { public array $keys = [], $children = []; public function isLeaf(): bool { return $this->children === []; } }
class BTree implements \IteratorAggregate {
    private BTreeNode $root;
    private \Closure $compare;
    private int $count = 0;
    public function __construct(public readonly int $minDegree = 2, ?callable $compare = null) { if ($minDegree < 2) throw new \InvalidArgumentException('Minimum degree must be >= 2'); $this->root = new BTreeNode(); $this->compare = ($compare ?? defaultCompare(...))(...); }
    public function __get(string $name): int { return $this->count; }
    public function height(): int { $height = 1; $node = $this->root; while (!$node->isLeaf()) { $height++; $node = $node->children[0]; } return $height; }
    private function lowerIndex(BTreeNode $node, mixed $value): int { $low = 0; $high = count($node->keys); while ($low < $high) { $mid = ($low + $high) >> 1; if (($this->compare)($node->keys[$mid], $value) < 0) $low = $mid + 1; else $high = $mid; } return $low; }
    public function has(mixed $value): bool { $node = $this->root; while (true) { $index = $this->lowerIndex($node, $value); if ($index < count($node->keys) && ($this->compare)($node->keys[$index], $value) === 0) return true; if ($node->isLeaf()) return false; $node = $node->children[$index]; } }
    private function splitChild(BTreeNode $parent, int $index): void {
        $full = $parent->children[$index]; $right = new BTreeNode(); $right->keys = array_slice($full->keys, $this->minDegree); $median = $full->keys[$this->minDegree - 1]; $full->keys = array_slice($full->keys, 0, $this->minDegree - 1);
        if (!$full->isLeaf()) { $right->children = array_slice($full->children, $this->minDegree); $full->children = array_slice($full->children, 0, $this->minDegree); }
        array_splice($parent->keys, $index, 0, [$median]); array_splice($parent->children, $index + 1, 0, [$right]);
    }
    private function insertNonFull(BTreeNode $node, mixed $value): void {
        $index = $this->lowerIndex($node, $value); if ($node->isLeaf()) { array_splice($node->keys, $index, 0, [$value]); return; }
        if (count($node->children[$index]->keys) === 2 * $this->minDegree - 1) { $this->splitChild($node, $index); if (($this->compare)($value, $node->keys[$index]) > 0) $index++; }
        $this->insertNonFull($node->children[$index], $value);
    }
    public function insert(mixed $value): bool {
        if ($this->has($value)) return false;
        if (count($this->root->keys) === 2 * $this->minDegree - 1) { $root = new BTreeNode(); $root->children[] = $this->root; $this->splitChild($root, 0); $this->root = $root; }
        $this->insertNonFull($this->root, $value); $this->count++; return true;
    }
    private function merge(BTreeNode $node, int $index): void { $left = $node->children[$index]; $right = $node->children[$index + 1]; $left->keys = [...$left->keys, $node->keys[$index], ...$right->keys]; $left->children = [...$left->children, ...$right->children]; array_splice($node->keys, $index, 1); array_splice($node->children, $index + 1, 1); }
    private function remove(BTreeNode $node, mixed $value): void {
        $index = $this->lowerIndex($node, $value); $t = $this->minDegree;
        if ($index < count($node->keys) && ($this->compare)($node->keys[$index], $value) === 0) {
            if ($node->isLeaf()) { array_splice($node->keys, $index, 1); return; }
            $left = $node->children[$index]; $right = $node->children[$index + 1];
            if (count($left->keys) >= $t) { $predecessor = $left; while (!$predecessor->isLeaf()) $predecessor = $predecessor->children[count($predecessor->children) - 1]; $key = $predecessor->keys[count($predecessor->keys) - 1]; $node->keys[$index] = $key; $this->remove($left, $key); }
            elseif (count($right->keys) >= $t) { $successor = $right; while (!$successor->isLeaf()) $successor = $successor->children[0]; $key = $successor->keys[0]; $node->keys[$index] = $key; $this->remove($right, $key); }
            else { $this->merge($node, $index); $this->remove($left, $value); } return;
        }
        if ($node->isLeaf()) return; $child = $node->children[$index];
        if (count($child->keys) < $t) {
            $left = $index > 0 ? $node->children[$index - 1] : null; $right = $node->children[$index + 1] ?? null;
            if ($left && count($left->keys) >= $t) { array_unshift($child->keys, $node->keys[$index - 1]); $node->keys[$index - 1] = array_pop($left->keys); if (!$left->isLeaf()) array_unshift($child->children, array_pop($left->children)); }
            elseif ($right && count($right->keys) >= $t) { $child->keys[] = $node->keys[$index]; $node->keys[$index] = array_shift($right->keys); if (!$right->isLeaf()) $child->children[] = array_shift($right->children); }
            elseif ($right) $this->merge($node, $index); else { $this->merge($node, $index - 1); $child = $node->children[$index - 1]; }
        }
        $this->remove($child, $value);
    }
    public function delete(mixed $value): bool { if (!$this->has($value)) return false; $this->remove($this->root, $value); if (!$this->root->keys && !$this->root->isLeaf()) $this->root = $this->root->children[0]; $this->count--; return true; }
    private function walk(BTreeNode $node): \Generator { foreach ($node->keys as $i => $key) { if (!$node->isLeaf()) yield from $this->walk($node->children[$i]); yield $key; } if (!$node->isLeaf()) yield from $this->walk($node->children[count($node->keys)]); }
    public function getIterator(): \Traversable { yield from $this->walk($this->root); }
    public function toArray(): array { return iterator_to_array($this, false); }
}
