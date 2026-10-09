<?php
declare(strict_types=1);

namespace Ports\Shared;

function defaultCompare(mixed $a, mixed $b): int { return $a < $b ? -1 : ($a > $b ? 1 : 0); }
function reverseCompare(?callable $compare = null): callable { $compare ??= defaultCompare(...); return fn($a, $b) => $compare($b, $a); }
