<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

use Ports\DataStructures\Heaps\BinaryHeap;
use function Ports\Shared\field;
function dijkstra(array $graph,int $source): array { $distance = array_fill(0,count($graph),INF); $parent = array_fill(0,count($graph),-1); $heap = new BinaryHeap(fn($a,$b) => $a[1] <=> $b[1]); $distance[$source] = 0; $heap->push([$source,0]); while (!$heap->isEmpty()) { [$v,$current] = $heap->pop(); if ($current > $distance[$v]) continue; foreach ($graph[$v] as $edge) { $to = field($edge,'to'); $weight = field($edge,'weight'); if ($weight < 0) throw new \RangeException('Dijkstra does not support negative weights'); $candidate = $current+$weight; if ($candidate < $distance[$to]) { $distance[$to] = $candidate; $parent[$to] = $v; $heap->push([$to,$candidate]); } } } return ['distance'=>$distance,'parent'=>$parent]; }
function dijkstraPath(array $graph,int $source,int $target): ?array { $result = dijkstra($graph,$source); return $result['distance'][$target] === INF ? null : ['distance'=>$result['distance'][$target],'path'=>reconstructPath($result['parent'],$target)]; }
