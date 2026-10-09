<?php
declare(strict_types=1);

namespace Ports\Algorithms\Trees;

use function Ports\Algorithms\Graphs\{bfs,reconstructPath};
function treeDiameter(array $tree): array { if (!$tree) return ['length'=>0,'path'=>[]]; $farthest = fn($distance) => array_search(max($distance),$distance,true); $first = $farthest(bfs($tree,0)['distance']); $result = bfs($tree,$first); $second = $farthest($result['distance']); return ['length'=>$result['distance'][$second],'path'=>reconstructPath($result['parent'],$second)]; }
