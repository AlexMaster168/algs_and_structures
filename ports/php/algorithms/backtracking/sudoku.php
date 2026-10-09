<?php
declare(strict_types=1);

namespace Ports\Algorithms\Backtracking;

function solveSudoku(array $input): ?array { $board = $input; $rows = $cols = $boxes = array_fill(0,9,[]); $empty = []; $box = fn($r,$c) => intdiv($r,3)*3+intdiv($c,3); for ($r = 0; $r < 9; $r++) for ($c = 0; $c < 9; $c++) { $value = $board[$r][$c]; if ($value === 0) { $empty[] = [$r,$c]; continue; } $b = $box($r,$c); if ($value < 1 || $value > 9 || isset($rows[$r][$value]) || isset($cols[$c][$value]) || isset($boxes[$b][$value])) return null; $rows[$r][$value] = $cols[$c][$value] = $boxes[$b][$value] = true; } $fill = function(int $index) use (&$fill,&$board,&$rows,&$cols,&$boxes,$empty,$box): bool { if ($index === count($empty)) return true; [$r,$c] = $empty[$index]; $b = $box($r,$c); for ($value = 1; $value <= 9; $value++) { if (isset($rows[$r][$value]) || isset($cols[$c][$value]) || isset($boxes[$b][$value])) continue; $board[$r][$c] = $value; $rows[$r][$value] = $cols[$c][$value] = $boxes[$b][$value] = true; if ($fill($index+1)) return true; $board[$r][$c] = 0; unset($rows[$r][$value],$cols[$c][$value],$boxes[$b][$value]); } return false; }; return $fill(0) ? $board : null; }
