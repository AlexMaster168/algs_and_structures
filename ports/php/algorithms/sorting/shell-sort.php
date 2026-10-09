<?php
declare(strict_types=1);

namespace Ports\Algorithms\Sorting;

use function Ports\Shared\defaultCompare;
function shellSort(array $input, ?callable $compare = null): array { $compare ??= defaultCompare(...); $array = array_values($input); $gap = 1; while ($gap < count($array)/3) $gap = $gap*3+1; for (; $gap >= 1; $gap = intdiv($gap-1,3)) for ($i = $gap; $i < count($array); $i++) { $current = $array[$i]; $j = $i; while ($j >= $gap && $compare($array[$j-$gap],$current) > 0) { $array[$j] = $array[$j-$gap]; $j -= $gap; } $array[$j] = $current; } return $array; }
