<?php
declare(strict_types=1);

namespace Ports\Algorithms\Trees;

class LowestCommonAncestor {
    private array $depth; private array $up; private int $levels;
    public function __construct(array $tree,int $root = 0) { $n = count($tree); $this->levels = max(1,(int)ceil(log($n+1,2))); $this->depth = array_fill(0,$n,-1); $this->up = array_fill(0,$this->levels,array_fill(0,$n,$root)); $order = [$root]; $this->depth[$root] = 0; for ($head = 0; $head < count($order); $head++) { $v = $order[$head]; foreach ($tree[$v] ?? [] as $child) { if ($this->depth[$child] !== -1) continue; $this->depth[$child] = $this->depth[$v]+1; $this->up[0][$child] = $v; $order[] = $child; } } for ($k = 1; $k < $this->levels; $k++) for ($v = 0; $v < $n; $v++) $this->up[$k][$v] = $this->up[$k-1][$this->up[$k-1][$v]]; }
    public function ancestor(int $vertex,int $steps): int { for ($k = 0; $k < $this->levels && $steps > 0; $k++,$steps >>= 1) if ($steps&1) $vertex = $this->up[$k][$vertex]; return $vertex; }
    public function lca(int $a,int $b): int { if ($this->depth[$a] < $this->depth[$b]) [$a,$b] = [$b,$a]; $a = $this->ancestor($a,$this->depth[$a]-$this->depth[$b]); if ($a === $b) return $a; for ($k = $this->levels-1; $k >= 0; $k--) if ($this->up[$k][$a] !== $this->up[$k][$b]) { $a = $this->up[$k][$a]; $b = $this->up[$k][$b]; } return $this->up[0][$a]; }
    public function distance(int $a,int $b): int { return $this->depth[$a]+$this->depth[$b]-2*$this->depth[$this->lca($a,$b)]; }
}
