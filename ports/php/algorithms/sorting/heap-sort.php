<?php
declare(strict_types=1);

namespace Ports\Algorithms\Sorting;

use function Ports\Shared\defaultCompare;
function siftDown(array &$array, int $start, int $end, callable $compare): void { $root = $start; while (true) { $left = 2*$root+1; $right = $left+1; $largest = $root; if ($left < $end && $compare($array[$left],$array[$largest]) > 0) $largest = $left; if ($right < $end && $compare($array[$right],$array[$largest]) > 0) $largest = $right; if ($largest === $root) return; [$array[$root],$array[$largest]] = [$array[$largest],$array[$root]]; $root = $largest; } }
function heapSort(array $input, ?callable $compare = null): array { $compare ??= defaultCompare(...); $array = array_values($input); for ($i = (count($array)>>1)-1; $i >= 0; $i--) siftDown($array,$i,count($array),$compare); for ($end = count($array)-1; $end > 0; $end--) { [$array[0],$array[$end]] = [$array[$end],$array[0]]; siftDown($array,0,$end,$compare); } return $array; }
