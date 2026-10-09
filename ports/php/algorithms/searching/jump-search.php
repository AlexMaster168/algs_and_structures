<?php
declare(strict_types=1);

namespace Ports\Algorithms\Searching;

function jumpSearch(array $sorted, int|float $target): int { $n = count($sorted); if (!$n) return -1; $step = (int)floor(sqrt($n)); $previous = 0; $current = $step; while ($current < $n && $sorted[$current-1] < $target) { $previous = $current; $current += $step; } for ($i = $previous; $i < min($current,$n); $i++) if ($sorted[$i] == $target) return $i; return -1; }
