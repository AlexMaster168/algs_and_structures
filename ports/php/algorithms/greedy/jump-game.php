<?php
declare(strict_types=1);

namespace Ports\Algorithms\Greedy;

use function Ports\Algorithms\Sorting\mergeSort;
function canReachEnd(array $jumps): bool { $farthest = 0; foreach ($jumps as $i => $jump) { if ($i > $farthest) return false; $farthest = max($farthest,$i+$jump); } return true; }
function minJumps(array $jumps): int { $count = $currentEnd = $farthest = 0; for ($i = 0; $i < count($jumps)-1; $i++) { $farthest = max($farthest,$i+$jumps[$i]); if ($i === $currentEnd) { if ($farthest <= $i) return -1; $count++; $currentEnd = $farthest; } } return $count; }
function greedyChange(int $amount,array $denominations): array { $result = []; foreach (mergeSort($denominations,fn($a,$b) => $b <=> $a) as $coin) { if ($coin <= 0) throw new \RangeException('Denominations must be positive'); while ($amount >= $coin) { $result[] = $coin; $amount -= $coin; } } return $result; }
