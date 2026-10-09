<?php
declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';

function verify(bool $condition, string $message = 'Check failed'): void { if (!$condition) throw new RuntimeException($message); }
function normalized(mixed $value): mixed {
    if ($value instanceof JsonSerializable) return normalized($value->jsonSerialize());
    if ($value instanceof Traversable) return normalized(iterator_to_array($value, false));
    if (is_object($value)) return normalized(get_object_vars($value));
    if (is_array($value)) return array_map(normalized(...), $value);
    return $value;
}
function equalValue(mixed $actual, mixed $expected): bool {
    if (is_int($actual) || is_float($actual)) return (is_int($expected) || is_float($expected)) && abs($actual - $expected) <= 1e-9 * max(1, abs($expected));
    if (is_array($actual) && is_array($expected)) { if (count($actual) !== count($expected)) return false; foreach ($expected as $key => $value) if (!array_key_exists($key, $actual) || !equalValue($actual[$key], $value)) return false; return true; }
    return $actual === $expected;
}
$coverage = json_decode(file_get_contents(dirname(__DIR__) . '/coverage.json'), true, 512, JSON_THROW_ON_ERROR);
foreach ($coverage as $entry) foreach ($entry['exports'] as $name) verify(function_exists($name) || class_exists($name), 'Missing export ' . $name);
$cases = json_decode(file_get_contents($argv[1]), true, 512, JSON_THROW_ON_ERROR);
foreach ($cases as $case) {
    $function = $coverage[$case['source']]['exports'][$case['name']]; $arguments = $case['args']; $actual = normalized($function(...$arguments));
    verify(equalValue($actual, $case['expected']), $case['name'] . ': ' . json_encode($actual) . ' != ' . json_encode($case['expected']));
}
$trees = [new Ports\DataStructures\Trees\AVLTree(), new Ports\DataStructures\Trees\BTree(), new Ports\DataStructures\Trees\RedBlackTree()];
$expected = []; mt_srand(168);
for ($i = 0; $i < 2000; $i++) {
    $value = mt_rand(0, 299); if (mt_rand(0, 1)) { $changed = !isset($expected[$value]); $expected[$value] = true; foreach ($trees as $tree) verify($tree->insert($value) === $changed); }
    else { $changed = isset($expected[$value]); unset($expected[$value]); foreach ($trees as $tree) verify($tree->delete($value) === $changed); }
    $values = array_keys($expected); sort($values); foreach ($trees as $tree) verify($tree->toArray() === $values); verify($trees[2]->isValid());
}
$values = range(0, 49);
$fenwick = new Ports\DataStructures\RangeQueries\FenwickTree($values); $segment = Ports\DataStructures\RangeQueries\sumSegmentTree($values); $lazy = new Ports\DataStructures\RangeQueries\LazySegmentTree($values); $sqrt = new Ports\DataStructures\RangeQueries\SqrtDecomposition($values);
for ($i = 0; $i < 1000; $i++) {
    $index = mt_rand(0, 49); $delta = mt_rand(-20, 20); $values[$index] += $delta; $fenwick->add($index, $delta); $segment->update($index, $values[$index]); $lazy->rangeAdd($index, $index, $delta); $sqrt->update($index, $values[$index]);
    $left = mt_rand(0, 49); $right = mt_rand($left, 49); $sum = array_sum(array_slice($values, $left, $right - $left + 1));
    verify($fenwick->rangeSum($left, $right) == $sum && $segment->query($left, $right) == $sum && $lazy->rangeSum($left, $right) == $sum && $sqrt->rangeSum($left, $right) == $sum);
}
$document = new Ports\Patterns\Behavioral\TextDocument(); $history = new Ports\Patterns\Behavioral\CommandHistory(); $history->run(new Ports\Patterns\Behavioral\InsertCommand($document, 0, 'abc')); verify($history->undo() && $document->content === ''); verify($history->redo() && $document->content === 'abc');
verify(Ports\Patterns\Behavioral\parseExpression('2+x*3')->interpret(['x' => 4]) == 14);
$order = new Ports\Patterns\Behavioral\Order(); $order->pay(); $order->ship(); $order->deliver(); verify($order->status === 'delivered');
$repo = new Ports\Patterns\Architectural\InMemoryRepository(); $repo->save(['id' => '1', 'nested' => ['value' => 1]])->await(); $entity = $repo->findById('1')->await(); $entity['nested']['value'] = 2; verify($repo->findById('1')->await()['nested']['value'] === 1);
$events = new Ports\Patterns\Architectural\TypedEventEmitter(); $received = 0; $events->once('tick', function($value) use (&$received): void { $received += $value; }); verify($events->emit('tick', 4) === 0); $events->emit('tick', 4); verify($received === 4);
$attempts = 0; $action = function() use (&$attempts) { if (++$attempts < 3) throw new RuntimeException('Unavailable'); return Ports\Shared\Promise::resolved(7); }; verify(Ports\Patterns\Architectural\retry($action)->await() === 7 && $attempts === 3);
$deferred = new Ports\Shared\Promise(); $result = null; $fiber = new Fiber(function() use ($deferred, &$result): void { $result = $deferred->await(); }); $fiber->start(); verify($fiber->isSuspended()); $deferred->resolve(42); verify($fiber->isTerminated() && $result === 42);
echo 'PHP: ' . count($coverage) . ' modules, ' . count($cases) . ' reference cases, 2000 tree operations, 1000 range checks and pattern checks passed' . PHP_EOL;
