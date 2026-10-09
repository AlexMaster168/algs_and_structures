<?php
declare(strict_types=1);

namespace Ports\Algorithms\Techniques;

use Ports\Shared\Map;
use function Ports\Algorithms\Sorting\mergeSort;
function twoSumSorted(array $sorted,int|float $target): ?array { $left = 0; $right = count($sorted)-1; while ($left < $right) { $sum = $sorted[$left]+$sorted[$right]; if ($sum == $target) return [$left,$right]; if ($sum < $target) $left++; else $right--; } return null; }
function twoSum(array $values,int|float $target): ?array { $seen = new Map(); foreach ($values as $i => $value) { $j = $seen->get($target-$value); if ($j !== null) return [$j,$i]; $seen->set($value,$i); } return null; }
function threeSum(array $values,int|float $target = 0): array { $sorted = mergeSort($values); $result = []; for ($i = 0; $i < count($sorted)-2; $i++) { if ($i > 0 && $sorted[$i] === $sorted[$i-1]) continue; $left = $i+1; $right = count($sorted)-1; while ($left < $right) { $sum = $sorted[$i]+$sorted[$left]+$sorted[$right]; if ($sum < $target) $left++; elseif ($sum > $target) $right--; else { $result[] = [$sorted[$i],$sorted[$left],$sorted[$right]]; while ($left < $right && $sorted[$left] === $sorted[$left+1]) $left++; while ($left < $right && $sorted[$right] === $sorted[$right-1]) $right--; $left++; $right--; } } } return $result; }
function containerWithMostWater(array $heights): int|float { $best = 0; for ($left = 0,$right = count($heights)-1; $left < $right;) { $best = max($best,min($heights[$left],$heights[$right])*($right-$left)); if ($heights[$left] < $heights[$right]) $left++; else $right--; } return $best; }
function removeDuplicatesSorted(array &$sorted): int { $write = 0; for ($read = 0; $read < count($sorted); $read++) if ($read === 0 || $sorted[$read] !== $sorted[$write-1]) $sorted[$write++] = $sorted[$read]; $sorted = array_slice($sorted,0,$write); return $write; }
function dutchNationalFlag(array &$values,int|float $pivot): array { $low = $mid = 0; $high = count($values)-1; while ($mid <= $high) { if ($values[$mid] < $pivot) { [$values[$low],$values[$mid]] = [$values[$mid],$values[$low]]; $low++; $mid++; } elseif ($values[$mid] > $pivot) { [$values[$mid],$values[$high]] = [$values[$high],$values[$mid]]; $high--; } else $mid++; } return $values; }
function hasCycleFloyd(mixed $start,callable $next): bool { $slow = $fast = $start; while ($fast !== null) { $fast = $next($fast); if ($fast === null) return false; $fast = $next($fast); $slow = $next($slow); if ($fast !== null && $fast === $slow) return true; } return false; }
