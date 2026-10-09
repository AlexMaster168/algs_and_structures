<?php
declare(strict_types=1);

namespace Ports\Algorithms\Sorting;

use function Ports\Shared\defaultCompare;
function cocktailShakerSort(array $input, ?callable $compare = null): array {
    $compare ??= defaultCompare(...); $array = array_values($input); $start = 0; $end = count($array)-1; $swapped = true;
    $swap = function(int $i) use (&$array, &$swapped, $compare): void { if ($compare($array[$i], $array[$i+1]) > 0) { [$array[$i], $array[$i+1]] = [$array[$i+1], $array[$i]]; $swapped = true; } };
    while ($swapped && $start < $end) { $swapped = false; for ($i = $start; $i < $end; $i++) $swap($i); $end--; if (!$swapped) break; $swapped = false; for ($i = $end-1; $i >= $start; $i--) $swap($i); $start++; }
    return $array;
}
