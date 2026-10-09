<?php
declare(strict_types=1);

final class DisjointSet
{
    private array $parent;
    private array $sizes;

    public function __construct(int $size)
    {
        if ($size < 0) throw new InvalidArgumentException('Invalid size');
        $this->parent = $size === 0 ? [] : range(0, $size - 1);
        $this->sizes = array_fill(0, $size, 1);
    }

    public function find(int $value): int
    {
        if ($value < 0 || $value >= count($this->parent)) throw new OutOfRangeException('Invalid index');
        while ($value !== $this->parent[$value]) {
            $this->parent[$value] = $this->parent[$this->parent[$value]];
            $value = $this->parent[$value];
        }
        return $value;
    }

    public function union(int $a, int $b): bool
    {
        $a = $this->find($a);
        $b = $this->find($b);
        if ($a === $b) return false;
        if ($this->sizes[$a] < $this->sizes[$b]) [$a, $b] = [$b, $a];
        $this->parent[$b] = $a;
        $this->sizes[$a] += $this->sizes[$b];
        return true;
    }
}
