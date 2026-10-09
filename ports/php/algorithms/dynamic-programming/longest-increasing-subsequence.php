<?php
declare(strict_types=1);

namespace Ports\Algorithms\DynamicProgramming;

function longestIncreasingSubsequence(array $values): array { $tails = []; $previous = array_fill(0,count($values),-1); foreach ($values as $i => $value) { $low = 0; $high = count($tails); while ($low < $high) { $mid = ($low+$high)>>1; if ($values[$tails[$mid]] < $value) $low = $mid+1; else $high = $mid; } if ($low > 0) $previous[$i] = $tails[$low-1]; $tails[$low] = $i; } $result = []; for ($i = $tails[count($tails)-1] ?? -1; $i !== -1; $i = $previous[$i]) $result[] = $values[$i]; return array_reverse($result); }
