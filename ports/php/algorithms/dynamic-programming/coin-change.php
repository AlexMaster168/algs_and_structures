<?php
declare(strict_types=1);

namespace Ports\Algorithms\DynamicProgramming;

function minCoins(array $coins, int $amount): ?array { $best = array_fill(0,$amount+1,INF); $last = array_fill(0,$amount+1,-1); $best[0] = 0; for ($sum = 1; $sum <= $amount; $sum++) foreach ($coins as $coin) if ($coin <= $sum && $best[$sum-$coin]+1 < $best[$sum]) { $best[$sum] = $best[$sum-$coin]+1; $last[$sum] = $coin; } if ($best[$amount] === INF) return null; $used = []; for ($sum = $amount; $sum > 0; $sum -= $last[$sum]) $used[] = $last[$sum]; return ['count'=>$best[$amount],'coins'=>$used]; }
function coinChangeWays(array $coins, int $amount): int|float { $ways = array_fill(0,$amount+1,0); $ways[0] = 1; foreach ($coins as $coin) for ($sum = $coin; $sum <= $amount; $sum++) $ways[$sum] += $ways[$sum-$coin]; return $ways[$amount]; }
