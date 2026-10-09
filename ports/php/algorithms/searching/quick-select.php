<?php
declare(strict_types=1);

namespace Ports\Algorithms\Searching;

use function Ports\Shared\defaultCompare;
use function Ports\Algorithms\Sorting\lomutoPartition;
function quickSelect(array $input, int $k, ?callable $compare = null): mixed { $compare ??= defaultCompare(...); if ($k < 0 || $k >= count($input)) throw new \RangeException("k=$k is out of bounds"); $array = array_values($input); $low = 0; $high = count($array)-1; while (true) { $pivot = random_int($low,$high); [$array[$pivot],$array[$high]] = [$array[$high],$array[$pivot]]; $position = lomutoPartition($array,$low,$high,$compare); if ($position === $k) return $array[$position]; if ($position < $k) $low = $position+1; else $high = $position-1; } }
function median(array $values): int|float { if (!$values) throw new \RangeException('Median of an empty array is undefined'); $middle = count($values)>>1; return count($values)%2 ? quickSelect($values,$middle) : (quickSelect($values,$middle-1)+quickSelect($values,$middle))/2; }
