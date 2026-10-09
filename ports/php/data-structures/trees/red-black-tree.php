<?php
declare(strict_types=1);
namespace Ports\DataStructures\Trees;
use function Ports\Shared\defaultCompare;

class RBNode {
    public RBNode $left, $right, $parent;
    public function __construct(public mixed $value, public string $color, ?RBNode $nil = null) { $this->left = $this->right = $this->parent = $nil ?? $this; }
}
class RedBlackTree implements \IteratorAggregate {
    private RBNode $root, $nil;
    private int $count = 0;
    private \Closure $compare;
    public function __construct(?callable $compare = null) { $this->compare = ($compare ?? defaultCompare(...))(...); $this->nil = new RBNode(null, 'black'); $this->root = $this->nil; }
    public function __get(string $name): int { return $this->count; }
    private function search(mixed $value): RBNode { $node = $this->root; while ($node !== $this->nil) { $order = ($this->compare)($value, $node->value); if ($order === 0) return $node; $node = $order < 0 ? $node->left : $node->right; } return $this->nil; }
    public function has(mixed $value): bool { return $this->search($value) !== $this->nil; }
    private function rotateLeft(RBNode $node): void {
        $pivot = $node->right; $node->right = $pivot->left; if ($pivot->left !== $this->nil) $pivot->left->parent = $node; $pivot->parent = $node->parent;
        if ($node->parent === $this->nil) $this->root = $pivot; elseif ($node === $node->parent->left) $node->parent->left = $pivot; else $node->parent->right = $pivot;
        $pivot->left = $node; $node->parent = $pivot;
    }
    private function rotateRight(RBNode $node): void {
        $pivot = $node->left; $node->left = $pivot->right; if ($pivot->right !== $this->nil) $pivot->right->parent = $node; $pivot->parent = $node->parent;
        if ($node->parent === $this->nil) $this->root = $pivot; elseif ($node === $node->parent->right) $node->parent->right = $pivot; else $node->parent->left = $pivot;
        $pivot->right = $node; $node->parent = $pivot;
    }
    private function fixInsert(RBNode $node): void {
        while ($node->parent->color === 'red') {
            $parent = $node->parent; $grandparent = $parent->parent;
            if ($parent === $grandparent->left) {
                $uncle = $grandparent->right;
                if ($uncle->color === 'red') { $parent->color = $uncle->color = 'black'; $grandparent->color = 'red'; $node = $grandparent; continue; }
                if ($node === $parent->right) { $node = $parent; $this->rotateLeft($node); }
                $node->parent->color = 'black'; $grandparent->color = 'red'; $this->rotateRight($grandparent);
            } else {
                $uncle = $grandparent->left;
                if ($uncle->color === 'red') { $parent->color = $uncle->color = 'black'; $grandparent->color = 'red'; $node = $grandparent; continue; }
                if ($node === $parent->left) { $node = $parent; $this->rotateRight($node); }
                $node->parent->color = 'black'; $grandparent->color = 'red'; $this->rotateLeft($grandparent);
            }
        }
        $this->root->color = 'black';
    }
    public function insert(mixed $value): bool {
        $parent = $this->nil; $node = $this->root;
        while ($node !== $this->nil) { $parent = $node; $order = ($this->compare)($value, $node->value); if ($order === 0) return false; $node = $order < 0 ? $node->left : $node->right; }
        $node = new RBNode($value, 'red', $this->nil); $node->parent = $parent;
        if ($parent === $this->nil) $this->root = $node; elseif (($this->compare)($value, $parent->value) < 0) $parent->left = $node; else $parent->right = $node;
        $this->fixInsert($node); $this->count++; return true;
    }
    private function transplant(RBNode $target, RBNode $replacement): void {
        if ($target->parent === $this->nil) $this->root = $replacement; elseif ($target === $target->parent->left) $target->parent->left = $replacement; else $target->parent->right = $replacement;
        $replacement->parent = $target->parent;
    }
    private function fixDelete(RBNode $node): void {
        while ($node !== $this->root && $node->color === 'black') {
            if ($node === $node->parent->left) {
                $sibling = $node->parent->right;
                if ($sibling->color === 'red') { $sibling->color = 'black'; $node->parent->color = 'red'; $this->rotateLeft($node->parent); $sibling = $node->parent->right; }
                if ($sibling->left->color === 'black' && $sibling->right->color === 'black') { $sibling->color = 'red'; $node = $node->parent; }
                else {
                    if ($sibling->right->color === 'black') { $sibling->left->color = 'black'; $sibling->color = 'red'; $this->rotateRight($sibling); $sibling = $node->parent->right; }
                    $sibling->color = $node->parent->color; $node->parent->color = 'black'; $sibling->right->color = 'black'; $this->rotateLeft($node->parent); $node = $this->root;
                }
            } else {
                $sibling = $node->parent->left;
                if ($sibling->color === 'red') { $sibling->color = 'black'; $node->parent->color = 'red'; $this->rotateRight($node->parent); $sibling = $node->parent->left; }
                if ($sibling->left->color === 'black' && $sibling->right->color === 'black') { $sibling->color = 'red'; $node = $node->parent; }
                else {
                    if ($sibling->left->color === 'black') { $sibling->right->color = 'black'; $sibling->color = 'red'; $this->rotateLeft($sibling); $sibling = $node->parent->left; }
                    $sibling->color = $node->parent->color; $node->parent->color = 'black'; $sibling->left->color = 'black'; $this->rotateRight($node->parent); $node = $this->root;
                }
            }
        }
        $node->color = 'black';
    }
    public function delete(mixed $value): bool {
        $target = $this->search($value); if ($target === $this->nil) return false; $removed = $target; $color = $removed->color;
        if ($target->left === $this->nil) { $replacement = $target->right; $this->transplant($target, $target->right); }
        elseif ($target->right === $this->nil) { $replacement = $target->left; $this->transplant($target, $target->left); }
        else {
            $removed = $target->right; while ($removed->left !== $this->nil) $removed = $removed->left; $color = $removed->color; $replacement = $removed->right;
            if ($removed->parent === $target) $replacement->parent = $removed;
            else { $this->transplant($removed, $removed->right); $removed->right = $target->right; $removed->right->parent = $removed; }
            $this->transplant($target, $removed); $removed->left = $target->left; $removed->left->parent = $removed; $removed->color = $target->color;
        }
        if ($color === 'black') $this->fixDelete($replacement); $this->count--; return true;
    }
    public function height(): int { $measure = function(RBNode $node) use (&$measure): int { return $node === $this->nil ? 0 : 1 + max($measure($node->left), $measure($node->right)); }; return $measure($this->root); }
    public function isValid(): bool {
        if ($this->root->color !== 'black') return false;
        $blackHeight = function(RBNode $node) use (&$blackHeight): int {
            if ($node === $this->nil) return 1;
            if ($node->color === 'red' && ($node->left->color === 'red' || $node->right->color === 'red')) return -1;
            $left = $blackHeight($node->left); $right = $blackHeight($node->right); return $left < 0 || $right < 0 || $left !== $right ? -1 : $left + ($node->color === 'black' ? 1 : 0);
        };
        return $blackHeight($this->root) >= 0;
    }
    public function getIterator(): \Traversable { $stack = []; $node = $this->root; while ($node !== $this->nil || $stack) { while ($node !== $this->nil) { $stack[] = $node; $node = $node->left; } $node = array_pop($stack); yield $node->value; $node = $node->right; } }
    public function toArray(): array { return iterator_to_array($this, false); }
}
