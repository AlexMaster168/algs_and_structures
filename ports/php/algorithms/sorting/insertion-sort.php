<?php
declare(strict_types=1);

namespace Ports\Algorithms\Sorting;

use function Ports\Shared\defaultCompare;
function insertionSortRange(array &$array, int $left, int $right, callable $compare): void {
    for ($i = $left + 1; $i <= $right; $i++) { $current = $array[$i]; $j = $i - 1; while ($j >= $left && $compare($array[$j], $current) > 0) { $array[$j+1] = $array[$j]; $j--; } $array[$j+1] = $current; }
}
function insertionSort(array $input, ?callable $compare = null): array { $compare ??= defaultCompare(...); $array = array_values($input); insertionSortRange($array, 0, count($array)-1, $compare); return $array; }
