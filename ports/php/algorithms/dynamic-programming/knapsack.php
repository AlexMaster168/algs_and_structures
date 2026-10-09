<?php
declare(strict_types=1);

namespace Ports\Algorithms\DynamicProgramming;

use function Ports\Shared\field;
function knapsack01(array $items, int $capacity): array { $n = count($items); $table = array_fill(0,$n+1,array_fill(0,$capacity+1,0)); for ($i = 1; $i <= $n; $i++) { $weight = field($items[$i-1],'weight'); $value = field($items[$i-1],'value'); for ($w = 0; $w <= $capacity; $w++) { $table[$i][$w] = $table[$i-1][$w]; if ($weight <= $w) $table[$i][$w] = max($table[$i][$w],$table[$i-1][$w-$weight]+$value); } } $chosen = []; for ($i = $n,$w = $capacity; $i > 0; $i--) if ($table[$i][$w] !== $table[$i-1][$w]) { $chosen[] = $i-1; $w -= field($items[$i-1],'weight'); } return ['value'=>$table[$n][$capacity],'items'=>array_reverse($chosen)]; }
function unboundedKnapsack(array $items, int $capacity): int|float { $best = array_fill(0,$capacity+1,0); for ($w = 1; $w <= $capacity; $w++) foreach ($items as $item) { $weight = field($item,'weight'); if ($weight <= $w) $best[$w] = max($best[$w],$best[$w-$weight]+field($item,'value')); } return $best[$capacity]; }
