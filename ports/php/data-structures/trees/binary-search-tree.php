<?php
declare(strict_types=1);
namespace Ports\DataStructures\Trees;
use function Ports\Shared\defaultCompare;

class BSTNode {
    public ?BSTNode $left = null, $right = null, $parent = null;
    public function __construct(public mixed $value) {}
}
class BinarySearchTree implements \IteratorAggregate {
    public ?BSTNode $root = null;
    private \Closure $compare;
    private int $count = 0;
    public function __construct(?callable $compare = null) { $this->compare = ($compare ?? defaultCompare(...))(...); }
    public function __get(string $name): mixed { return match ($name) { 'size' => $this->count, 'rootNode' => $this->root, default => throw new \OutOfBoundsException($name) }; }
    public static function from(iterable $values, ?callable $compare = null): self { $tree = new self($compare); foreach ($values as $value) $tree->insert($value); return $tree; }
    public function floor(mixed $value): mixed { $node = $this->root; $candidate = null; while ($node) { $order = ($this->compare)($value, $node->value); if ($order === 0) return $node->value; if ($order < 0) $node = $node->left; else { $candidate = $node->value; $node = $node->right; } } return $candidate; }
    public function ceil(mixed $value): mixed { $node = $this->root; $candidate = null; while ($node) { $order = ($this->compare)($value, $node->value); if ($order === 0) return $node->value; if ($order > 0) $node = $node->right; else { $candidate = $node->value; $node = $node->left; } } return $candidate; }
    public function find(mixed $value): ?BSTNode { $node = $this->root; while ($node) { $order = ($this->compare)($value, $node->value); if ($order === 0) return $node; $node = $order < 0 ? $node->left : $node->right; } return null; }
    public function has(mixed $value): bool { return $this->find($value) !== null; }
    public function insert(mixed $value): bool {
        $parent = null; $node = $this->root;
        while ($node) { $parent = $node; $order = ($this->compare)($value, $node->value); if ($order === 0) return false; $node = $order < 0 ? $node->left : $node->right; }
        $node = new BSTNode($value); $node->parent = $parent;
        if (!$parent) $this->root = $node; elseif (($this->compare)($value, $parent->value) < 0) $parent->left = $node; else $parent->right = $node;
        $this->count++; return true;
    }
    private function replace(BSTNode $node, ?BSTNode $replacement): void {
        if (!$node->parent) $this->root = $replacement; elseif ($node === $node->parent->left) $node->parent->left = $replacement; else $node->parent->right = $replacement;
        if ($replacement) $replacement->parent = $node->parent;
    }
    public function delete(mixed $value): bool {
        $node = $this->find($value); if (!$node) return false;
        if ($node->left && $node->right) { $successor = $node->right; while ($successor->left) $successor = $successor->left; $node->value = $successor->value; $node = $successor; }
        $this->replace($node, $node->left ?? $node->right); $this->count--; return true;
    }
    public function min(): mixed { $node = $this->root; if (!$node) return null; while ($node->left) $node = $node->left; return $node->value; }
    public function max(): mixed { $node = $this->root; if (!$node) return null; while ($node->right) $node = $node->right; return $node->value; }
    public function height(): int { $measure = function(?BSTNode $node) use (&$measure): int { return $node ? 1 + max($measure($node->left), $measure($node->right)) : 0; }; return $measure($this->root); }
    public function toArray(): array { return iterator_to_array($this, false); }
    public function getIterator(): \Traversable { $stack = []; $node = $this->root; while ($node || $stack) { while ($node) { $stack[] = $node; $node = $node->left; } $node = array_pop($stack); yield $node->value; $node = $node->right; } }
}
