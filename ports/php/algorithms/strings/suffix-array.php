<?php
declare(strict_types=1);

namespace Ports\Algorithms\Strings;

use function Ports\Shared\units;
use function Ports\Algorithms\Sorting\mergeSort;
function suffixArray(string $s): array { $rank = units($s); $n = count($rank); $suffixes = $n ? range(0,$n-1) : []; for ($k = 1;;$k *= 2) { $key = fn($i) => [$rank[$i],$i+$k < $n ? $rank[$i+$k] : -1]; $suffixes = mergeSort($suffixes,function($a,$b) use ($key) { [$a1,$a2] = $key($a); [$b1,$b2] = $key($b); return ($a1 <=> $b1) ?: ($a2 <=> $b2); }); $next = array_fill(0,$n,0); for ($i = 1; $i < $n; $i++) $next[$suffixes[$i]] = $next[$suffixes[$i-1]]+($key($suffixes[$i-1]) !== $key($suffixes[$i]) ? 1 : 0); $rank = $next; if (!$n || $rank[$suffixes[$n-1]] === $n-1) break; } return $suffixes; }
function lcpArray(string $s,array $suffixes): array { $s = units($s); $n = count($s); $rank = array_fill(0,$n,0); foreach ($suffixes as $i => $suffix) $rank[$suffix] = $i; $lcp = array_fill(0,max(0,$n-1),0); $h = 0; for ($i = 0; $i < $n; $i++) { if ($rank[$i] === 0) { $h = 0; continue; } $j = $suffixes[$rank[$i]-1]; while ($i+$h < $n && $j+$h < $n && $s[$i+$h] === $s[$j+$h]) $h++; $lcp[$rank[$i]-1] = $h; if ($h > 0) $h--; } return $lcp; }
function countDistinctSubstrings(string $s): int { $n = count(units($s)); return intdiv($n*($n+1),2)-array_sum(lcpArray($s,suffixArray($s))); }
