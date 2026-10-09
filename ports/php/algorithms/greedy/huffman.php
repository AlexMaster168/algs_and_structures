<?php
declare(strict_types=1);

namespace Ports\Algorithms\Greedy;

use Ports\Shared\Map;
use Ports\DataStructures\Heaps\BinaryHeap;
use function Ports\Shared\chars;
function huffmanCodes(string $text): Map { $frequencies = new Map(); foreach (chars($text) as $char) $frequencies->set($char,($frequencies->get($char) ?? 0)+1); $codes = new Map(); if (!$frequencies->size) return $codes; if ($frequencies->size === 1) return $codes->set($frequencies->keys()[0],'0'); $order = 0; $heap = new BinaryHeap(fn($a,$b) => ($a['weight'] <=> $b['weight']) ?: ($a['order'] <=> $b['order'])); foreach ($frequencies as [$char,$weight]) $heap->push(['char'=>$char,'weight'=>$weight,'order'=>$order++]); while ($heap->size > 1) { $left = $heap->pop(); $right = $heap->pop(); $heap->push(['left'=>$left,'right'=>$right,'weight'=>$left['weight']+$right['weight'],'order'=>$order++]); } $assign = function(array $node,string $code) use (&$assign,$codes): void { if (array_key_exists('char',$node)) { $codes->set($node['char'],$code); return; } $assign($node['left'],$code.'0'); $assign($node['right'],$code.'1'); }; $assign($heap->pop(),''); return $codes; }
function huffmanEncode(string $text): array { $codes = huffmanCodes($text); $encoded = ''; foreach (chars($text) as $char) $encoded .= $codes->get($char); return ['encoded'=>$encoded,'codes'=>$codes]; }
function huffmanDecode(string $encoded,iterable $codes): string { $reverse = new Map(); foreach ($codes as [$char,$code]) $reverse->set($code,$char); $result = $buffer = ''; foreach (str_split($encoded) as $bit) { $buffer .= $bit; if ($reverse->has($buffer)) { $result .= $reverse->get($buffer); $buffer = ''; } } return $result; }
