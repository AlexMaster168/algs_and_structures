<?php
declare(strict_types=1);

namespace Ports\Algorithms\Techniques;

use Ports\Shared\Map;
class PrefixSums {
    private array $prefix = [0];
    public function __construct(array $values) { foreach ($values as $value) $this->prefix[] = $this->prefix[count($this->prefix)-1]+$value; }
    public function sum(int $left,int $right): int|float { return $this->prefix[$right+1]-$this->prefix[$left]; }
}
class PrefixSums2D {
    private array $prefix;
    public function __construct(array $matrix) { $rows = count($matrix); $cols = count($matrix[0] ?? []); $this->prefix = array_fill(0,$rows+1,array_fill(0,$cols+1,0)); for ($r = 0; $r < $rows; $r++) for ($c = 0; $c < $cols; $c++) $this->prefix[$r+1][$c+1] = $matrix[$r][$c]+$this->prefix[$r][$c+1]+$this->prefix[$r+1][$c]-$this->prefix[$r][$c]; }
    public function sum(int $top,int $left,int $bottom,int $right): int|float { $p = $this->prefix; return $p[$bottom+1][$right+1]-$p[$top][$right+1]-$p[$bottom+1][$left]+$p[$top][$left]; }
}
function subarraySumEquals(array $values,int|float $target): int { $seen = new Map([[0,1]]); $sum = $count = 0; foreach ($values as $value) { $sum += $value; $count += $seen->get($sum-$target) ?? 0; $seen->set($sum,($seen->get($sum) ?? 0)+1); } return $count; }
function differenceArrayApply(int $length,array $updates): array { $diff = array_fill(0,$length+1,0); foreach ($updates as [$left,$right,$delta]) { $diff[$left] += $delta; $diff[$right+1] -= $delta; } $result = []; $running = 0; for ($i = 0; $i < $length; $i++) $result[] = ($running += $diff[$i]); return $result; }
function majorityElement(array $values): int|float|null { $candidate = null; $count = 0; foreach ($values as $value) { if ($count === 0) $candidate = $value; $count += $value === $candidate ? 1 : -1; } return count(array_filter($values,fn($v) => $v === $candidate)) > count($values)/2 ? $candidate : null; }
