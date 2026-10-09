<?php
declare(strict_types=1);

namespace Ports\Algorithms\Searching;

function interpolationSearch(array $sorted, int|float $target): int { $low = 0; $high = count($sorted)-1; while ($low <= $high && $target >= $sorted[$low] && $target <= $sorted[$high]) { if ($sorted[$high] == $sorted[$low]) return $sorted[$low] == $target ? $low : -1; $position = $low+(int)floor((($target-$sorted[$low])*($high-$low))/($sorted[$high]-$sorted[$low])); $value = $sorted[$position]; if ($value == $target) return $position; if ($value < $target) $low = $position+1; else $high = $position-1; } return -1; }
