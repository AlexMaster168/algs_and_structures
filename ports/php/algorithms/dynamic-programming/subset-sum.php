<?php
declare(strict_types=1);

namespace Ports\Algorithms\DynamicProgramming;

function subsetSum(array $values, int $target): ?array { $reached = array_fill(0,$target+1,-1); $reachable = array_fill(0,$target+1,false); $reachable[0] = true; foreach ($values as $index => $value) for ($sum = $target; $sum >= $value; $sum--) if (!$reachable[$sum] && $reachable[$sum-$value]) { $reachable[$sum] = true; $reached[$sum] = $index; } if (!$reachable[$target]) return null; $chosen = []; for ($sum = $target; $sum > 0; $sum -= $values[$reached[$sum]]) $chosen[] = $values[$reached[$sum]]; return array_reverse($chosen); }
function canPartition(array $values): bool { $total = array_sum($values); return $total%2 === 0 && subsetSum($values,(int)($total/2)) !== null; }
