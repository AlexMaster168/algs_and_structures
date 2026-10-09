<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

use Ports\DataStructures\Graphs\DisjointSet;
function hasCycleDirected(array $graph): bool { return topologicalSortKahn($graph) === null; }
function hasCycleUndirected(int $vertexCount,array $edges): bool { $sets = new DisjointSet($vertexCount); foreach ($edges as [$a,$b]) if (!$sets->union($a,$b)) return true; return false; }
