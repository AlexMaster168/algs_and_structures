<?php
declare(strict_types=1);
namespace Ports\DataStructures\Trees;

class TrieNode { public array $children = []; public bool $isWord = false; public int $passCount = 0; }
class Trie {
    private TrieNode $root;
    private int $count = 0;
    public function __construct() { $this->root = new TrieNode(); }
    public static function from(iterable $words): self { $trie = new self(); foreach ($words as $word) $trie->insert($word); return $trie; }
    public function __get(string $name): int { return $this->count; }
    private function chars(string $word): array { return preg_split('//u', $word, -1, PREG_SPLIT_NO_EMPTY); }
    private function walk(string $prefix): ?TrieNode { $node = $this->root; foreach ($this->chars($prefix) as $char) { $node = $node->children[$char] ?? null; if (!$node) return null; } return $node; }
    public function has(string $word): bool { return $this->walk($word)?->isWord ?? false; }
    public function startsWith(string $prefix): bool { return $this->walk($prefix) !== null; }
    public function countWithPrefix(string $prefix): int { return $this->walk($prefix)?->passCount ?? 0; }
    public function insert(string $word): bool {
        if ($this->has($word)) return false; $node = $this->root; $node->passCount++;
        foreach ($this->chars($word) as $char) { $node->children[$char] ??= new TrieNode(); $node = $node->children[$char]; $node->passCount++; }
        $node->isWord = true; $this->count++; return true;
    }
    public function wordsWithPrefix(string $prefix): array {
        $node = $this->walk($prefix); if (!$node) return []; $words = [];
        $collect = function(TrieNode $current, string $path) use (&$collect, &$words): void { if ($current->isWord) $words[] = $path; $children = $current->children; ksort($children, SORT_STRING); foreach ($children as $char => $child) $collect($child, $path . $char); };
        $collect($node, $prefix); return $words;
    }
    public function delete(string $word): bool {
        if (!$this->has($word)) return false; $node = $this->root; $node->passCount--; $this->count--;
        foreach ($this->chars($word) as $char) { $next = $node->children[$char]; if (--$next->passCount === 0) { unset($node->children[$char]); return true; } $node = $next; }
        $node->isWord = false; return true;
    }
}
