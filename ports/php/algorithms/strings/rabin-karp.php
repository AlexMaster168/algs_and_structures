<?php
declare(strict_types=1);

namespace Ports\Algorithms\Strings;

use function Ports\Shared\units;
function rabinKarp(string $text,string $pattern): array { $text = units($text); $pattern = units($pattern); $m = count($pattern); if (!$m || $m > count($text)) return []; $base = 256; $mod = 1000000007; $highest = 1; for ($i = 1; $i < $m; $i++) $highest = ($highest*$base)%$mod; $ph = $wh = 0; for ($i = 0; $i < $m; $i++) { $ph = ($ph*$base+$pattern[$i])%$mod; $wh = ($wh*$base+$text[$i])%$mod; } $matches = []; for ($start = 0;;$start++) { if ($wh === $ph && array_slice($text,$start,$m) === $pattern) $matches[] = $start; if ($start+$m >= count($text)) break; $wh = ($wh-($text[$start]*$highest)%$mod+$mod)%$mod; $wh = ($wh*$base+$text[$start+$m])%$mod; } return $matches; }
