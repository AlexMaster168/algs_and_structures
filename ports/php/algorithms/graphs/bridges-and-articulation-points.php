<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

use function Ports\Algorithms\Sorting\mergeSort;
function findBridgesAndArticulationPoints(array $graph): array { $n = count($graph); $entry = array_fill(0,$n,-1); $low = array_fill(0,$n,0); $articulation = array_fill(0,$n,false); $bridges = []; $timer = 0; $visit = function(int $v,int $parent) use (&$visit,&$entry,&$low,&$articulation,&$bridges,&$timer,$graph): void { $entry[$v] = $low[$v] = $timer++; $children = 0; $skipped = false; foreach ($graph[$v] as $neighbor) { if ($neighbor === $parent && !$skipped) { $skipped = true; continue; } if ($entry[$neighbor] !== -1) { $low[$v] = min($low[$v],$entry[$neighbor]); continue; } $visit($neighbor,$v); $children++; $low[$v] = min($low[$v],$low[$neighbor]); if ($low[$neighbor] > $entry[$v]) $bridges[] = [min($v,$neighbor),max($v,$neighbor)]; if ($parent !== -1 && $low[$neighbor] >= $entry[$v]) $articulation[$v] = true; } if ($parent === -1 && $children > 1) $articulation[$v] = true; }; foreach ($graph as $v => $_) if ($entry[$v] === -1) $visit($v,-1); $points = []; foreach ($articulation as $v => $flag) if ($flag) $points[] = $v; return ['bridges'=>mergeSort($bridges,fn($a,$b) => ($a[0]<=>$b[0]) ?: ($a[1]<=>$b[1])),'articulationPoints'=>$points]; }
