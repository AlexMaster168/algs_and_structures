<?php
declare(strict_types=1);
namespace Ports\DataStructures\RangeQueries;

class SqrtDecomposition {
    private array $values, $blockSums;
    private int $blockSize;
    public function __construct(array $values) {
        $this->values = $values; $this->blockSize = max(1, (int)ceil(sqrt(count($values)))); $this->blockSums = array_fill(0, (int)ceil(count($values) / $this->blockSize), 0);
        foreach ($values as $i => $value) $this->blockSums[intdiv($i, $this->blockSize)] += $value;
    }
    public function update(int $index, int|float $value): void { $this->blockSums[intdiv($index, $this->blockSize)] += $value - $this->values[$index]; $this->values[$index] = $value; }
    public function rangeSum(int $left, int $right): int|float {
        $sum = 0; $i = $left;
        while ($i <= $right && $i % $this->blockSize !== 0) $sum += $this->values[$i++];
        while ($i + $this->blockSize - 1 <= $right) { $sum += $this->blockSums[intdiv($i, $this->blockSize)]; $i += $this->blockSize; }
        while ($i <= $right) $sum += $this->values[$i++];
        return $sum;
    }
}
