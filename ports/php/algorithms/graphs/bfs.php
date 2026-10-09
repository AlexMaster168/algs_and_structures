<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

use Ports\DataStructures\Linear\Queue;
use function Ports\Shared\units;
function bfs(array $graph,int $start): array { $distance = $parent = array_fill(0,count($graph),-1); $order = []; $queue = (new Queue())->enqueue($start); $distance[$start] = 0; while (!$queue->isEmpty()) { $v = $queue->dequeue(); $order[] = $v; foreach ($graph[$v] as $neighbor) { if ($distance[$neighbor] !== -1) continue; $distance[$neighbor] = $distance[$v]+1; $parent[$neighbor] = $v; $queue->enqueue($neighbor); } } return ['order'=>$order,'distance'=>$distance,'parent'=>$parent]; }
function shortestPathUnweighted(array $graph,int $start,int $target): ?array { $result = bfs($graph,$start); return $result['distance'][$target] === -1 ? null : reconstructPath($result['parent'],$target); }
function gridShortestPath(array $grid,array $start,array $target,string $wall = '#'): int { $grid = array_map(units(...),$grid); $wall = units($wall)[0]; $rows = count($grid); $cols = count($grid[0] ?? []); $distance = array_fill(0,$rows,array_fill(0,$cols,-1)); $queue = (new Queue())->enqueue($start); $distance[$start[0]][$start[1]] = 0; while (!$queue->isEmpty()) { [$row,$col] = $queue->dequeue(); if ([$row,$col] === $target) return $distance[$row][$col]; foreach ([[1,0],[-1,0],[0,1],[0,-1]] as [$dr,$dc]) { $r = $row+$dr; $c = $col+$dc; if ($r < 0 || $c < 0 || $r >= $rows || $c >= $cols || $grid[$r][$c] === $wall || $distance[$r][$c] !== -1) continue; $distance[$r][$c] = $distance[$row][$col]+1; $queue->enqueue([$r,$c]); } } return -1; }
