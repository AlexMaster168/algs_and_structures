<?php
declare(strict_types=1);

namespace Ports\Algorithms\Sorting;

function sortNonNegative(array $input, int $base): array { $array = $input; $max = $input ? max($input) : 0; for ($exponent = 1; intdiv((int)$max,$exponent) > 0;) { $buckets = array_fill(0,$base,[]); foreach ($array as $value) $buckets[intdiv((int)$value,$exponent)%$base][] = $value; $array = array_merge(...$buckets); if ($exponent > intdiv((int)$max,$base)) break; $exponent *= $base; } return $array; }
function radixSort(array $input, int $base = 10): array { if ($base < 2) throw new \RangeException('Base must be at least two'); $negatives = $positives = []; foreach ($input as $value) { if (!is_numeric($value) || floor($value) != $value) throw new \TypeError('Radix sort works only with integers'); if ($value < 0) $negatives[] = -$value; else $positives[] = $value; } return [...array_map(fn($v) => -$v,array_reverse(sortNonNegative($negatives,$base))),...sortNonNegative($positives,$base)]; }
