<?php
declare(strict_types=1);

namespace Ports\Algorithms\Techniques;

use Ports\DataStructures\Linear\Deque;
use function Ports\Shared\{units,fromUnits};
function maxSumWindow(array $values,int $size): int|float { if ($size <= 0 || $size > count($values)) throw new \RangeException('Invalid window size'); $sum = array_sum(array_slice($values,0,$size)); $best = $sum; for ($i = $size; $i < count($values); $i++) { $sum += $values[$i]-$values[$i-$size]; $best = max($best,$sum); } return $best; }
function slidingWindowMaximum(array $values,int $size): array { $window = new Deque(); $result = []; foreach ($values as $i => $value) { while (!$window->isEmpty() && $window->peekFront() <= $i-$size) $window->popFront(); while (!$window->isEmpty() && $values[$window->peekBack()] <= $value) $window->popBack(); $window->pushBack($i); if ($i >= $size-1) $result[] = $values[$window->peekFront()]; } return $result; }
function longestUniqueSubstring(string $s): string { $s = units($s); $lastSeen = []; $start = $bestStart = $bestLength = 0; foreach ($s as $end => $char) { $previous = $lastSeen[$char] ?? null; if ($previous !== null && $previous >= $start) $start = $previous+1; $lastSeen[$char] = $end; if ($end-$start+1 > $bestLength) { $bestLength = $end-$start+1; $bestStart = $start; } } return fromUnits(array_slice($s,$bestStart,$bestLength)); }
function minWindowSubstring(string $s,string $required): string { if ($required === '') return ''; $s = units($s); $required = units($required); $need = []; foreach ($required as $char) $need[$char] = ($need[$char] ?? 0)+1; $missing = count($required); $bestStart = 0; $bestLength = INF; for ($left = 0,$right = 0; $right < count($s); $right++) { $char = $s[$right]; if (($need[$char] ?? 0) > 0) $missing--; $need[$char] = ($need[$char] ?? 0)-1; while ($missing === 0) { if ($right-$left+1 < $bestLength) { $bestLength = $right-$left+1; $bestStart = $left; } $leftChar = $s[$left++]; $need[$leftChar]++; if ($need[$leftChar] > 0) $missing++; } } return $bestLength === INF ? '' : fromUnits(array_slice($s,$bestStart,$bestLength)); }
