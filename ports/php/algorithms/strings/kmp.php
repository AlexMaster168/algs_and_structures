<?php
declare(strict_types=1);

namespace Ports\Algorithms\Strings;

use function Ports\Shared\units;
function prefixFunction(string $pattern): array { $pattern = units($pattern); $pi = array_fill(0,count($pattern),0); for ($i = 1; $i < count($pattern); $i++) { $k = $pi[$i-1]; while ($k > 0 && $pattern[$i] !== $pattern[$k]) $k = $pi[$k-1]; if ($pattern[$i] === $pattern[$k]) $k++; $pi[$i] = $k; } return $pi; }
function kmpSearch(string $text,string $pattern): array { if ($pattern === '') return []; $pi = prefixFunction($pattern); $text = units($text); $pattern = units($pattern); $matches = []; $k = 0; foreach ($text as $i => $char) { while ($k > 0 && $char !== $pattern[$k]) $k = $pi[$k-1]; if ($char === $pattern[$k]) $k++; if ($k === count($pattern)) { $matches[] = $i-$k+1; $k = $pi[$k-1]; } } return $matches; }
