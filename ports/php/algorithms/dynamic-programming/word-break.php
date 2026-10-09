<?php
declare(strict_types=1);

namespace Ports\Algorithms\DynamicProgramming;

use function Ports\Shared\{units,fromUnits};
function wordBreak(string $text, iterable $dictionary): ?array { $words = []; $maxLength = 0; foreach ($dictionary as $word) { $words[$word] = true; $maxLength = max($maxLength,count(units($word))); } $text = units($text); $n = count($text); $previous = array_fill(0,$n+1,-1); $reachable = array_fill(0,$n+1,false); $reachable[0] = true; for ($end = 1; $end <= $n; $end++) for ($start = max(0,$end-$maxLength); $start < $end; $start++) if ($reachable[$start] && isset($words[fromUnits(array_slice($text,$start,$end-$start))])) { $reachable[$end] = true; $previous[$end] = $start; break; } if (!$reachable[$n]) return null; $parts = []; for ($end = $n; $end > 0; $end = $previous[$end]) $parts[] = fromUnits(array_slice($text,$previous[$end],$end-$previous[$end])); return array_reverse($parts); }
