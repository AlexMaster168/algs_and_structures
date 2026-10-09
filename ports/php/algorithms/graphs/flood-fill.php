<?php
declare(strict_types=1);

namespace Ports\Algorithms\Graphs;

function floodFill(array $image,int $row,int $col,int|float $color): array { $result = $image; $original = $result[$row][$col] ?? null; if ($original === null || $original === $color) return $result; $stack = [[$row,$col]]; while ($stack) { [$r,$c] = array_pop($stack); if (($result[$r][$c] ?? null) !== $original) continue; $result[$r][$c] = $color; array_push($stack,[$r+1,$c],[$r-1,$c],[$r,$c+1],[$r,$c-1]); } return $result; }
