<?php
declare(strict_types=1);

namespace Ports\Algorithms\Greedy;

use function Ports\Shared\field;
use function Ports\Algorithms\Sorting\mergeSort;
function activitySelection(array $intervals): array { $selected = []; $lastEnd = -INF; foreach (mergeSort($intervals,fn($a,$b) => field($a,'end') <=> field($b,'end')) as $interval) { if (field($interval,'start') < $lastEnd) continue; $selected[] = $interval; $lastEnd = field($interval,'end'); } return $selected; }
function mergeIntervals(array $intervals): array { $merged = []; foreach (mergeSort($intervals,fn($a,$b) => field($a,'start') <=> field($b,'start')) as $interval) { $start = field($interval,'start'); $end = field($interval,'end'); $last = count($merged)-1; if ($last >= 0 && $start <= $merged[$last]['end']) $merged[$last]['end'] = max($merged[$last]['end'],$end); else $merged[] = ['start'=>$start,'end'=>$end]; } return $merged; }
function minMeetingRooms(array $intervals): int { $starts = mergeSort(array_map(fn($i) => field($i,'start'),$intervals)); $ends = mergeSort(array_map(fn($i) => field($i,'end'),$intervals)); $rooms = $maxRooms = 0; for ($s = 0,$e = 0; $s < count($starts);) { if ($e >= count($ends) || $starts[$s] < $ends[$e]) { $rooms++; $s++; } else { $rooms--; $e++; } $maxRooms = max($maxRooms,$rooms); } return $maxRooms; }
