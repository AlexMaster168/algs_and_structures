<?php
declare(strict_types=1);

namespace Ports\Algorithms\DynamicProgramming;

function matrixChainOrder(array $dimensions): array { $n = count($dimensions)-1; if ($n < 1) return ['cost'=>0,'order'=>'']; $cost = $split = array_fill(0,$n,array_fill(0,$n,0)); for ($length = 2; $length <= $n; $length++) for ($i = 0; $i+$length-1 < $n; $i++) { $j = $i+$length-1; $cost[$i][$j] = INF; for ($k = $i; $k < $j; $k++) { $candidate = $cost[$i][$k]+$cost[$k+1][$j]+$dimensions[$i]*$dimensions[$k+1]*$dimensions[$j+1]; if ($candidate < $cost[$i][$j]) { $cost[$i][$j] = $candidate; $split[$i][$j] = $k; } } } $render = function(int $i,int $j) use (&$render,$split): string { return $i === $j ? 'A'.($i+1) : '('.$render($i,$split[$i][$j]).$render($split[$i][$j]+1,$j).')'; }; return ['cost'=>$cost[0][$n-1],'order'=>$render(0,$n-1)]; }
