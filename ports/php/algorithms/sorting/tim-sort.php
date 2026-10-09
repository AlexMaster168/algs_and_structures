<?php
declare(strict_types=1);

namespace Ports\Algorithms\Sorting;

use function Ports\Shared\defaultCompare;
function minRunLength(int $n): int { $remainder = 0; while ($n >= 32) { $remainder |= $n & 1; $n >>= 1; } return $n+$remainder; }
function mergeRuns(array &$array, int $left, int $middle, int $right, callable $compare): void { $a = array_slice($array,$left,$middle-$left+1); $b = array_slice($array,$middle+1,$right-$middle); $i = $j = 0; $k = $left; while ($i < count($a) && $j < count($b)) $array[$k++] = $compare($a[$i],$b[$j]) <= 0 ? $a[$i++] : $b[$j++]; while ($i < count($a)) $array[$k++] = $a[$i++]; while ($j < count($b)) $array[$k++] = $b[$j++]; }
function timSort(array $input, ?callable $compare = null): array { $compare ??= defaultCompare(...); $array = array_values($input); $n = count($array); $run = minRunLength($n); for ($start = 0; $start < $n; $start += $run) insertionSortRange($array,$start,min($start+$run-1,$n-1),$compare); for ($size = $run; $size < $n; $size *= 2) for ($left = 0; $left < $n; $left += 2*$size) { $middle = $left+$size-1; $right = min($left+2*$size-1,$n-1); if ($middle < $right) mergeRuns($array,$left,$middle,$right,$compare); } return $array; }
