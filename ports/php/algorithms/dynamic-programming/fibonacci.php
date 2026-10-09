<?php
declare(strict_types=1);

namespace Ports\Algorithms\DynamicProgramming;

function fibonacciRecursive(int $n): int|float { return $n < 2 ? $n : fibonacciRecursive($n-1)+fibonacciRecursive($n-2); }
function fibonacciMemo(int $n): int|float { static $memo; $memo ??= memoize(fn(int $k) => $k < 2 ? $k : fibonacciMemo($k-1)+fibonacciMemo($k-2)); return $memo($n); }
function fibonacci(int $n): string { $previous = '0'; $current = '1'; if ($n === 0) return $previous; for ($i = 1; $i < $n; $i++) [$previous,$current] = [$current,bcadd($previous,$current,0)]; return $current; }
function fibonacciFast(int $n): string { $pair = function(int $k) use (&$pair): array { if ($k === 0) return ['0','1']; [$a,$b] = $pair($k>>1); $c = bcmul($a,bcsub(bcmul('2',$b,0),$a,0),0); $d = bcadd(bcmul($a,$a,0),bcmul($b,$b,0),0); return $k & 1 ? [$d,bcadd($c,$d,0)] : [$c,$d]; }; return $pair($n)[0]; }
