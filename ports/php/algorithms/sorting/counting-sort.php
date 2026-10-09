<?php
declare(strict_types=1);

namespace Ports\Algorithms\Sorting;

function countingSort(array $input): array { if (!$input) return []; $min = $max = $input[0]; foreach ($input as $value) { if (!is_numeric($value) || floor($value) != $value) throw new \TypeError('Counting sort works only with integers'); $min = min($min,$value); $max = max($max,$value); } $counts = array_fill(0,(int)($max-$min+1),0); foreach ($input as $value) $counts[(int)($value-$min)]++; for ($i = 1; $i < count($counts); $i++) $counts[$i] += $counts[$i-1]; $output = array_fill(0,count($input),0); for ($i = count($input)-1; $i >= 0; $i--) { $value = $input[$i]; $output[--$counts[(int)($value-$min)]] = $value; } return $output; }
