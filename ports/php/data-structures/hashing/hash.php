<?php
declare(strict_types=1);

namespace Ports\DataStructures\Hashing;

use function Ports\Shared\{units,imul};
function fnv1a(string $input,int $seed = 0x811c9dc5): int { $hash = $seed & 0xffffffff; foreach (units($input) as $unit) $hash = imul($hash ^ $unit,0x01000193); return $hash & 0xffffffff; }
function defaultHasher(mixed $key): int { $type = match(true) { is_int($key),is_float($key)=>'number',is_bool($key)=>'boolean',is_string($key)=>'string',is_callable($key)=>'function',default=>'object' }; $value = match(true) { $key === null=>'null',is_bool($key)=>$key ? 'true' : 'false',is_array($key)=>implode(',',array_map(fn($v) => is_scalar($v) ? (string)$v : '[object Object]',$key)),is_object($key)=>'[object Object]',default=>(string)$key }; return fnv1a($type.':'.$value); }
