<?php
declare(strict_types=1);

namespace Ports\Algorithms\Strings;

use function Ports\Shared\units;
function boyerMooreHorspool(string $text,string $pattern): array { $text = units($text); $pattern = units($pattern); $m = count($pattern); if (!$m || $m > count($text)) return []; $shift = []; for ($i = 0; $i < $m-1; $i++) $shift[$pattern[$i]] = $m-1-$i; $matches = []; $position = 0; while ($position <= count($text)-$m) { $j = $m-1; while ($j >= 0 && $text[$position+$j] === $pattern[$j]) $j--; if ($j < 0) $matches[] = $position; $position += $shift[$text[$position+$m-1]] ?? $m; } return $matches; }
