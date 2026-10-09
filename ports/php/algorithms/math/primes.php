<?php
declare(strict_types=1);

namespace Ports\Algorithms\Math;

use Ports\Shared\Map;
function sieveOfEratosthenes(int $limit): array { if ($limit < 2) return []; $composite = array_fill(0,$limit+1,false); $primes = []; for ($i = 2; $i <= $limit; $i++) { if ($composite[$i]) continue; $primes[] = $i; for ($j = $i*$i; $j <= $limit; $j += $i) $composite[$j] = true; } return $primes; }
function linearSieve(int $limit): array { $smallestFactor = array_fill(0,$limit+1,0); $primes = []; for ($i = 2; $i <= $limit; $i++) { if ($smallestFactor[$i] === 0) { $smallestFactor[$i] = $i; $primes[] = $i; } foreach ($primes as $p) { if ($p > $smallestFactor[$i] || $i*$p > $limit) break; $smallestFactor[$i*$p] = $p; } } return ['primes'=>$primes,'smallestFactor'=>$smallestFactor]; }
function isPrime(int $n): bool { if ($n < 2) return false; if ($n < 4) return true; if ($n%2 === 0 || $n%3 === 0) return false; for ($i = 5; $i <= intdiv($n,$i); $i += 6) if ($n%$i === 0 || $n%($i+2) === 0) return false; return true; }
function millerRabin(string|int $n): bool { $n = (string)$n; if (bccomp($n,'2',0) < 0) return false; $primes = ['2','3','5','7','11','13','17','19','23','29','31','37']; foreach ($primes as $p) { if (bccomp($n,$p,0) === 0) return true; if (bcmod($n,$p,0) === '0') return false; } $last = bcsub($n,'1',0); $d = $last; $r = 0; while (bcmod($d,'2',0) === '0') { $d = bcdiv($d,'2',0); $r++; } foreach ($primes as $a) { $x = modPow($a,$d,$n); if ($x === '1' || $x === $last) continue; $witness = true; for ($i = 1; $i < $r; $i++) { $x = bcmod(bcmul($x,$x,0),$n,0); if ($x === $last) { $witness = false; break; } } if ($witness) return false; } return true; }
function primeFactors(int $n): Map { $factors = new Map(); for ($p = 2; $p <= ($n > 0 ? intdiv($n,$p) : 0); $p++) while ($n%$p === 0) { $factors->set($p,($factors->get($p) ?? 0)+1); $n = intdiv($n,$p); } if ($n > 1) $factors->set($n,($factors->get($n) ?? 0)+1); return $factors; }
function divisors(int $n): array { $small = $large = []; for ($i = 1; $i*$i <= $n; $i++) if ($n%$i === 0) { $small[] = $i; if ($i !== intdiv($n,$i)) $large[] = intdiv($n,$i); } return [...$small,...array_reverse($large)]; }
function eulerPhi(int $n): int { $result = $n; foreach (primeFactors($n)->keys() as $p) $result -= intdiv($result,$p); return $result; }
