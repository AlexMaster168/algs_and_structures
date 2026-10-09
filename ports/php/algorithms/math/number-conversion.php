<?php
declare(strict_types=1);

namespace Ports\Algorithms\Math;

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';
const ROMAN = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
function toBase(int $value,int $base): string { if ($base < 2 || $base > 36) throw new \RangeException('Base must be between 2 and 36'); if ($value === 0) return '0'; $negative = $value < 0; $rest = abs($value); $result = ''; while ($rest > 0) { $result = DIGITS[$rest%$base].$result; $rest = intdiv($rest,$base); } return $negative ? '-'.$result : $result; }
function fromBase(string $input,int $base): int { if ($base < 2 || $base > 36) throw new \RangeException('Base must be between 2 and 36'); $negative = str_starts_with($input,'-'); $result = 0; foreach (str_split(strtolower(substr($input,$negative ? 1 : 0))) as $char) { $digit = strpos(DIGITS,$char); if ($digit === false || $digit >= $base) throw new \RangeException("Invalid digit $char for base $base"); $result = $result*$base+$digit; } return $negative ? -$result : $result; }
function toRoman(int|float $value): string { if (floor($value) != $value || $value < 1 || $value > 3999) throw new \RangeException('Value must be in 1..3999'); $result = ''; foreach (ROMAN as [$amount,$symbol]) while ($value >= $amount) { $result .= $symbol; $value -= $amount; } return $result; }
function fromRoman(string $input): int { $values = ['I'=>1,'V'=>5,'X'=>10,'L'=>50,'C'=>100,'D'=>500,'M'=>1000]; $result = 0; for ($i = 0; $i < strlen($input); $i++) { $current = $values[$input[$i]]; $next = $values[$input[$i+1] ?? ''] ?? 0; $result += $current < $next ? -$current : $current; } return $result; }
