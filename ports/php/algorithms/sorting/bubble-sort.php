<?php
declare(strict_types=1);

namespace Ports\Algorithms\Sorting;

use function Ports\Shared\defaultCompare;
function bubbleSort(array $input, ?callable $compare = null): array {
    $compare ??= defaultCompare(...); $array = array_values($input);
    for ($end = count($array) - 1; $end > 0; $end--) { $swapped = false; for ($i = 0; $i < $end; $i++) if ($compare($array[$i], $array[$i+1]) > 0) { [$array[$i], $array[$i+1]] = [$array[$i+1], $array[$i]]; $swapped = true; } if (!$swapped) break; }
    return $array;
}
