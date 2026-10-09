<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

function edmondsKarp(array $capacity,int $source,int $sink): int|float { if ($source === $sink) throw new \RangeException('Source and sink must differ'); $n = count($capacity); $residual = $capacity; $flow = 0; while (true) { $parent = array_fill(0,$n,-1); $parent[$source] = $source; $queue = [$source]; for ($head = 0; $head < count($queue) && $parent[$sink] === -1; $head++) { $v = $queue[$head]; for ($next = 0; $next < $n; $next++) if ($parent[$next] === -1 && $residual[$v][$next] > 0) { $parent[$next] = $v; $queue[] = $next; } } if ($parent[$sink] === -1) return $flow; $bottleneck = INF; for ($v = $sink; $v !== $source; $v = $parent[$v]) $bottleneck = min($bottleneck,$residual[$parent[$v]][$v]); for ($v = $sink; $v !== $source; $v = $parent[$v]) { $residual[$parent[$v]][$v] -= $bottleneck; $residual[$v][$parent[$v]] += $bottleneck; } $flow += $bottleneck; } }
