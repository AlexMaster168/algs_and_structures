<?php
declare(strict_types=1);

namespace Ports\Algorithms\DynamicProgramming;

use function Ports\Shared\{units,fromUnits};
function longestCommonSubsequence(string $a, string $b): string { $a = units($a); $b = units($b); $table = array_fill(0,count($a)+1,array_fill(0,count($b)+1,0)); for ($i = 1; $i <= count($a); $i++) for ($j = 1; $j <= count($b); $j++) $table[$i][$j] = $a[$i-1] === $b[$j-1] ? $table[$i-1][$j-1]+1 : max($table[$i-1][$j],$table[$i][$j-1]); $result = []; for ($i = count($a),$j = count($b); $i > 0 && $j > 0;) { if ($a[$i-1] === $b[$j-1]) { $result[] = $a[--$i]; $j--; } elseif ($table[$i-1][$j] >= $table[$i][$j-1]) $i--; else $j--; } return fromUnits(array_reverse($result)); }
function longestCommonSubstring(string $a, string $b): string { $a = units($a); $b = units($b); $previous = array_fill(0,count($b)+1,0); $bestLength = $bestEnd = 0; for ($i = 1; $i <= count($a); $i++) { $current = array_fill(0,count($b)+1,0); for ($j = 1; $j <= count($b); $j++) if ($a[$i-1] === $b[$j-1]) { $current[$j] = $previous[$j-1]+1; if ($current[$j] > $bestLength) { $bestLength = $current[$j]; $bestEnd = $i; } } $previous = $current; } return fromUnits(array_slice($a,$bestEnd-$bestLength,$bestLength)); }
