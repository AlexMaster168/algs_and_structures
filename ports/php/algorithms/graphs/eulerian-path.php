<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

function eulerianPathDirected(array $graph): ?array { $n = count($graph); $inDegree = array_fill(0,$n,0); $edgeCount = 0; $start = 0; foreach ($graph as $v => $neighbors) { foreach ($neighbors as $neighbor) $inDegree[$neighbor]++; $edgeCount += count($neighbors); } if (!$edgeCount) return $n > 0 ? [0] : []; foreach ($graph as $v => $neighbors) if ($neighbors) { $start = $v; break; } $starts = $ends = 0; foreach ($graph as $v => $neighbors) { $balance = count($neighbors)-$inDegree[$v]; if ($balance === 1) { $starts++; $start = $v; } elseif ($balance === -1) $ends++; elseif ($balance !== 0) return null; } if (!(($starts === 0 && $ends === 0) || ($starts === 1 && $ends === 1))) return null; $next = array_fill(0,$n,0); $stack = [$start]; $path = []; while ($stack) { $v = $stack[count($stack)-1]; if ($next[$v] < count($graph[$v])) $stack[] = $graph[$v][$next[$v]++]; else $path[] = array_pop($stack); } return count($path) === $edgeCount+1 ? array_reverse($path) : null; }
