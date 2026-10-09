<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

function bipartiteColoring(array $graph): ?array { $colors = array_fill(0,count($graph),-1); foreach ($graph as $start => $_) { if ($colors[$start] !== -1) continue; $colors[$start] = 0; $queue = [$start]; for ($head = 0; $head < count($queue); $head++) { $v = $queue[$head]; foreach ($graph[$v] as $neighbor) { if ($colors[$neighbor] === -1) { $colors[$neighbor] = 1-$colors[$v]; $queue[] = $neighbor; } elseif ($colors[$neighbor] === $colors[$v]) return null; } } } return $colors; }
function isBipartite(array $graph): bool { return bipartiteColoring($graph) !== null; }
