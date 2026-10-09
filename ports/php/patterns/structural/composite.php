<?php
declare(strict_types=1);
namespace Ports\Patterns\Structural;

interface FileSystemNode { public function size(): int|float; public function render(string $indent = ''): array; }
class FileEntry implements FileSystemNode {
    public function __construct(public readonly string $name, private int|float $bytes) {}
    public function size(): int|float { return $this->bytes; }
    public function render(string $indent = ''): array { return ["$indent$this->name ($this->bytes)"]; }
}
class Directory implements FileSystemNode {
    private array $children = [];
    public function __construct(public readonly string $name) {}
    public function add(FileSystemNode ...$nodes): static { array_push($this->children, ...$nodes); return $this; }
    public function remove(string $name): bool { foreach ($this->children as $i => $child) if ($child->name === $name) { array_splice($this->children, $i, 1); return true; } return false; }
    public function size(): int|float { return array_sum(array_map(fn($child) => $child->size(), $this->children)); }
    public function render(string $indent = ''): array { $lines = ["$indent$this->name/ ({$this->size()})"]; foreach ($this->children as $child) array_push($lines, ...$child->render($indent . '  ')); return $lines; }
}
