<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

use Ports\DataStructures\Graphs\DisjointSet;
use Ports\DataStructures\Heaps\BinaryHeap;
use function Ports\Shared\field;
use function Ports\Algorithms\Sorting\mergeSort;
function kruskal(int $vertexCount,array $edges): array { $sets = new DisjointSet($vertexCount); $result = []; $weight = 0; foreach (mergeSort($edges,fn($a,$b) => field($a,'weight') <=> field($b,'weight')) as $edge) { if (!$sets->union(field($edge,'from'),field($edge,'to'))) continue; $result[] = $edge; $weight += field($edge,'weight'); if (count($result) === $vertexCount-1) break; } return ['weight'=>$weight,'edges'=>$result]; }
function prim(array $graph,int $start = 0): array { if (!$graph) return ['weight'=>0,'edges'=>[]]; $visited = array_fill(0,count($graph),false); $heap = new BinaryHeap(fn($a,$b) => $a['weight'] <=> $b['weight']); $result = []; $weight = 0; $visit = function(int $v) use (&$visited,$heap,$graph): void { $visited[$v] = true; foreach ($graph[$v] as $edge) { $to = field($edge,'to'); if (!$visited[$to]) $heap->push(['from'=>$v,'to'=>$to,'weight'=>field($edge,'weight')]); } }; $visit($start); while (!$heap->isEmpty() && count($result) < count($graph)-1) { $edge = $heap->pop(); if ($visited[$edge['to']]) continue; $result[] = $edge; $weight += $edge['weight']; $visit($edge['to']); } return ['weight'=>$weight,'edges'=>$result]; }
