<?php
declare(strict_types=1);

namespace Ports\Algorithms\Backtracking;

function nQueens(int $n): array { $solutions = $columns = $usedColumns = $diagonals = $anti = []; $place = function(int $row) use (&$place,&$solutions,&$columns,&$usedColumns,&$diagonals,&$anti,$n): void { if ($row === $n) { $solutions[] = array_map(fn($col) => str_repeat('.',$col).'Q'.str_repeat('.',$n-$col-1),$columns); return; } for ($col = 0; $col < $n; $col++) { if (isset($usedColumns[$col]) || isset($diagonals[$row-$col]) || isset($anti[$row+$col])) continue; $columns[] = $col; $usedColumns[$col] = $diagonals[$row-$col] = $anti[$row+$col] = true; $place($row+1); array_pop($columns); unset($usedColumns[$col],$diagonals[$row-$col],$anti[$row+$col]); } }; $place(0); return $solutions; }
function countNQueens(int $n): int { if ($n < 0 || $n > 31) throw new \RangeException('Board size must be 0..31'); $full = (1<<$n)-1; $count = function(int $columns,int $diagonals,int $anti) use (&$count,$full): int { if ($columns === $full) return 1; $total = 0; $free = $full & ~($columns|$diagonals|$anti); while ($free) { $bit = $free & -$free; $free ^= $bit; $total += $count($columns|$bit,(($diagonals|$bit)<<1)&$full,($anti|$bit)>>1); } return $total; }; return $count(0,0,0); }
