<?php
declare(strict_types=1);

function binarySearch(array $values, int $target): int
{
    $left = 0;
    $right = count($values);
    while ($left < $right) {
        $middle = $left + intdiv($right - $left, 2);
        if ($values[$middle] < $target) $left = $middle + 1;
        else $right = $middle;
    }
    return $left < count($values) && $values[$left] === $target ? $left : -1;
}
