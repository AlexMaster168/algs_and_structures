<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

use function Ports\Algorithms\Sorting\mergeSort;
function connectedComponents(array $graph): array { $visited = array_fill(0,count($graph),false); $components = []; foreach ($graph as $start => $_) { if ($visited[$start]) continue; $component = []; $stack = [$start]; $visited[$start] = true; while ($stack) { $v = array_pop($stack); $component[] = $v; foreach ($graph[$v] as $neighbor) if (!$visited[$neighbor]) { $visited[$neighbor] = true; $stack[] = $neighbor; } } $components[] = mergeSort($component); } return $components; }
