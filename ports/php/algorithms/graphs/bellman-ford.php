<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

use function Ports\Shared\field;
function bellmanFord(int $vertexCount,array $edges,int $source): array { $distance = array_fill(0,$vertexCount,INF); $parent = array_fill(0,$vertexCount,-1); $distance[$source] = 0; for ($i = 0; $i < $vertexCount-1; $i++) { $changed = false; foreach ($edges as $edge) { $from = field($edge,'from'); $to = field($edge,'to'); $weight = field($edge,'weight'); if ($distance[$from]+$weight < $distance[$to]) { $distance[$to] = $distance[$from]+$weight; $parent[$to] = $from; $changed = true; } } if (!$changed) break; } $negative = false; foreach ($edges as $edge) if ($distance[field($edge,'from')]+field($edge,'weight') < $distance[field($edge,'to')]) $negative = true; return ['distance'=>$distance,'parent'=>$parent,'hasNegativeCycle'=>$negative]; }
