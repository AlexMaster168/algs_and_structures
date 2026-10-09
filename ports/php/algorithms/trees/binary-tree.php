<?php
declare(strict_types=1);

namespace Ports\Algorithms\Trees;

class TreeNode { public function __construct(public mixed $value,public ?TreeNode $left = null,public ?TreeNode $right = null) {} }
function treeNode(mixed $value,?TreeNode $left = null,?TreeNode $right = null): TreeNode { return new TreeNode($value,$left,$right); }
function fromLevelOrder(array $values): ?TreeNode { if (!$values || $values[0] === null) return null; $root = treeNode($values[0]); $queue = [$root]; $i = 1; for ($head = 0; $head < count($queue) && $i < count($values); $head++) { $node = $queue[$head]; foreach (['left','right'] as $side) { $value = $values[$i++] ?? null; if ($value === null) continue; $node->$side = treeNode($value); $queue[] = $node->$side; } } return $root; }
function preOrder(?TreeNode $root): array { $result = []; $stack = $root ? [$root] : []; while ($stack) { $node = array_pop($stack); $result[] = $node->value; if ($node->right) $stack[] = $node->right; if ($node->left) $stack[] = $node->left; } return $result; }
function inOrder(?TreeNode $root): array { $result = $stack = []; $current = $root; while ($current || $stack) { while ($current) { $stack[] = $current; $current = $current->left; } $node = array_pop($stack); $result[] = $node->value; $current = $node->right; } return $result; }
function postOrder(?TreeNode $root): array { $result = []; $stack = $root ? [$root] : []; while ($stack) { $node = array_pop($stack); $result[] = $node->value; if ($node->left) $stack[] = $node->left; if ($node->right) $stack[] = $node->right; } return array_reverse($result); }
function levelOrder(?TreeNode $root): array { $levels = []; $level = $root ? [$root] : []; while ($level) { $levels[] = array_map(fn($node) => $node->value,$level); $next = []; foreach ($level as $node) { if ($node->left) $next[] = $node->left; if ($node->right) $next[] = $node->right; } $level = $next; } return $levels; }
function maxDepth(?TreeNode $root): int { return $root ? 1+max(maxDepth($root->left),maxDepth($root->right)) : 0; }
function maxValue(?TreeNode $root): int|float|null { $values = preOrder($root); return $values ? max($values) : null; }
function isValidBst(?TreeNode $root,int|float $low = -INF,int|float $high = INF): bool { return !$root || ($root->value > $low && $root->value < $high && isValidBst($root->left,$low,$root->value) && isValidBst($root->right,$root->value,$high)); }
function invertTree(?TreeNode $root): ?TreeNode { if (!$root) return null; [$root->left,$root->right] = [invertTree($root->right),invertTree($root->left)]; return $root; }
function lowestCommonAncestorBst(?TreeNode $root,int|float $a,int|float $b): ?TreeNode { $current = $root; while ($current) { if ($a < $current->value && $b < $current->value) $current = $current->left; elseif ($a > $current->value && $b > $current->value) $current = $current->right; else return $current; } return null; }
