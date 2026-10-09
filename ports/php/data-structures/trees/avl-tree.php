<?php
declare(strict_types=1);
namespace Ports\DataStructures\Trees;
use function Ports\Shared\defaultCompare;

class AVLNode {
    public ?AVLNode $left = null, $right = null;
    public int $height = 1;
    public function __construct(public mixed $value) {}
}
class AVLTree implements \IteratorAggregate {
    private ?AVLNode $root = null;
    private int $count = 0;
    private \Closure $compare;
    public function __construct(?callable $compare = null) { $this->compare = ($compare ?? defaultCompare(...))(...); }
    public function __get(string $name): int { return $this->count; }
    private function nodeHeight(?AVLNode $node): int { return $node?->height ?? 0; }
    private function balance(?AVLNode $node): int { return $node ? $this->nodeHeight($node->left) - $this->nodeHeight($node->right) : 0; }
    private function refresh(AVLNode $node): void { $node->height = 1 + max($this->nodeHeight($node->left), $this->nodeHeight($node->right)); }
    private function rotateRight(AVLNode $node): AVLNode { $pivot = $node->left; $node->left = $pivot->right; $pivot->right = $node; $this->refresh($node); $this->refresh($pivot); return $pivot; }
    private function rotateLeft(AVLNode $node): AVLNode { $pivot = $node->right; $node->right = $pivot->left; $pivot->left = $node; $this->refresh($node); $this->refresh($pivot); return $pivot; }
    private function rebalance(AVLNode $node): AVLNode {
        $this->refresh($node); $balance = $this->balance($node);
        if ($balance > 1) { if ($this->balance($node->left) < 0) $node->left = $this->rotateLeft($node->left); return $this->rotateRight($node); }
        if ($balance < -1) { if ($this->balance($node->right) > 0) $node->right = $this->rotateRight($node->right); return $this->rotateLeft($node); }
        return $node;
    }
    public function has(mixed $value): bool { $node = $this->root; while ($node) { $order = ($this->compare)($value, $node->value); if ($order === 0) return true; $node = $order < 0 ? $node->left : $node->right; } return false; }
    private function add(?AVLNode $node, mixed $value): AVLNode { if (!$node) return new AVLNode($value); if (($this->compare)($value, $node->value) < 0) $node->left = $this->add($node->left, $value); else $node->right = $this->add($node->right, $value); return $this->rebalance($node); }
    public function insert(mixed $value): bool { if ($this->has($value)) return false; $this->root = $this->add($this->root, $value); $this->count++; return true; }
    private function remove(?AVLNode $node, mixed $value): ?AVLNode {
        if (!$node) return null; $order = ($this->compare)($value, $node->value);
        if ($order < 0) $node->left = $this->remove($node->left, $value); elseif ($order > 0) $node->right = $this->remove($node->right, $value);
        else { if (!$node->left || !$node->right) return $node->left ?? $node->right; $successor = $node->right; while ($successor->left) $successor = $successor->left; $node->value = $successor->value; $node->right = $this->remove($node->right, $successor->value); }
        return $this->rebalance($node);
    }
    public function delete(mixed $value): bool { if (!$this->has($value)) return false; $this->root = $this->remove($this->root, $value); $this->count--; return true; }
    public function height(): int { return $this->nodeHeight($this->root); }
    public function isBalanced(): bool { $check = function(?AVLNode $node) use (&$check): bool { return !$node || abs($this->balance($node)) <= 1 && $check($node->left) && $check($node->right); }; return $check($this->root); }
    public function toArray(): array { return iterator_to_array($this, false); }
    public function getIterator(): \Traversable { $stack = []; $node = $this->root; while ($node || $stack) { while ($node) { $stack[] = $node; $node = $node->left; } $node = array_pop($stack); yield $node->value; $node = $node->right; } }
}
