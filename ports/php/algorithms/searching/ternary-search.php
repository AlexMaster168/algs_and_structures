<?php
declare(strict_types=1);

namespace Ports\Algorithms\Searching;

function ternarySearchMax(callable $f, float $low, float $high, float $epsilon = 1e-9): float { while ($high-$low > $epsilon) { $m1 = $low+($high-$low)/3; $m2 = $high-($high-$low)/3; if ($f($m1) < $f($m2)) $low = $m1; else $high = $m2; } return ($low+$high)/2; }
function ternarySearchMin(callable $f, float $low, float $high, float $epsilon = 1e-9): float { return ternarySearchMax(fn($x) => -$f($x),$low,$high,$epsilon); }
function findPeakIndex(array $values): int { $low = 0; $high = count($values)-1; while ($low < $high) { $mid = ($low+$high)>>1; if ($values[$mid] < $values[$mid+1]) $low = $mid+1; else $high = $mid; } return $low; }
