<?php
declare(strict_types=1);
namespace Ports\Patterns\Behavioral;

interface ClassicIterator { public function hasNext(): bool; public function next(): int|float; }
class NumberRange implements \IteratorAggregate {
    public function __construct(private int|float $start, private int|float $end, private int|float $step = 1) { if ($step == 0) throw new \RangeException('Step must not be zero'); }
    public function createIterator(): ClassicIterator {
        return new class($this->start, $this->end, $this->step) implements ClassicIterator {
            public function __construct(private int|float $current, private int|float $end, private int|float $step) {}
            public function hasNext(): bool { return $this->step > 0 ? $this->current < $this->end : $this->current > $this->end; }
            public function next(): int|float { $value = $this->current; $this->current += $this->step; return $value; }
        };
    }
    public function getIterator(): \Traversable { $iterator = $this->createIterator(); while ($iterator->hasNext()) yield $iterator->next(); }
}
function depthFirst(array $roots): \Generator { foreach ($roots as $root) { yield $root['value']; yield from depthFirst($root['children'] ?? []); } }
function breadthFirst(array $roots): \Generator { $queue = $roots; for ($head = 0; $head < count($queue); $head++) { $item = $queue[$head]; yield $item['value']; array_push($queue, ...($item['children'] ?? [])); } }
function take(iterable $source, int $count): \Generator { if ($count <= 0) return; foreach ($source as $item) { yield $item; if (--$count === 0) return; } }
