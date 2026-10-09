<?php
declare(strict_types=1);

namespace Ports\Algorithms\Searching;

use function Ports\Shared\defaultCompare;
function exponentialSearch(array $sorted, mixed $target, ?callable $compare = null): int { $compare ??= defaultCompare(...); if (!$sorted) return -1; if ($compare($sorted[0],$target) == 0) return 0; $bound = 1; while ($bound < count($sorted) && $compare($sorted[$bound],$target) < 0) $bound *= 2; return binarySearch($sorted,$target,$compare,$bound>>1,min($bound,count($sorted)-1)); }
