<?php
declare(strict_types=1);

namespace Ports\Algorithms\Strings;

use function Ports\Shared\units;
function zFunction(string $s): array { return zUnits(units($s)); }
function zUnits(array $s): array { $z = array_fill(0,count($s),0); if ($s) $z[0] = count($s); for ($i = 1,$left = 0,$right = 0; $i < count($s); $i++) { if ($i < $right) $z[$i] = min($right-$i,$z[$i-$left]); while ($i+$z[$i] < count($s) && $s[$z[$i]] === $s[$i+$z[$i]]) $z[$i]++; if ($i+$z[$i] > $right) { $left = $i; $right = $i+$z[$i]; } } return $z; }
function zSearch(string $text,string $pattern): array { if ($pattern === '') return []; $p = units($pattern); $z = zUnits([...$p,-1,...units($text)]); $matches = []; for ($i = count($p)+1; $i < count($z); $i++) if ($z[$i] >= count($p)) $matches[] = $i-count($p)-1; return $matches; }
