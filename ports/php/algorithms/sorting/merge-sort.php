<?php
declare(strict_types=1);

namespace Ports\Algorithms\Sorting;

use function Ports\Shared\defaultCompare;
function merge(array $left, array $right, ?callable $compare = null): array {
    $compare ??= defaultCompare(...); $result = []; $i = $j = 0;
    while ($i < count($left) && $j < count($right)) $result[] = $compare($left[$i], $right[$j]) <= 0 ? $left[$i++] : $right[$j++];
    while ($i < count($left)) $result[] = $left[$i++]; while ($j < count($right)) $result[] = $right[$j++]; return $result;
}
function mergeSort(array $input, ?callable $compare = null): array { if (count($input) <= 1) return array_values($input); $middle = count($input) >> 1; return merge(mergeSort(array_slice($input, 0, $middle), $compare), mergeSort(array_slice($input, $middle), $compare), $compare); }
function bottomUpMergeSort(array $input, ?callable $compare = null): array {
    $compare ??= defaultCompare(...); $source = array_values($input); $n = count($source); $target = array_fill(0, $n, null);
    for ($width = 1; $width < $n; $width *= 2) { for ($left = 0; $left < $n; $left += 2*$width) { $middle = min($left+$width, $n); $right = min($left+2*$width, $n); $i = $left; $j = $middle; $k = $left; while ($i < $middle && $j < $right) $target[$k++] = $compare($source[$i], $source[$j]) <= 0 ? $source[$i++] : $source[$j++]; while ($i < $middle) $target[$k++] = $source[$i++]; while ($j < $right) $target[$k++] = $source[$j++]; } [$source, $target] = [$target, $source]; }
    return $source;
}
