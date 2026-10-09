<?php
declare(strict_types=1);
namespace Ports\DataStructures\RangeQueries;

class FenwickTree {
    private array $tree;
    public function __construct(int|array $sizeOrValues) {
        if (is_int($sizeOrValues)) { $this->tree = array_fill(0, $sizeOrValues + 1, 0); return; }
        $this->tree = [0, ...$sizeOrValues]; $n = count($sizeOrValues);
        for ($i = 1; $i <= $n; $i++) { $parent = $i + ($i & -$i); if ($parent <= $n) $this->tree[$parent] += $this->tree[$i]; }
    }
    public function __get(string $name): int { return count($this->tree) - 1; }
    public function add(int $index, int|float $delta): void {
        if ($index < 0 || $index >= $this->size) throw new \OutOfRangeException('Invalid index');
        for ($i = $index + 1; $i < count($this->tree); $i += $i & -$i) $this->tree[$i] += $delta;
    }
    public function set(int $index, int|float $value): void { $this->add($index, $value - $this->rangeSum($index, $index)); }
    public function prefixSum(int $index): int|float { $sum = 0; for ($i = min($index + 1, $this->size); $i > 0; $i -= $i & -$i) $sum += $this->tree[$i]; return $sum; }
    public function rangeSum(int $left, int $right): int|float { return $this->prefixSum($right) - ($left > 0 ? $this->prefixSum($left - 1) : 0); }
}
