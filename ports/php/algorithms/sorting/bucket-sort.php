<?php
declare(strict_types=1);

namespace Ports\Algorithms\Sorting;

function bucketSort(array $input, ?int $bucketCount = null): array { if (count($input) <= 1) return array_values($input); $bucketCount ??= max(1,(int)round(sqrt(count($input)))); if ($bucketCount < 1) throw new \RangeException('Invalid bucket count'); $min = min($input); $max = max($input); if ($min == $max) return array_values($input); $buckets = array_fill(0,$bucketCount,[]); $range = ($max-$min)/$bucketCount; foreach ($input as $value) $buckets[min($bucketCount-1,(int)floor(($value-$min)/$range))][] = $value; $output = []; foreach ($buckets as $bucket) array_push($output,...insertionSort($bucket)); return $output; }
