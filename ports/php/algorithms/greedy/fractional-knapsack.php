<?php
declare(strict_types=1);

namespace Ports\Algorithms\Greedy;

use function Ports\Shared\field;
use function Ports\Algorithms\Sorting\mergeSort;
function fractionalKnapsack(array $items,int|float $capacity): int|float { $value = 0; $remaining = $capacity; foreach (mergeSort($items,fn($a,$b) => (field($b,'value')/field($b,'weight')) <=> (field($a,'value')/field($a,'weight'))) as $item) { if ($remaining <= 0) break; $weight = field($item,'weight'); $taken = min($weight,$remaining); $value += field($item,'value')/$weight*$taken; $remaining -= $taken; } return $value; }
