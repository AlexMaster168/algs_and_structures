<?php
declare(strict_types=1);

namespace Ports\Algorithms\DynamicProgramming;

function rodCutting(array $prices, int $length): array { $revenue = $firstCut = array_fill(0,$length+1,0); for ($total = 1; $total <= $length; $total++) for ($piece = 1; $piece <= min($total,count($prices)); $piece++) { $candidate = $prices[$piece-1]+$revenue[$total-$piece]; if ($candidate > $revenue[$total]) { $revenue[$total] = $candidate; $firstCut[$total] = $piece; } } $pieces = []; for ($rest = $length; $rest > 0 && $firstCut[$rest] > 0; $rest -= $firstCut[$rest]) $pieces[] = $firstCut[$rest]; return ['revenue'=>$revenue[$length],'pieces'=>$pieces]; }
