<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

function floydWarshall(array $weights): array { $n = count($weights); $distance = $weights; $next = []; foreach ($weights as $i => $row) { $next[$i] = []; foreach ($row as $j => $weight) $next[$i][$j] = $i === $j || $weight !== INF ? $j : -1; } for ($i = 0; $i < $n; $i++) if ($distance[$i][$i] > 0) $distance[$i][$i] = 0; for ($k = 0; $k < $n; $k++) for ($i = 0; $i < $n; $i++) { if ($distance[$i][$k] === INF) continue; for ($j = 0; $j < $n; $j++) { $candidate = $distance[$i][$k]+$distance[$k][$j]; if ($candidate < $distance[$i][$j]) { $distance[$i][$j] = $candidate; $next[$i][$j] = $next[$i][$k]; } } } $negative = false; for ($i = 0; $i < $n; $i++) if ($distance[$i][$i] < 0) $negative = true; return ['distance'=>$distance,'next'=>$next,'hasNegativeCycle'=>$negative]; }
function floydWarshallPath(array $next,int $from,int $to): ?array { if ($next[$from][$to] === -1) return null; $path = [$from]; while ($from !== $to) { $from = $next[$from][$to]; $path[] = $from; if (count($path) > count($next)+1) throw new \LogicException('Path contains a negative cycle'); } return $path; }
