<?php
declare(strict_types=1);

namespace Ports\Algorithms\Math;

function fastPower(int|float $base,int $exponent): int|float { if ($exponent < 0) return 1/fastPower($base,-$exponent); $result = 1; while ($exponent > 0) { if ($exponent&1) $result *= $base; $base *= $base; $exponent = intdiv($exponent,2); } return $result; }
function modPow(string|int $base,string|int $exponent,string|int $modulus): string { $base = (string)$base; $exponent = (string)$exponent; $modulus = (string)$modulus; if (bccomp($modulus,'1',0) === 0) return '0'; $result = '1'; $base = bcmod($base,$modulus,0); if (bccomp($base,'0',0) < 0) $base = bcadd($base,$modulus,0); while (bccomp($exponent,'0',0) > 0) { if (bcmod($exponent,'2',0) === '1') $result = bcmod(bcmul($result,$base,0),$modulus,0); $base = bcmod(bcmul($base,$base,0),$modulus,0); $exponent = bcdiv($exponent,'2',0); } return $result; }
function integerSqrt(int $n): int { if ($n < 0) throw new \RangeException('Square root of a negative number'); if ($n < 2) return $n; $x = $n; $y = intdiv($x,2)+$x%2; while ($y < $x) { $x = $y; $q = intdiv($n,$x); $y = intdiv($x,2)+intdiv($q,2)+intdiv($x%2+$q%2,2); } return $x; }
function newtonSqrt(float $n,float $epsilon = 1e-12): float { if ($n < 0) throw new \RangeException('Square root of a negative number'); if ($n == 0) return 0; $x = $n; while (abs($x*$x-$n) > $epsilon*$n) $x = ($x+$n/$x)/2; return $x; }
