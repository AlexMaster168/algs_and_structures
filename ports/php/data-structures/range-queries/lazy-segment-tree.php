<?php
declare(strict_types=1);
namespace Ports\DataStructures\RangeQueries;

class LazySegmentTree {
    private int $n;
    private array $sums, $pending;
    public function __construct(array $values) {
        $this->n = count($values); $this->sums = $this->pending = array_fill(0, 4 * max(1, $this->n), 0);
        if ($this->n > 0) $this->build(1, 0, $this->n - 1, $values);
    }
    public function __get(string $name): int { return $this->n; }
    private function assertRange(int $left, int $right): void { if ($left < 0 || $right >= $this->n || $left > $right) throw new \OutOfRangeException('Invalid range'); }
    public function rangeAdd(int $left, int $right, int|float $delta): void { $this->assertRange($left, $right); $this->add(1, 0, $this->n - 1, $left, $right, $delta); }
    public function rangeSum(int $left, int $right): int|float { $this->assertRange($left, $right); return $this->sum(1, 0, $this->n - 1, $left, $right); }
    private function build(int $node, int $start, int $end, array $values): void {
        if ($start === $end) { $this->sums[$node] = $values[$start]; return; }
        $mid = ($start + $end) >> 1; $this->build(2 * $node, $start, $mid, $values); $this->build(2 * $node + 1, $mid + 1, $end, $values); $this->sums[$node] = $this->sums[2 * $node] + $this->sums[2 * $node + 1];
    }
    private function apply(int $node, int $start, int $end, int|float $delta): void { $this->sums[$node] += $delta * ($end - $start + 1); $this->pending[$node] += $delta; }
    private function push(int $node, int $start, int $end): void {
        $delta = $this->pending[$node]; if ($delta == 0) return; $mid = ($start + $end) >> 1;
        $this->apply(2 * $node, $start, $mid, $delta); $this->apply(2 * $node + 1, $mid + 1, $end, $delta); $this->pending[$node] = 0;
    }
    private function add(int $node, int $start, int $end, int $left, int $right, int|float $delta): void {
        if ($right < $start || $end < $left) return;
        if ($left <= $start && $end <= $right) { $this->apply($node, $start, $end, $delta); return; }
        $this->push($node, $start, $end); $mid = ($start + $end) >> 1; $this->add(2 * $node, $start, $mid, $left, $right, $delta); $this->add(2 * $node + 1, $mid + 1, $end, $left, $right, $delta); $this->sums[$node] = $this->sums[2 * $node] + $this->sums[2 * $node + 1];
    }
    private function sum(int $node, int $start, int $end, int $left, int $right): int|float {
        if ($right < $start || $end < $left) return 0;
        if ($left <= $start && $end <= $right) return $this->sums[$node];
        $this->push($node, $start, $end); $mid = ($start + $end) >> 1;
        return $this->sum(2 * $node, $start, $mid, $left, $right) + $this->sum(2 * $node + 1, $mid + 1, $end, $left, $right);
    }
}
