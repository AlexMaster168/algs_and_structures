<?php
declare(strict_types=1);

namespace Ports\Algorithms\Backtracking;

use function Ports\Algorithms\Sorting\mergeSort;
function permutations(array $items): array { $result = $current = []; $used = array_fill(0,count($items),false); $build = function() use (&$build,&$result,&$current,&$used,$items): void { if (count($current) === count($items)) { $result[] = $current; return; } foreach ($items as $i => $item) { if ($used[$i]) continue; $used[$i] = true; $current[] = $item; $build(); array_pop($current); $used[$i] = false; } }; $build(); return $result; }
function combinations(array $items, int $size): array { $result = $current = []; $build = function(int $start) use (&$build,&$result,&$current,$items,$size): void { if (count($current) === $size) { $result[] = $current; return; } for ($i = $start; $i <= count($items)-($size-count($current)); $i++) { $current[] = $items[$i]; $build($i+1); array_pop($current); } }; if ($size >= 0) $build(0); return $result; }
function subsets(array $items): array { $result = $current = []; $build = function(int $index) use (&$build,&$result,&$current,$items): void { if ($index === count($items)) { $result[] = $current; return; } $build($index+1); $current[] = $items[$index]; $build($index+1); array_pop($current); }; $build(0); return $result; }
function combinationSum(array $candidates, int $target): array { $sorted = mergeSort(array_values(array_unique($candidates))); if ($sorted && $sorted[0] <= 0) throw new \RangeException('Candidates must be positive'); $result = $current = []; $build = function(int $start,int $remaining) use (&$build,&$result,&$current,$sorted): void { if ($remaining === 0) { $result[] = $current; return; } for ($i = $start; $i < count($sorted) && $sorted[$i] <= $remaining; $i++) { $current[] = $sorted[$i]; $build($i,$remaining-$sorted[$i]); array_pop($current); } }; $build(0,$target); return $result; }
