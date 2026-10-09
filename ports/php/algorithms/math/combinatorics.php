<?php
declare(strict_types=1);

namespace Ports\Algorithms\Math;

function factorial(int|float $n): string { if (floor($n) != $n || $n < 0) throw new \RangeException('Factorial is defined for non-negative integers'); $result = '1'; for ($i = 2; $i <= $n; $i++) $result = bcmul($result,(string)$i,0); return $result; }
function binomial(int $n,int $k): string { if ($k < 0 || $k > $n) return '0'; $k = min($k,$n-$k); $result = '1'; for ($i = 1; $i <= $k; $i++) $result = bcdiv(bcmul($result,(string)($n-$k+$i),0),(string)$i,0); return $result; }
function pascalTriangle(int $rows): array { $triangle = []; for ($r = 0; $r < $rows; $r++) { $row = [1]; for ($c = 1; $c < $r; $c++) $row[] = $triangle[$r-1][$c-1]+$triangle[$r-1][$c]; if ($r > 0) $row[] = 1; $triangle[] = $row; } return $triangle; }
function catalan(int $n): string { return bcdiv(binomial(2*$n,$n),(string)($n+1),0); }
function nextPermutation(array &$values): bool { $i = count($values)-2; while ($i >= 0 && $values[$i] >= $values[$i+1]) $i--; if ($i < 0) { $values = array_reverse($values); return false; } $j = count($values)-1; while ($values[$j] <= $values[$i]) $j--; [$values[$i],$values[$j]] = [$values[$j],$values[$i]]; for ($left = $i+1,$right = count($values)-1; $left < $right; $left++,$right--) [$values[$left],$values[$right]] = [$values[$right],$values[$left]]; return true; }
