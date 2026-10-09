<?php
declare(strict_types=1);

namespace Ports\Algorithms\DynamicProgramming;

function maxSubarray(array $values): array { if (!$values) throw new \RangeException('Array must not be empty'); $best = ['sum'=>$values[0],'start'=>0,'end'=>0]; $currentSum = $values[0]; $currentStart = 0; for ($i = 1; $i < count($values); $i++) { if ($currentSum < 0) { $currentSum = $values[$i]; $currentStart = $i; } else $currentSum += $values[$i]; if ($currentSum > $best['sum']) $best = ['sum'=>$currentSum,'start'=>$currentStart,'end'=>$i]; } return $best; }
