<?php
declare(strict_types=1);

namespace Ports\Algorithms\Searching;

use function Ports\Shared\defaultCompare;
function binarySearch(array $sorted, mixed $target, ?callable $compare = null, int $low = 0, ?int $high = null): int { $compare ??= defaultCompare(...); $high ??= count($sorted)-1; while ($low <= $high) { $mid = $low+(($high-$low)>>1); $order = $compare($sorted[$mid],$target); if ($order == 0) return $mid; if ($order < 0) $low = $mid+1; else $high = $mid-1; } return -1; }
function binarySearchRecursive(array $sorted, mixed $target, ?callable $compare = null, int $low = 0, ?int $high = null): int { $compare ??= defaultCompare(...); $high ??= count($sorted)-1; if ($low > $high) return -1; $mid = $low+(($high-$low)>>1); $order = $compare($sorted[$mid],$target); if ($order == 0) return $mid; return $order < 0 ? binarySearchRecursive($sorted,$target,$compare,$mid+1,$high) : binarySearchRecursive($sorted,$target,$compare,$low,$mid-1); }
function lowerBound(array $sorted, mixed $target, ?callable $compare = null): int { $compare ??= defaultCompare(...); $low = 0; $high = count($sorted); while ($low < $high) { $mid = ($low+$high)>>1; if ($compare($sorted[$mid],$target) < 0) $low = $mid+1; else $high = $mid; } return $low; }
function upperBound(array $sorted, mixed $target, ?callable $compare = null): int { $compare ??= defaultCompare(...); $low = 0; $high = count($sorted); while ($low < $high) { $mid = ($low+$high)>>1; if ($compare($sorted[$mid],$target) <= 0) $low = $mid+1; else $high = $mid; } return $low; }
function firstTrue(int $low, int $high, callable $predicate): int { while ($low < $high) { $mid = $low+intdiv($high-$low,2); if ($predicate($mid)) $high = $mid; else $low = $mid+1; } return $low; }
