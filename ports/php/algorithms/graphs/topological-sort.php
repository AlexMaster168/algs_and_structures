<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

function topologicalSortKahn(array $graph): ?array { $degree = array_fill(0,count($graph),0); foreach ($graph as $neighbors) foreach ($neighbors as $neighbor) $degree[$neighbor]++; $queue = []; foreach ($degree as $v => $d) if ($d === 0) $queue[] = $v; $order = []; for ($head = 0; $head < count($queue); $head++) { $v = $queue[$head]; $order[] = $v; foreach ($graph[$v] as $neighbor) if (--$degree[$neighbor] === 0) $queue[] = $neighbor; } return count($order) === count($graph) ? $order : null; }
function topologicalSortDfs(array $graph): ?array { $state = array_fill(0,count($graph),0); $order = []; $visit = function(int $v) use (&$visit,&$state,&$order,$graph): bool { $state[$v] = 1; foreach ($graph[$v] as $neighbor) { if ($state[$neighbor] === 1) return false; if ($state[$neighbor] === 0 && !$visit($neighbor)) return false; } $state[$v] = 2; $order[] = $v; return true; }; foreach ($graph as $v => $_) if ($state[$v] === 0 && !$visit($v)) return null; return array_reverse($order); }
