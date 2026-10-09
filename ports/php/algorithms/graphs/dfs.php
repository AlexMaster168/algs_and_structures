<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

function dfs(array $graph,int $start): array { $visited = array_fill(0,count($graph),false); $order = []; $stack = [$start]; while ($stack) { $v = array_pop($stack); if ($visited[$v]) continue; $visited[$v] = true; $order[] = $v; for ($i = count($graph[$v])-1; $i >= 0; $i--) if (!$visited[$graph[$v][$i]]) $stack[] = $graph[$v][$i]; } return $order; }
function dfsRecursive(array $graph,int $start): array { $visited = array_fill(0,count($graph),false); $order = []; $visit = function(int $v) use (&$visit,&$visited,&$order,$graph): void { $visited[$v] = true; $order[] = $v; foreach ($graph[$v] as $neighbor) if (!$visited[$neighbor]) $visit($neighbor); }; $visit($start); return $order; }
function hasPath(array $graph,int $from,int $to): bool { return in_array($to,dfs($graph,$from),true); }
