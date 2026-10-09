<?php
declare(strict_types=1);

namespace Ports\Algorithms\Sorting;

use function Ports\Shared\defaultCompare;
function selectionSort(array $input, ?callable $compare = null): array {
    $compare ??= defaultCompare(...); $array = array_values($input);
    for ($i = 0; $i < count($array)-1; $i++) { $min = $i; for ($j = $i+1; $j < count($array); $j++) if ($compare($array[$j], $array[$min]) < 0) $min = $j; if ($min !== $i) [$array[$i], $array[$min]] = [$array[$min], $array[$i]]; }
    return $array;
}
