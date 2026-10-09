<?php
declare(strict_types=1);
namespace Ports\DataStructures\RangeQueries;

class SparseTable {
    private array $table, $log;
    private \Closure $combine;
    public function __construct(array $values, callable $combine) {
        $this->combine = $combine(...); $n = count($values); $this->log = array_fill(0, $n + 1, 0);
        for ($i = 2; $i <= $n; $i++) $this->log[$i] = $this->log[$i >> 1] + 1;
        $this->table = [$values];
        for ($level = 1; (1 << $level) <= $n; $level++) {
            $row = []; $half = 1 << ($level - 1); $previous = $this->table[$level - 1];
            for ($i = 0; $i + (1 << $level) <= $n; $i++) $row[] = $combine($previous[$i], $previous[$i + $half]);
            $this->table[] = $row;
        }
    }
    public function query(int $left, int $right): mixed {
        if ($left < 0 || $right >= count($this->table[0]) || $left > $right) throw new \OutOfRangeException('Invalid range');
        $level = $this->log[$right - $left + 1]; return ($this->combine)($this->table[$level][$left], $this->table[$level][$right - (1 << $level) + 1]);
    }
}
function minSparseTable(array $values): SparseTable { return new SparseTable($values, min(...)); }
function maxSparseTable(array $values): SparseTable { return new SparseTable($values, max(...)); }
