<?php
declare(strict_types=1);
namespace Ports\DataStructures\RangeQueries;

class SegmentTree {
    private int $n;
    private array $tree;
    private \Closure $combine;
    public function __construct(array $values, callable $combine, private mixed $identity) {
        $this->n = count($values); $this->combine = $combine(...); $this->tree = array_fill(0, 2 * $this->n, $identity);
        foreach ($values as $i => $value) $this->tree[$this->n + $i] = $value;
        for ($i = $this->n - 1; $i > 0; $i--) $this->tree[$i] = $combine($this->tree[2 * $i], $this->tree[2 * $i + 1]);
    }
    public function __get(string $name): int { return $this->n; }
    private function assertIndex(int $index): void { if ($index < 0 || $index >= $this->n) throw new \OutOfRangeException('Invalid index'); }
    public function get(int $index): mixed { $this->assertIndex($index); return $this->tree[$this->n + $index]; }
    public function update(int $index, mixed $value): void {
        $this->assertIndex($index); $position = $this->n + $index; $this->tree[$position] = $value;
        for ($position >>= 1; $position > 0; $position >>= 1) $this->tree[$position] = ($this->combine)($this->tree[2 * $position], $this->tree[2 * $position + 1]);
    }
    public function query(int $left, int $right): mixed {
        if ($left < 0 || $right >= $this->n || $left > $right) throw new \OutOfRangeException('Invalid range');
        $a = $b = $this->identity;
        for ($l = $left + $this->n, $r = $right + $this->n + 1; $l < $r; $l >>= 1, $r >>= 1) {
            if ($l & 1) $a = ($this->combine)($a, $this->tree[$l++]);
            if ($r & 1) $b = ($this->combine)($this->tree[--$r], $b);
        }
        return ($this->combine)($a, $b);
    }
}
function sumSegmentTree(array $values): SegmentTree { return new SegmentTree($values, fn($a, $b) => $a + $b, 0); }
function minSegmentTree(array $values): SegmentTree { return new SegmentTree($values, min(...), INF); }
function maxSegmentTree(array $values): SegmentTree { return new SegmentTree($values, max(...), -INF); }
