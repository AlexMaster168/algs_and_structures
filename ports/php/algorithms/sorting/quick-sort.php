<?php
declare(strict_types=1);

namespace Ports\Algorithms\Sorting;

use function Ports\Shared\defaultCompare;
function partition3(array &$array, int $low, int $high, callable $compare): array {
    $pivot = $array[random_int($low, $high)]; $lt = $low; $gt = $high; $i = $low;
    while ($i <= $gt) { $order = $compare($array[$i], $pivot); if ($order < 0) { [$array[$lt], $array[$i]] = [$array[$i], $array[$lt]]; $lt++; $i++; } elseif ($order > 0) { [$array[$i], $array[$gt]] = [$array[$gt], $array[$i]]; $gt--; } else $i++; } return [$lt, $gt];
}
function quickSort(array $input, ?callable $compare = null): array { $compare ??= defaultCompare(...); $array = array_values($input); $stack = [[0, count($array)-1]]; while ($stack) { [$low, $high] = array_pop($stack); if ($low >= $high) continue; [$lt, $gt] = partition3($array, $low, $high, $compare); $stack[] = [$low, $lt-1]; $stack[] = [$gt+1, $high]; } return $array; }
function lomutoPartition(array &$array, int $low, int $high, callable $compare): int { $pivot = $array[$high]; $boundary = $low; for ($i = $low; $i < $high; $i++) if ($compare($array[$i], $pivot) < 0) { [$array[$boundary], $array[$i]] = [$array[$i], $array[$boundary]]; $boundary++; } [$array[$boundary], $array[$high]] = [$array[$high], $array[$boundary]]; return $boundary; }
function quickSortFunctional(array $input, ?callable $compare = null): array { $compare ??= defaultCompare(...); if (count($input) <= 1) return array_values($input); $pivot = $input[0]; $less = $greater = []; foreach (array_slice($input,1) as $value) { if ($compare($value, $pivot) < 0) $less[] = $value; else $greater[] = $value; } return [...quickSortFunctional($less,$compare), $pivot, ...quickSortFunctional($greater,$compare)]; }
