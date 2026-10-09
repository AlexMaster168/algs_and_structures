<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

use function Ports\Shared\field;
function reconstructPath(array $parent,int $target): array { $path = []; for ($v = $target; $v !== -1; $v = $parent[$v]) $path[] = $v; return array_reverse($path); }
function toUndirected(int $vertexCount,array $edges): array { $graph = array_fill(0,$vertexCount,[]); foreach ($edges as [$a,$b]) { $graph[$a][] = $b; $graph[$b][] = $a; } return $graph; }
function toWeightedUndirected(int $vertexCount,array $edges): array { $graph = array_fill(0,$vertexCount,[]); foreach ($edges as $edge) { $from = field($edge,'from'); $to = field($edge,'to'); $weight = field($edge,'weight'); $graph[$from][] = ['to'=>$to,'weight'=>$weight]; $graph[$to][] = ['to'=>$from,'weight'=>$weight]; } return $graph; }
