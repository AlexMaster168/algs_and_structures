<?php
declare(strict_types=1);

namespace Ports\Algorithms\Strings;

use function Ports\Shared\{chars,units};
use function Ports\Algorithms\Sorting\mergeSort;
function isBalanced(string $input): bool { $brackets = [')'=>'(',']'=>'[','}'=>'{']; $stack = []; foreach (chars($input) as $char) { if (in_array($char,['(','[','{'],true)) $stack[] = $char; elseif (isset($brackets[$char]) && array_pop($stack) !== $brackets[$char]) return false; } return $stack === []; }
function isPalindrome(string $input): bool { $normalized = units(preg_replace('/[^\p{L}\p{N}]/u','',mb_strtolower($input,'UTF-8'))); for ($i = 0,$j = count($normalized)-1; $i < $j; $i++,$j--) if ($normalized[$i] !== $normalized[$j]) return false; return true; }
function isAnagram(string $a,string $b): bool { if (count(units($a)) !== count(units($b))) return false; $counts = []; foreach (chars($a) as $char) $counts[$char] = ($counts[$char] ?? 0)+1; foreach (chars($b) as $char) { if (!($counts[$char] ?? 0)) return false; $counts[$char]--; } return true; }
function groupAnagrams(array $words): array { $groups = []; foreach ($words as $word) { $key = implode('',mergeSort(chars($word),fn($a,$b) => units($a) <=> units($b))); $groups[$key][] = $word; } return array_values($groups); }
function runLengthEncode(string $input): string { return preg_replace_callback('/(.)\1*/su',fn($m) => count(units($m[0])).$m[1],$input); }
function runLengthDecode(string $input): string { return preg_replace_callback('/(\d+)(.)/su',fn($m) => str_repeat($m[2],(int)$m[1]),$input); }
function reverseWords(string $input): string { return implode(' ',array_reverse(preg_split('/\s+/u',trim($input)))); }
