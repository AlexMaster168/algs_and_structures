<?php
declare(strict_types=1);

function mergeSort(array $values): array
{
    if (count($values) < 2) return $values;
    $middle = intdiv(count($values), 2);
    $left = mergeSort(array_slice($values, 0, $middle));
    $right = mergeSort(array_slice($values, $middle));
    $result = [];
    $i = $j = 0;
    while ($i < count($left) && $j < count($right)) {
        $result[] = $left[$i] <= $right[$j] ? $left[$i++] : $right[$j++];
    }
    return array_merge($result, array_slice($left, $i), array_slice($right, $j));
}
