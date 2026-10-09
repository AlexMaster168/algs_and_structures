<?php
declare(strict_types=1);

namespace Ports\Algorithms\DynamicProgramming;

function uniquePaths(int $rows, int $cols, array $blocked = []): int|float { if ($rows <= 0 || $cols <= 0) return 0; $ways = array_fill(0,$cols,0); $ways[0] = 1; for ($r = 0; $r < $rows; $r++) for ($c = 0; $c < $cols; $c++) { if ($blocked[$r][$c] ?? false) $ways[$c] = 0; elseif ($c > 0) $ways[$c] += $ways[$c-1]; } return $ways[$cols-1]; }
function minPathSum(array $grid): int|float { $cols = count($grid[0] ?? []); if (!$cols) return 0; $best = array_fill(0,$cols,INF); $best[0] = 0; foreach ($grid as $row) for ($c = 0; $c < $cols; $c++) $best[$c] = $row[$c]+min($best[$c],$c > 0 ? $best[$c-1] : INF); return $best[$cols-1]; }
