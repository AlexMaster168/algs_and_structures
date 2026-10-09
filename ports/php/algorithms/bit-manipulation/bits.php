<?php
declare(strict_types=1);

namespace Ports\Algorithms\BitManipulation;

function getBit(int $value, int $position): int { return (($value & 0xffffffff) >> ($position & 31)) & 1; }
function setBit(int $value, int $position): int { return ($value | (1<<($position&31))) & 0xffffffff; }
function clearBit(int $value, int $position): int { return ($value & ~(1<<($position&31))) & 0xffffffff; }
function toggleBit(int $value, int $position): int { return ($value ^ (1<<($position&31))) & 0xffffffff; }
function countSetBits(int $value): int { $count = 0; for ($v = $value & 0xffffffff; $v !== 0; $v &= $v-1) $count++; return $count; }
function isPowerOfTwo(int $value): bool { return $value > 0 && ($value & ($value-1)) === 0; }
function lowestSetBit(int $value): int { $v = $value & 0xffffffff; $r = $v & -$v; return $r >= 0x80000000 ? $r-0x100000000 : $r; }
function singleNumber(array $values): int { $r = 0; foreach ($values as $v) $r ^= (int)$v; $r &= 0xffffffff; return $r >= 0x80000000 ? $r-0x100000000 : $r; }
function reverseBits(int $value): int { $result = 0; $value &= 0xffffffff; for ($i = 0; $i < 32; $i++) { $result = ($result<<1)|($value&1); $value >>= 1; } return $result & 0xffffffff; }
function grayCode(int $bits): array { $out = []; for ($i = 0; $i < (1<<$bits); $i++) $out[] = $i^($i>>1); return $out; }
function subsetsByMask(array $items): array { $out = []; for ($mask = 0; $mask < (1<<count($items)); $mask++) { $part = []; foreach ($items as $i => $item) if ($mask & (1<<$i)) $part[] = $item; $out[] = $part; } return $out; }
function swapWithoutTemp(int $a, int $b): array { $a ^= $b; $b ^= $a; $a ^= $b; return [$a,$b]; }
function hammingDistance(int $a, int $b): int { return countSetBits($a^$b); }
