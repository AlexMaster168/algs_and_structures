<?php
declare(strict_types=1);

namespace Ports\Algorithms\Math;

function gcd(int $a,int $b): int { $a = abs($a); $b = abs($b); while ($b !== 0) [$a,$b] = [$b,$a%$b]; return $a; }
function lcm(int $a,int $b): int { return $a === 0 || $b === 0 ? 0 : abs(intdiv($a,gcd($a,$b))*$b); }
function extendedGcd(int $a,int $b): array { if ($b === 0) return ['gcd'=>$a,'x'=>1,'y'=>0]; $result = extendedGcd($b,$a%$b); return ['gcd'=>$result['gcd'],'x'=>$result['y'],'y'=>$result['x']-(int)floor($a/$b)*$result['y']]; }
function modInverse(int $a,int $m): ?int { $result = extendedGcd((($a%$m)+$m)%$m,$m); return $result['gcd'] === 1 ? (($result['x']%$m)+$m)%$m : null; }
