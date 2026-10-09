<?php
declare(strict_types=1);

namespace Ports\DataStructures\Graphs;

class DisjointSet {
    private array $parent; private array $sizes; private int $sets;
    public function __construct(int $size) { $this->parent = $size ? range(0,$size-1) : []; $this->sizes = array_fill(0,$size,1); $this->sets = $size; }
    public function __get(string $name): int { return $this->sets; }
    public function find(int $x): int { $root = $x; while ($this->parent[$root] !== $root) $root = $this->parent[$root]; while ($this->parent[$x] !== $root) { $next = $this->parent[$x]; $this->parent[$x] = $root; $x = $next; } return $root; }
    public function union(int $a,int $b): bool { $ra = $this->find($a); $rb = $this->find($b); if ($ra === $rb) return false; if ($this->sizes[$ra] < $this->sizes[$rb]) [$ra,$rb] = [$rb,$ra]; $this->parent[$rb] = $ra; $this->sizes[$ra] += $this->sizes[$rb]; $this->sets--; return true; }
    public function connected(int $a,int $b): bool { return $this->find($a) === $this->find($b); }
    public function sizeOf(int $x): int { return $this->sizes[$this->find($x)]; }
}
