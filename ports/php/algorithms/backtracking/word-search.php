<?php
declare(strict_types=1);

namespace Ports\Algorithms\Backtracking;

use function Ports\Shared\units;
function wordSearch(array $grid, string $word): bool { $grid = array_map(units(...),$grid); $word = units($word); $rows = count($grid); $cols = count($grid[0] ?? []); $visited = array_fill(0,$rows,array_fill(0,$cols,false)); $search = function(int $r,int $c,int $index) use (&$search,&$visited,$grid,$word,$rows,$cols): bool { if ($index === count($word)) return true; if ($r < 0 || $c < 0 || $r >= $rows || $c >= $cols || $visited[$r][$c] || $grid[$r][$c] !== $word[$index]) return false; $visited[$r][$c] = true; $found = $search($r+1,$c,$index+1) || $search($r-1,$c,$index+1) || $search($r,$c+1,$index+1) || $search($r,$c-1,$index+1); $visited[$r][$c] = false; return $found; }; for ($r = 0; $r < $rows; $r++) for ($c = 0; $c < $cols; $c++) if ($search($r,$c,0)) return true; return false; }
