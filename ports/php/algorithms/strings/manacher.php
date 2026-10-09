<?php
declare(strict_types=1);

namespace Ports\Algorithms\Strings;

use function Ports\Shared\{units,fromUnits};
function longestPalindromicSubstring(string $s): string { $source = units($s); if (count($source) < 2) return $s; $t = [-2,-1]; foreach ($source as $unit) { $t[] = $unit; $t[] = -1; } $t[] = -3; $radius = array_fill(0,count($t),0); $center = $right = 0; for ($i = 1; $i < count($t)-1; $i++) { if ($i < $right) $radius[$i] = min($right-$i,$radius[2*$center-$i]); while ($t[$i+$radius[$i]+1] === $t[$i-$radius[$i]-1]) $radius[$i]++; if ($i+$radius[$i] > $right) { $center = $i; $right = $i+$radius[$i]; } } $best = 0; for ($i = 1; $i < count($t)-1; $i++) if ($radius[$i] > $radius[$best]) $best = $i; return fromUnits(array_slice($source,($best-$radius[$best])>>1,$radius[$best])); }
