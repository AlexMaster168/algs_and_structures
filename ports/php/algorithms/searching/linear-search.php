<?php
declare(strict_types=1);

namespace Ports\Algorithms\Searching;

function linearSearch(array $array, mixed $target): int { foreach ($array as $i => $value) if ($value === $target || (is_numeric($value) && is_numeric($target) && $value == $target)) return $i; return -1; }
function linearSearchAll(array $array, callable $predicate): array { $indices = []; foreach ($array as $i => $value) if ($predicate($value,$i)) $indices[] = $i; return $indices; }
