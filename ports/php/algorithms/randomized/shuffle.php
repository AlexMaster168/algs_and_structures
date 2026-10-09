<?php
declare(strict_types=1);

namespace Ports\Algorithms\Randomized;

use function Ports\Shared\imul;
function randomFloat(): float { return mt_rand()/((float)mt_getrandmax()+1); }
function fisherYatesShuffle(array $input,?callable $random = null): array { $random ??= randomFloat(...); $array = array_values($input); for ($i = count($array)-1; $i > 0; $i--) { $j = (int)floor($random()*($i+1)); [$array[$i],$array[$j]] = [$array[$j],$array[$i]]; } return $array; }
function reservoirSample(iterable $stream,int $size,?callable $random = null): array { $random ??= randomFloat(...); $reservoir = []; $seen = 0; foreach ($stream as $item) { $seen++; if (count($reservoir) < $size) $reservoir[] = $item; else { $j = (int)floor($random()*$seen); if ($j < $size) $reservoir[$j] = $item; } } return $reservoir; }
function mulberry32(int $seed): callable { $state = $seed & 0xffffffff; return function() use (&$state): float { $state = ($state+0x6d2b79f5)&0xffffffff; $t = $state; $t = imul($t^($t>>15),$t|1); $t ^= $t+imul($t^($t>>7),$t|61); $t &= 0xffffffff; return (($t^($t>>14))&0xffffffff)/4294967296; }; }
function monteCarloPi(int $samples,?callable $random = null): float { $random ??= randomFloat(...); $inside = 0; for ($i = 0; $i < $samples; $i++) { $x = $random(); $y = $random(); if ($x*$x+$y*$y <= 1) $inside++; } return 4*$inside/$samples; }
