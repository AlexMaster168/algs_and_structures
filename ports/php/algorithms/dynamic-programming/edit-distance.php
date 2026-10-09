<?php
declare(strict_types=1);

namespace Ports\Algorithms\DynamicProgramming;

use function Ports\Shared\units;
function editDistance(string $source, string $target): int { $source = units($source); $target = units($target); $previous = range(0,count($target)); for ($i = 1; $i <= count($source); $i++) { $current = [$i]; for ($j = 1; $j <= count($target); $j++) $current[$j] = min($previous[$j]+1,$current[$j-1]+1,$previous[$j-1]+($source[$i-1] === $target[$j-1] ? 0 : 1)); $previous = $current; } return $previous[count($target)]; }
